#!/usr/bin/env python3
"""
gitbook_bridge.py - make Obsidian-authored markdown safe for GitBook Git Sync.

The repository's canonical format is GitBook markdown. Obsidian is used as an
editor on top of it; this script rewrites the Obsidian-only constructs that
GitBook does not understand, and keeps SUMMARY.md (GitBook's page tree) in sync.

Subcommands
  pre-commit          Normalize staged .md files (index + working tree) and sync
                      SUMMARY.md with added / deleted / renamed pages.
                      Run automatically by the git hook in ./hooks.
  fix [PATH ...]      Normalize the given files (or --all) in the working tree.
  check               Report problems across the repo without changing anything.
  add-to-summary P..  Add existing pages to SUMMARY.md (the hook only adds new ones).
  install             Point git at ./hooks (git config core.hooksPath).

Conversions (Obsidian -> GitBook)
  [[Page]] / [[Page#Heading|alias]]  -> [alias](relative/path.md#heading)
  ![[image.png|300]]                 -> <figure><img src="rel" width="300">...
  ![[file.pdf]] / ![[video.mov]]     -> {% file src="rel" %}
  ![[Note]]                          -> {% include %} (for .gitbook/includes) or
                                        a {% content-ref %} card (with warning)
  > [!warning] Title                 -> {% hint style="warning" %} ...
  > [!note]- Folded                  -> <details><summary>Folded</summary> ...
  ==highlight==                      -> <mark>highlight</mark>
  %%comment%%                        -> <!-- comment -->
  $x$  (inline math)                 -> $$x$$
  vault-root / %20 / broken paths    -> file-relative paths, <...> for spaces
  new page without "# Title"         -> H1 added from the file name
  new / deleted / renamed pages      -> SUMMARY.md entries added / removed / moved

Only the Python 3.8+ standard library is used.
"""

from __future__ import annotations

import argparse
import difflib
import fnmatch
import json
import os
import posixpath
import re
import subprocess
import sys
from typing import Dict, List, Optional, Set, Tuple
from urllib.parse import unquote

HERE = os.path.dirname(os.path.abspath(__file__))

DEFAULT_CONFIG = {
    # Files never normalized (glob, repo-relative, forward slashes).
    "normalize_exclude": [
        ".obsidian/**", ".trash/**", "tools/**", "SUMMARY.md", "**/SUMMARY.md",
    ],
    # Files never added to SUMMARY.md automatically.
    "summary_exclude": [
        ".gitbook/**", ".obsidian/**", ".trash/**", "tools/**", "**/SUMMARY.md",
        "SUMMARY.md",
    ],
    "summary_file": "SUMMARY.md",
    "sync_summary": True,
    "add_missing_h1": True,
    "convert_inline_math": True,
    # Exit non-zero from pre-commit when a link/image target cannot be found.
    "fail_on_broken_links": False,
    # Block commits where SUMMARY.md lists, or a committed page uses, a file that
    # exists only locally (GitBook then shows an empty page / broken image).
    "fail_on_uncommitted_files": True,
}

IMAGE_EXT = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".avif", ".ico"}
VIDEO_EXT = {".mp4", ".mov", ".webm", ".mkv", ".m4v", ".ogv", ".avi"}
SKIP_DIRS = {".git", ".obsidian", ".trash", "node_modules"}

CALLOUT_TO_HINT = {
    "note": "info", "info": "info", "abstract": "info", "summary": "info",
    "tldr": "info", "todo": "info", "example": "info", "quote": "info", "cite": "info",
    "tip": "success", "hint": "success", "important": "success", "success": "success",
    "check": "success", "done": "success",
    "warning": "warning", "caution": "warning", "attention": "warning",
    "question": "warning", "help": "warning", "faq": "warning",
    "failure": "danger", "fail": "danger", "missing": "danger", "danger": "danger",
    "error": "danger", "bug": "danger",
}

SCHEME_RE = re.compile(r"^(?:[a-zA-Z][a-zA-Z0-9+.\-]*:|//)")


# --------------------------------------------------------------------------- #
# Utilities
# --------------------------------------------------------------------------- #

def run_git(args: List[str], root: str, input_bytes: Optional[bytes] = None,
            check: bool = True) -> bytes:
    proc = subprocess.run(["git"] + args, cwd=root, input=input_bytes,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if check and proc.returncode != 0:
        raise RuntimeError("git %s failed: %s" % (" ".join(args),
                                                   proc.stderr.decode("utf-8", "replace")))
    return proc.stdout


def find_root() -> str:
    try:
        out = subprocess.run(["git", "rev-parse", "--show-toplevel"], cwd=HERE,
                             stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        if out.returncode == 0 and out.stdout.strip():
            return os.path.normpath(out.stdout.decode().strip())
    except OSError:
        pass
    return os.path.normpath(os.path.join(HERE, "..", ".."))


def load_config(root: str) -> dict:
    cfg = dict(DEFAULT_CONFIG)
    path = os.path.join(HERE, "config.json")
    if os.path.exists(path):
        with open(path, encoding="utf-8") as fh:
            cfg.update(json.load(fh))
    return cfg


def matches_any(path: str, patterns: List[str]) -> bool:
    for pat in patterns:
        if fnmatch.fnmatchcase(path, pat):
            return True
        if pat.endswith("/**") and (path == pat[:-3] or path.startswith(pat[:-2])):
            return True
    return False


def decode_text(data: bytes) -> Tuple[str, str, bool]:
    """Return (text with \\n newlines, newline style, had_bom)."""
    bom = data.startswith(b"\xef\xbb\xbf")
    if bom:
        data = data[3:]
    text = data.decode("utf-8")
    newline = "\r\n" if "\r\n" in text else "\n"
    return text.replace("\r\n", "\n"), newline, bom


def encode_text(text: str, newline: str, bom: bool) -> bytes:
    if newline != "\n":
        text = text.replace("\n", newline)
    data = text.encode("utf-8")
    return (b"\xef\xbb\xbf" + data) if bom else data


def slugify(heading: str) -> str:
    s = heading.strip().lower()
    s = re.sub(r"[^\w\- ]", "", s, flags=re.UNICODE)
    return re.sub(r"\s+", "-", s)


def md_target(rel: str) -> str:
    """Format a path for a markdown link target, GitBook style."""
    if re.search(r"[\s()<>]", rel):
        return "<%s>" % rel
    return rel


class Report:
    def __init__(self) -> None:
        self.warnings: List[str] = []
        self.errors: List[str] = []
        self.changes: List[str] = []

    def warn(self, path: str, msg: str) -> None:
        self.warnings.append("%s: %s" % (path, msg))

    def error(self, path: str, msg: str) -> None:
        self.errors.append("%s: %s" % (path, msg))


# --------------------------------------------------------------------------- #
# File index (for resolving link targets)
# --------------------------------------------------------------------------- #

class FileIndex:
    def __init__(self, root: str, extra: Optional[Set[str]] = None) -> None:
        self.root = root
        self.files: Set[str] = set()
        for dirpath, dirnames, filenames in os.walk(root):
            rel_dir = os.path.relpath(dirpath, root).replace(os.sep, "/")
            rel_dir = "" if rel_dir == "." else rel_dir
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            for fn in filenames:
                self.files.add(posixpath.join(rel_dir, fn) if rel_dir else fn)
        if extra:
            self.files |= extra
        self.dirs: Set[str] = set()
        self.by_name: Dict[str, List[str]] = {}
        for f in self.files:
            parent = posixpath.dirname(f)
            while parent:
                self.dirs.add(parent)
                parent = posixpath.dirname(parent)
            self.by_name.setdefault(posixpath.basename(f).lower(), []).append(f)

    def exists(self, path: str) -> bool:
        return path in self.files or path in self.dirs

    def add(self, path: str) -> None:
        self.files.add(path)
        self.by_name.setdefault(posixpath.basename(path).lower(), []).append(path)

    @staticmethod
    def closeness(p: str, src_dir: str) -> Tuple[int, int, int]:
        # Prefer: same directory, then longest shared folder prefix, then shortest path.
        a, b = posixpath.dirname(p).split("/"), src_dir.split("/") if src_dir else []
        shared = 0
        while shared < min(len(a), len(b)) and a[shared] == b[shared]:
            shared += 1
        return (0 if posixpath.dirname(p) == src_dir else 1, -shared, len(p))

    def by_basename(self, name: str, src_dir: str) -> List[str]:
        cands = self.by_name.get(name.lower(), [])
        return sorted(cands, key=lambda p: self.closeness(p, src_dir))

    def is_ambiguous(self, cands: List[str], src_dir: str) -> bool:
        """True if the best two candidates are equally close to the source note."""
        return len(cands) > 1 and \
            self.closeness(cands[0], src_dir)[:2] == self.closeness(cands[1], src_dir)[:2]


def norm_join(base_dir: str, rel: str) -> Optional[str]:
    joined = posixpath.normpath(posixpath.join(base_dir, rel)) if base_dir else posixpath.normpath(rel)
    if joined.startswith("../") or joined == "..":
        return None
    return "" if joined == "." else joined


def rel_from(src_file: str, target: str) -> str:
    src_dir = posixpath.dirname(src_file) or "."
    return posixpath.relpath(target, src_dir)


# --------------------------------------------------------------------------- #
# Masking of code / frontmatter / comments so transforms skip them
# --------------------------------------------------------------------------- #

class Masker:
    def __init__(self) -> None:
        self.store: List[str] = []

    def put(self, s: str) -> str:
        self.store.append(s)
        return "\x00%d\x00" % (len(self.store) - 1)

    def restore(self, text: str) -> str:
        pat = re.compile(r"\x00(\d+)\x00")
        for _ in range(10):  # nested placeholders
            new = pat.sub(lambda m: self.store[int(m.group(1))], text)
            if new == text:
                break
            text = new
        return text


FENCE_OPEN = re.compile(r"^( {0,3}|\s*(?:[-*+]|\d+[.)])?\s*(?:>\s*)*)(`{3,}|~{3,})")


def mask_blocks(text: str, m: Masker) -> str:
    """Mask YAML frontmatter and fenced code blocks (line based)."""
    lines = text.split("\n")
    out: List[str] = []
    i = 0
    if lines and lines[0].strip() == "---":
        for j in range(1, len(lines)):
            if lines[j].strip() in ("---", "..."):
                out.append(m.put("\n".join(lines[: j + 1])))
                i = j + 1
                break
    while i < len(lines):
        line = lines[i]
        fm = FENCE_OPEN.match(line)
        if fm:
            fence = fm.group(2)
            j = i + 1
            while j < len(lines):
                stripped = lines[j].lstrip(" \t>")
                if stripped.startswith(fence[0] * len(fence)) and stripped.strip(fence[0] + " \t") == "":
                    break
                j += 1
            block = lines[i: j + 1]
            out.append(m.put("\n".join(block)))
            i = j + 1
            continue
        out.append(line)
        i += 1
    return "\n".join(out)


INLINE_CODE = re.compile(r"(?<!`)(`+)(?!`)(.+?)(?<!`)\1(?!`)", re.S)
HTML_COMMENT = re.compile(r"<!--.*?-->", re.S)
DISPLAY_MATH = re.compile(r"\$\$.+?\$\$", re.S)


def mask_inline(text: str, m: Masker) -> str:
    text = INLINE_CODE.sub(lambda mo: m.put(mo.group(0)), text)
    text = HTML_COMMENT.sub(lambda mo: m.put(mo.group(0)), text)
    return text


# --------------------------------------------------------------------------- #
# Individual transforms
# --------------------------------------------------------------------------- #

OBS_COMMENT = re.compile(r"%%(.+?)%%", re.S)


def convert_comments(text: str) -> str:
    return OBS_COMMENT.sub(lambda mo: "<!--%s-->" % mo.group(1), text)


INLINE_MATH = re.compile(
    r"(?<![\\$\w])\$(?=[^\s$])((?:\\.|[^$\n\\])+?)(?<=[^\s\\])\$(?![\w$])")


def convert_inline_math(text: str, m: Masker) -> str:
    text = DISPLAY_MATH.sub(lambda mo: m.put(mo.group(0)), text)
    return INLINE_MATH.sub(lambda mo: m.put("$$%s$$" % mo.group(1)), text)


HIGHLIGHT = re.compile(r"(?<![=\w])==(?=[^\s=])(.+?)(?<=[^\s=])==(?![=\w])")


def convert_highlights(text: str) -> str:
    return HIGHLIGHT.sub(lambda mo: "<mark>%s</mark>" % mo.group(1), text)


CALLOUT_HEAD = re.compile(r"^(\s*)>\s?\[!([\w-]+)\]([+-]?)[ \t]*(.*)$")


def convert_callouts(text: str) -> str:
    lines = text.split("\n")
    out: List[str] = []
    i = 0
    while i < len(lines):
        mo = CALLOUT_HEAD.match(lines[i])
        if not mo:
            out.append(lines[i])
            i += 1
            continue
        indent, kind, fold, title = mo.group(1), mo.group(2).lower(), mo.group(3), mo.group(4).strip()
        body: List[str] = []
        j = i + 1
        quote_re = re.compile(r"^" + re.escape(indent) + r">\s?(.*)$")
        while j < len(lines):
            qm = quote_re.match(lines[j])
            if not qm:
                break
            body.append(qm.group(1))
            j += 1
        inner = convert_callouts("\n".join(body)).strip("\n")
        block: List[str] = []
        if fold:
            block.append("<details>")
            block.append("")
            block.append("<summary>%s</summary>" % (title or kind.capitalize()))
            block.append("")
            if inner:
                block.extend(inner.split("\n"))
                block.append("")
            block.append("</details>")
        else:
            style = CALLOUT_TO_HINT.get(kind, "info")
            block.append('{%% hint style="%s" %%}' % style)
            if title and inner:  # GitBook hints have no title: bold first line
                if title.lower() != kind:
                    block.append("**%s**" % title)
                    block.append("")
            elif title:  # "> [!info] text" with no body: the title *is* the text
                block.append(title)
            if inner:
                block.extend(inner.split("\n"))
            block.append("{% endhint %}")
        out.extend((indent + b) if b else b for b in block)
        i = j
    return "\n".join(out)


WIKILINK = re.compile(r"(!?)\[\[([^\[\]\n]+?)\]\]")


class Context:
    def __init__(self, root: str, path: str, index: FileIndex, report: Report, cfg: dict):
        self.root = root
        self.path = path
        self.dir = posixpath.dirname(path)
        self.index = index
        self.report = report
        self.cfg = cfg


def resolve_wiki(name: str, ctx: Context) -> Optional[str]:
    name = name.strip().replace("\\", "/")
    if not name:
        return None
    ext = posixpath.splitext(name)[1].lower()
    tries = [name] if ext else [name + ".md", name]
    for t in tries:
        for base in (ctx.dir, ""):
            p = norm_join(base, t)
            if p and ctx.index.exists(p):
                return p
    for t in tries:
        cands = ctx.index.by_basename(posixpath.basename(t), ctx.dir)
        if "/" in t:
            cands = [c for c in cands if c.lower().endswith(t.lower())]
        if cands:
            if ctx.index.is_ambiguous(cands, ctx.dir):
                ctx.report.warn(ctx.path, "[[%s]] is ambiguous, using %s" % (name, cands[0]))
            return cands[0]
    return None


def convert_wikilinks(text: str, ctx: Context) -> str:
    def repl(mo: "re.Match[str]") -> str:
        embed, inner = mo.group(1) == "!", mo.group(2)
        target, _, alias = inner.partition("|")
        target, _, heading = target.partition("#")
        heading = heading.split("^")[0].strip()  # drop block refs
        alias = alias.strip()
        s = mo.string
        line_end = s.find("\n", mo.end())
        line = s[s.rfind("\n", 0, mo.start()) + 1: len(s) if line_end == -1 else line_end]
        whole_line = line.strip() == mo.group(0)

        if not target.strip():  # [[#Heading]] -> same page anchor
            label = alias or heading
            return "[%s](#%s)" % (label, slugify(heading))

        resolved = resolve_wiki(target, ctx)
        if not resolved:
            ctx.report.warn(ctx.path, "unresolved wikilink %s (left as plain text)" % mo.group(0))
            return alias or target.strip()
        rel = rel_from(ctx.path, resolved)
        ext = posixpath.splitext(resolved)[1].lower()
        anchor = ("#" + slugify(heading)) if heading else ""

        if not embed:
            label = alias or posixpath.splitext(posixpath.basename(target.strip()))[0]
            return "[%s](%s%s)" % (label, md_target(rel), anchor)

        if ext in IMAGE_EXT:
            size = re.fullmatch(r"(\d+)(?:x(\d+))?", alias or "")
            if size:
                attrs = ' width="%s"' % size.group(1)
                img = '<img src="%s" alt=""%s>' % (rel, attrs)
                if whole_line:
                    return "<figure>%s<figcaption></figcaption></figure>" % img
                return img
            return "![%s](%s)" % (alias, md_target(rel))
        if not whole_line:  # block-level GitBook constructs need their own line
            label = alias or posixpath.basename(resolved)
            return "[%s](%s%s)" % (label, md_target(rel), anchor)
        if ext == ".md":
            if resolved.startswith(".gitbook/includes/"):
                return '{%% include "%s" %%}' % rel
            ctx.report.warn(ctx.path, "note embed ![[%s]] is not supported by GitBook; "
                                      "converted to a page link card" % target)
            title = alias or posixpath.splitext(posixpath.basename(resolved))[0]
            return '{%% content-ref url="%s" %%}\n[%s](%s)\n{%% endcontent-ref %%}' % (
                rel, title, md_target(rel))
        # pdf, video, other files
        caption = alias or posixpath.basename(resolved)
        return '{%% file src="%s" %%}\n%s\n{%% endfile %%}' % (rel, caption)

    return WIKILINK.sub(repl, text)


def fix_target(raw: str, ctx: Context) -> Optional[str]:
    """Return a corrected repo path for a link target, or None if fine / external."""
    if not raw or raw.startswith("#") or SCHEME_RE.match(raw) or raw.startswith("\x00"):
        return None
    path, sep, frag = raw.partition("#")
    if not path:
        return None
    decoded = unquote(path).replace("\\", "/")
    cur = norm_join(ctx.dir, decoded)
    if cur is not None and ctx.index.exists(cur):
        if decoded == path:
            return None  # already correct
        return rel_from(ctx.path, cur) + (sep + frag)
    candidates = [norm_join("", decoded.lstrip("/"))]
    if not posixpath.splitext(decoded)[1]:
        candidates += [norm_join(ctx.dir, decoded + ".md"), norm_join("", decoded.lstrip("/") + ".md")]
    for c in candidates:
        if c and ctx.index.exists(c):
            return rel_from(ctx.path, c) + (sep + frag)
    by_name = ctx.index.by_basename(posixpath.basename(decoded), ctx.dir)
    if by_name and not ctx.index.is_ambiguous(by_name, ctx.dir):
        return rel_from(ctx.path, by_name[0]) + (sep + frag)
    if by_name:
        ctx.report.warn(ctx.path, "broken link '%s' (several files named %s; fix by hand)"
                        % (raw, posixpath.basename(decoded)))
    else:
        msg = "broken link/image target '%s'" % raw
        if ctx.cfg.get("fail_on_broken_links"):
            ctx.report.error(ctx.path, msg)
        else:
            ctx.report.warn(ctx.path, msg)
    return None


MD_LINK = re.compile(
    r"(!?\[(?:[^\[\]\n]|\[[^\[\]\n]*\])*\]\()[ \t]*"
    r"(<[^<>\n]*>|(?:[^\s()<>]|\([^\s()]*\))+)"
    r"((?:[ \t]+(?:\"[^\"\n]*\"|'[^'\n]*'))?[ \t]*\))")
HTML_ATTR = re.compile(r"(<(?:img|a|video|source|audio|iframe)\b[^>]*?\b(?:src|href)=)([\"'])(.*?)\2",
                       re.I | re.S)
LIQUID_PATH = re.compile(r"(\{%\s*(?:content-ref\s+url=|file\s+src=|include\s+))([\"'])(.*?)\2")
VIDEO_LINE = re.compile(r"^([ \t]*)!\[([^\]\n]*)\]\((<[^>\n]*>|[^\s)]+)\)[ \t]*$", re.M)


def fix_links(text: str, ctx: Context) -> str:
    def md_repl(mo: "re.Match[str]") -> str:
        target = mo.group(2)
        raw = target[1:-1] if target.startswith("<") else target
        new = fix_target(raw, ctx)
        if new is None:
            return mo.group(0)
        return mo.group(1) + md_target(new) + mo.group(3)

    def attr_repl(mo: "re.Match[str]") -> str:
        new = fix_target(mo.group(3), ctx)
        return mo.group(0) if new is None else "%s%s%s%s" % (mo.group(1), mo.group(2), new, mo.group(2))

    text = MD_LINK.sub(md_repl, text)
    text = HTML_ATTR.sub(attr_repl, text)
    text = LIQUID_PATH.sub(attr_repl, text)

    # Videos embedded as images render in Obsidian but not GitBook -> file block.
    def video_repl(mo: "re.Match[str]") -> str:
        target = mo.group(3)
        raw = target[1:-1] if target.startswith("<") else target
        if SCHEME_RE.match(raw) or posixpath.splitext(unquote(raw))[1].lower() not in VIDEO_EXT:
            return mo.group(0)
        caption = mo.group(2) or posixpath.basename(unquote(raw))
        return '%s{%% file src="%s" %%}\n%s%s\n%s{%% endfile %%}' % (
            mo.group(1), unquote(raw), mo.group(1), caption, mo.group(1))

    return VIDEO_LINE.sub(video_repl, text)


def has_h1(text: str) -> bool:
    return re.search(r"^#[ \t]+\S", text, re.M) is not None


def ensure_h1(text: str, path: str) -> str:
    title = posixpath.splitext(posixpath.basename(path))[0]
    if title.lower() == "readme":
        title = posixpath.basename(posixpath.dirname(path)) or "Home"
    mo = re.match(r"(\x00\d+\x00\n?)", text)  # masked frontmatter placeholder
    if mo and text.startswith(mo.group(1)):
        head = mo.group(1)
        return head + ("" if head.endswith("\n") else "\n") + "# %s\n\n" % title + text[len(head):].lstrip("\n")
    return "# %s\n\n" % title + text.lstrip("\n")


def normalize(text: str, path: str, index: FileIndex, report: Report, cfg: dict,
              is_new: bool = False) -> str:
    ctx = Context("", path, index, report, cfg)
    m = Masker()
    t = mask_blocks(text, m)
    t = convert_comments(t)
    t = mask_inline(t, m)
    if cfg.get("convert_inline_math", True):
        t = convert_inline_math(t, m)
    t = convert_callouts(t)
    t = convert_wikilinks(t, ctx)
    t = convert_highlights(t)
    t = fix_links(t, ctx)
    if is_new and cfg.get("add_missing_h1", True) and not has_h1(m.restore(t)):
        t = ensure_h1(t, path)
    return m.restore(t)


# --------------------------------------------------------------------------- #
# SUMMARY.md handling
# --------------------------------------------------------------------------- #

SUMMARY_ENTRY = re.compile(r"^(\s*)[*\-+]\s+\[(.*)\]\((<[^>]*>|[^)\s]+)\)\s*$")


def summary_entries(lines: List[str]) -> List[Tuple[int, int, str]]:
    """List of (line_no, indent, path)."""
    out = []
    for i, line in enumerate(lines):
        mo = SUMMARY_ENTRY.match(line)
        if mo:
            target = mo.group(3)
            target = target[1:-1] if target.startswith("<") else unquote(target)
            out.append((i, len(mo.group(1).expandtabs(2)), target.split("#")[0]))
    return out


def subtree_end(lines: List[str], entries: List[Tuple[int, int, str]], idx: int) -> int:
    """Line number after the last descendant of entries[idx]."""
    line_no, indent, _ = entries[idx]
    last = line_no
    for ln, ind, _ in entries[idx + 1:]:
        if ind <= indent:
            break
        last = ln
    # stop before the next heading / blank separation
    return last + 1


def page_title(text: str, path: str) -> str:
    mo = re.search(r"^#[ \t]+(.+?)[ \t#]*$", text, re.M)
    if mo:
        title = re.sub(r"<[^>]+>", "", mo.group(1))
        title = re.sub(r"[*_`]", "", title).strip()
        if title:
            return title
    name = posixpath.splitext(posixpath.basename(path))[0]
    if name.lower() == "readme":
        name = posixpath.basename(posixpath.dirname(path)) or "Home"
    return name


def summary_add(text: str, page: str, title: str, report: Report, summary_path: str) -> str:
    lines = text.split("\n")
    sdir = posixpath.dirname(summary_path)
    rel = posixpath.relpath(page, sdir) if sdir else page
    entries = summary_entries(lines)
    if any(p == rel for _, _, p in entries):
        return text
    title = title.replace("[", "(").replace("]", ")")
    page_dir = posixpath.dirname(rel)
    is_readme = posixpath.basename(rel).lower() == "readme.md"

    def insert(after: int, indent: int) -> str:
        lines.insert(after, " " * indent + "* [%s](%s)" % (title, md_target(rel)))
        report.changes.append("%s: added '%s' -> %s" % (summary_path, title, rel))
        return "\n".join(lines)

    search_dir = posixpath.dirname(page_dir) if is_readme else page_dir
    # 1) Child of the folder's README (or of an ancestor's README).
    d = search_dir
    while True:
        readme = posixpath.join(d, "README.md") if d else "README.md"
        for k, (_, ind, p) in enumerate(entries):
            if p == readme and readme != rel:
                if not d:  # root README: become a top-level page at the end of its group
                    break
                return insert(subtree_end(lines, entries, k), ind + 2)
        # 2) Sibling of other pages in the same folder.
        sibs = [k for k, (_, _, p) in enumerate(entries)
                if posixpath.dirname(p) == d and posixpath.basename(p).lower() != "readme.md"]
        if sibs and d:
            min_ind = min(entries[k][1] for k in sibs)
            last = [k for k in sibs if entries[k][1] == min_ind][-1]
            return insert(subtree_end(lines, entries, last), min_ind)
        if not d:
            break
        d = posixpath.dirname(d)
    # 3) Fallback: append at the end of the file.
    while lines and lines[-1].strip() == "":
        lines.pop()
    report.warn(summary_path, "no parent page found for %s; appended at the end" % rel)
    lines.append("* [%s](%s)" % (title, md_target(rel)))
    lines.append("")
    report.changes.append("%s: added '%s' -> %s" % (summary_path, title, rel))
    return "\n".join(lines)


def summary_remove(text: str, page: str, report: Report, summary_path: str) -> str:
    lines = text.split("\n")
    entries = summary_entries(lines)
    for k, (ln, ind, p) in enumerate(entries):
        if p == page:
            if k + 1 < len(entries) and entries[k + 1][1] > ind:
                report.warn(summary_path, "deleted page %s still has child pages in SUMMARY.md; "
                                          "left in place - fix by hand" % page)
                return text
            del lines[ln]
            report.changes.append("%s: removed %s" % (summary_path, page))
            return "\n".join(lines)
    return text


def summary_rename(text: str, old: str, new: str, report: Report, summary_path: str) -> str:
    lines = text.split("\n")
    for ln, _, p in summary_entries(lines):
        if p == old:
            mo = SUMMARY_ENTRY.match(lines[ln])
            lines[ln] = lines[ln][: mo.start(3)] + md_target(new) + lines[ln][mo.end(3):]
            report.changes.append("%s: %s -> %s" % (summary_path, old, new))
            return "\n".join(lines)
    return text


def summary_pages(text: str) -> Set[str]:
    return {p for _, _, p in summary_entries(text.split("\n"))}


# --------------------------------------------------------------------------- #
# Git index helpers
# --------------------------------------------------------------------------- #

def staged_changes(root: str) -> List[Tuple[str, str, Optional[str]]]:
    """[(status, path, old_path)] for staged changes."""
    out = run_git(["diff", "--cached", "--name-status", "-z", "-M", "--diff-filter=ACDMR"], root)
    parts = out.decode("utf-8").split("\0")
    res = []
    i = 0
    while i < len(parts) and parts[i]:
        status = parts[i][0]
        if status in "RC":
            res.append((status, parts[i + 2], parts[i + 1]))
            i += 3
        else:
            res.append((status, parts[i + 1], None))
            i += 2
    return res


def index_read(root: str, path: str) -> Optional[bytes]:
    proc = subprocess.run(["git", "show", ":" + path], cwd=root,
                          stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    return proc.stdout if proc.returncode == 0 else None


def index_write(root: str, path: str, data: bytes) -> None:
    mode = "100644"
    ls = run_git(["ls-files", "-s", "--", path], root, check=False).decode()
    if ls.strip():
        mode = ls.split()[0]
    blob = run_git(["hash-object", "-w", "--stdin"], root, input_bytes=data).decode().strip()
    run_git(["update-index", "--add", "--cacheinfo", "%s,%s,%s" % (mode, blob, path)], root)


def transform_bytes(data: bytes, fn) -> Optional[bytes]:
    try:
        text, nl, bom = decode_text(data)
    except UnicodeDecodeError:
        return None
    new = fn(text)
    return None if new == text else encode_text(new, nl, bom)


def read_file(root: str, path: str) -> Optional[bytes]:
    full = os.path.join(root, path)
    if not os.path.isfile(full):
        return None
    with open(full, "rb") as fh:
        return fh.read()


def write_file(root: str, path: str, data: bytes) -> None:
    with open(os.path.join(root, path), "wb") as fh:
        fh.write(data)


# --------------------------------------------------------------------------- #
# Commands
# --------------------------------------------------------------------------- #

def print_report(report: Report, header: str) -> None:
    if report.changes:
        print("[%s] changes:" % header)
        for c in report.changes:
            print("  + " + c)
    if report.warnings:
        print("[%s] warnings:" % header)
        for w in report.warnings:
            print("  ! " + w)
    if report.errors:
        print("[%s] errors:" % header, file=sys.stderr)
        for e in report.errors:
            print("  x " + e, file=sys.stderr)


def cmd_precommit(root: str, cfg: dict) -> int:
    changes = staged_changes(root)
    staged_paths = {p for _, p, _ in changes}
    index = FileIndex(root, extra=staged_paths)
    report = Report()
    added: List[str] = []
    removed: List[str] = []
    renamed: List[Tuple[str, str]] = []

    for status, path, old in changes:
        if status == "D":
            if path.lower().endswith(".md"):
                removed.append(path)
            continue
        if not path.lower().endswith(".md"):
            continue
        if status in "A" or status == "C":
            added.append(path)
        elif status == "R" and old:
            renamed.append((old, path))
        if matches_any(path, cfg["normalize_exclude"]):
            continue
        is_new = status in "AC"
        # In the per-file report, warnings would be emitted twice (index + working
        # tree); collect them from the index pass only.
        fn_idx = lambda t, p=path, n=is_new: normalize(t, p, index, report, cfg, n)
        quiet = Report()
        fn_wt = lambda t, p=path, n=is_new: normalize(t, p, index, quiet, cfg, n)
        data = index_read(root, path)
        if data is not None:
            new = transform_bytes(data, fn_idx)
            if new is not None:
                index_write(root, path, new)
                report.changes.append("%s: normalized for GitBook" % path)
        wt = read_file(root, path)
        if wt is not None:
            new = transform_bytes(wt, fn_wt)
            if new is not None:
                write_file(root, path, new)

    summary = cfg["summary_file"]
    if cfg.get("sync_summary", True) and (added or removed or renamed) and summary not in removed:
        def sync(text: str, rep: Report) -> str:
            pages = summary_pages(text)
            for old, new in renamed:
                if old in pages:
                    text = summary_rename(text, old, new, rep, summary)
                elif new not in pages and not matches_any(new, cfg["summary_exclude"]):
                    added.append(new)
            for p in removed:
                text = summary_remove(text, p, rep, summary)
            # Parents first: shallow paths, and a folder's README before its pages.
            for p in sorted(set(added), key=lambda s: (s.count("/"),
                                                        posixpath.basename(s).lower() != "readme.md", s)):
                if matches_any(p, cfg["summary_exclude"]) or p in summary_pages(text):
                    continue
                body = read_file(root, p) or index_read(root, p) or b""
                title = page_title(body.decode("utf-8", "replace"), p)
                text = summary_add(text, p, title, rep, summary)
            return text

        data = index_read(root, summary)
        if data is not None:
            new = transform_bytes(data, lambda t: sync(t, report))
            if new is not None:
                index_write(root, summary, new)
        wt = read_file(root, summary)
        if wt is not None:
            new = transform_bytes(wt, lambda t: sync(t, Report()))
            if new is not None:
                write_file(root, summary, new)

    if cfg.get("fail_on_uncommitted_files", True):
        check_commit_complete(root, cfg, changes, report)

    print_report(report, "gitbook-bridge")
    if report.errors:
        print("gitbook-bridge: commit blocked (fix the errors above or commit with --no-verify)",
              file=sys.stderr)
        return 1
    return 0


def shell_quote(p: str) -> str:
    return "'%s'" % p.replace("'", "'\\''") if re.search(r"[^\w./-]", p) else p


def local_targets(text: str, path: str) -> Set[str]:
    """Repo paths of local files a page links to or embeds."""
    m = Masker()
    t = mask_inline(mask_blocks(text, m), m)
    raws: List[str] = []
    for mo in MD_LINK.finditer(t):
        target = mo.group(2)
        raws.append(target[1:-1] if target.startswith("<") else target)
    raws += [mo.group(3) for mo in HTML_ATTR.finditer(t)]
    raws += [mo.group(3) for mo in LIQUID_PATH.finditer(t)]
    out: Set[str] = set()
    for raw in raws:
        if not raw or raw.startswith(("#", "\x00")) or SCHEME_RE.match(raw):
            continue
        p = norm_join(posixpath.dirname(path), unquote(raw.split("#")[0]).replace("\\", "/"))
        if p:
            out.add(p)
    return out


def check_commit_complete(root: str, cfg: dict, changes, report: Report) -> None:
    """
    GitBook only sees what is committed. Block commits where SUMMARY.md lists a page,
    or a committed page uses an image/file, that exists only in the working tree.
    (That is what makes GitBook show an empty page or a broken image.)
    """
    tracked = set(p for p in run_git(["ls-files", "-z", "--cached"], root).decode("utf-8").split("\0") if p)
    missing: Dict[str, str] = {}  # path -> reason

    summary = cfg["summary_file"]
    sdata = index_read(root, summary)
    if sdata is not None:
        for page in sorted(summary_pages(decode_text(sdata)[0])):
            if page not in tracked:
                where = "exists locally but is not staged" if os.path.isfile(os.path.join(root, page)) \
                    else "does not exist"
                missing[page] = "listed in %s, but the page %s - GitBook will show an empty page" % (summary, where)

    for status, path, _ in changes:
        if status == "D" or not path.lower().endswith(".md"):
            continue
        data = index_read(root, path)
        if data is None:
            continue
        try:
            text = decode_text(data)[0]
        except UnicodeDecodeError:
            continue
        for target in sorted(local_targets(text, path)):
            if target in tracked or target in missing:
                continue
            if os.path.isfile(os.path.join(root, target)):
                missing[target] = "used by %s but not staged - GitBook will show it as broken" % path

    to_add = []
    for p, reason in missing.items():
        report.error(p, reason)
        if os.path.isfile(os.path.join(root, p)):
            to_add.append(shell_quote(p))
    if to_add:
        report.errors.append("add them with:  git add " + " ".join(to_add))


def all_markdown(root: str) -> List[str]:
    out = run_git(["ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", "*.md"], root)
    return sorted({p for p in out.decode("utf-8").split("\0") if p})


def cmd_fix(root: str, cfg: dict, paths: List[str], all_files: bool, dry_run: bool) -> int:
    index = FileIndex(root)
    report = Report()
    if all_files:
        paths = [p for p in all_markdown(root) if not matches_any(p, cfg["normalize_exclude"])]
    for p in paths:
        full = os.path.abspath(p if os.path.isabs(p) else os.path.join(os.getcwd(), p))
        rel = os.path.relpath(full, root).replace(os.sep, "/")
        data = read_file(root, rel)
        if data is None:
            report.warn(rel, "not found")
            continue
        text, nl, bom = decode_text(data)
        new = normalize(text, rel, index, report, cfg, is_new=False)
        if new == text:
            continue
        if dry_run:
            sys.stdout.writelines(difflib.unified_diff(
                text.splitlines(True), new.splitlines(True), "a/" + rel, "b/" + rel))
        else:
            write_file(root, rel, encode_text(new, nl, bom))
        report.changes.append("%s: normalized for GitBook" % rel)
    print_report(report, "gitbook-bridge" + (" (dry run)" if dry_run else ""))
    return 1 if report.errors else 0


def cmd_check(root: str, cfg: dict) -> int:
    index = FileIndex(root)
    report = Report()
    pending = []
    md = all_markdown(root)
    for p in md:
        if matches_any(p, cfg["normalize_exclude"]):
            continue
        data = read_file(root, p)
        if data is None:
            continue
        text, _, _ = decode_text(data)
        if normalize(text, p, index, report, cfg) != text:
            pending.append(p)
    summary = cfg["summary_file"]
    sdata = read_file(root, summary)
    if sdata is not None:
        pages = summary_pages(decode_text(sdata)[0])
        tracked = set(x for x in run_git(["ls-files", "-z", "--cached"], root).decode("utf-8").split("\0") if x)
        for p in sorted(pages):
            if not index.exists(p):
                report.error(summary, "entry points to missing file %s" % p)
            elif p not in tracked:
                report.error(summary, "entry %s is not committed - GitBook will show an empty page "
                                      "(git add %s)" % (p, shell_quote(p)))
        orphans = [p for p in md if p not in pages and not matches_any(p, cfg["summary_exclude"])]
        if orphans:
            print("Pages not listed in %s - GitBook will not show them (%d):" % (summary, len(orphans)))
            groups: Dict[str, List[str]] = {}
            for p in orphans:
                groups.setdefault(p.split("/")[0] if "/" in p else "", []).append(p)
            for top, items in sorted(groups.items()):
                if len(items) > 8 and top:
                    print("  ? %s/  (%d pages - add it to summary_exclude in config.json if intentional)"
                          % (top, len(items)))
                else:
                    for p in items:
                        print("  ? " + p)
    if pending:
        print("Files that `fix` would change (%d):" % len(pending))
        for p in pending:
            print("  ~ " + p)
    print_report(report, "gitbook-bridge check")
    return 1 if report.errors else 0


def cmd_add_to_summary(root: str, cfg: dict, paths: List[str]) -> int:
    summary = cfg["summary_file"]
    data = read_file(root, summary)
    if data is None:
        print("%s not found" % summary, file=sys.stderr)
        return 1
    report = Report()
    rels = []
    for p in paths:
        full = os.path.abspath(p if os.path.isabs(p) else os.path.join(os.getcwd(), p))
        rel = os.path.relpath(full, root).replace(os.sep, "/")
        if not os.path.isfile(full) or not rel.lower().endswith(".md"):
            report.warn(rel, "not a markdown file")
            continue
        rels.append(rel)
    rels.sort(key=lambda s: (s.count("/"), posixpath.basename(s).lower() != "readme.md", s))

    def add_all(text: str) -> str:
        for rel in rels:
            body = (read_file(root, rel) or b"").decode("utf-8", "replace")
            text = summary_add(text, rel, page_title(body, rel), report, summary)
        return text

    new = transform_bytes(data, add_all)
    if new is not None:
        write_file(root, summary, new)
    print_report(report, "gitbook-bridge")
    return 0


def text_hunks(old: str, new: str) -> List[dict]:
    """Line-level edits turning `old` into `new`, as offsets into `old`.

    Offsets are in UTF-16 code units so they line up with JavaScript strings
    (characters outside the BMP, e.g. emoji, count as 2).
    """
    a, b = old.splitlines(True), new.splitlines(True)
    offsets = [0]
    for line in a:
        offsets.append(offsets[-1] + len(line.encode("utf-16-le")) // 2)
    hunks = []
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            continue
        hunks.append({"from": offsets[i1], "to": offsets[i2], "insert": "".join(b[j1:j2])})
    return hunks


def summary_edit(root: str, cfg: dict, fn) -> List[str]:
    """Apply fn(text, report) to SUMMARY.md on disk; return change messages."""
    summary = cfg["summary_file"]
    data = read_file(root, summary)
    if data is None:
        return []
    report = Report()
    new = transform_bytes(data, lambda t: fn(t, report))
    if new is not None:
        write_file(root, summary, new)
    return report.changes + report.warnings


def cmd_serve(root: str, cfg: dict) -> int:
    """
    JSON-lines server used by the Obsidian plugin (one request per line on stdin,
    one response per line on stdout). Keeps the file index warm between edits.

      {"id":1,"cmd":"convert","path":"a/b.md","text":"...","new":false}
        -> {"id":1,"hunks":[{"from":0,"to":5,"insert":"..."}],"warnings":[...]}
      {"id":2,"cmd":"reindex"}
      {"id":3,"cmd":"summary-add","paths":["a/b.md"]}      (titles read from disk)
      {"id":4,"cmd":"summary-remove","paths":["a/b.md"]}
      {"id":5,"cmd":"summary-rename","old":"a.md","new":"b.md"}
      {"id":6,"cmd":"in-summary","path":"a/b.md"} -> {"id":6,"result":true}
    """
    index: Optional[FileIndex] = None
    stdin = sys.stdin.buffer
    stdout = sys.stdout.buffer
    summary = cfg["summary_file"]

    def reply(obj: dict) -> None:
        stdout.write((json.dumps(obj) + "\n").encode("utf-8"))
        stdout.flush()

    for raw in stdin:
        raw = raw.strip()
        if not raw:
            continue
        try:
            req = json.loads(raw.decode("utf-8"))
        except ValueError as exc:
            reply({"id": None, "error": "bad request: %s" % exc})
            continue
        rid = req.get("id")
        try:
            cmd = req.get("cmd")
            if cmd == "convert":
                path = req["path"]
                text = req["text"].replace("\r\n", "\n")
                if matches_any(path, cfg["normalize_exclude"]):
                    reply({"id": rid, "hunks": [], "warnings": []})
                    continue
                if index is None:
                    index = FileIndex(root)
                if path not in index.files:
                    index.add(path)
                report = Report()
                new = normalize(text, path, index, report, cfg, bool(req.get("new")))
                reply({"id": rid, "hunks": text_hunks(text, new) if new != text else [],
                       "warnings": report.warnings + report.errors})
            elif cmd == "reindex":
                index = None
                reply({"id": rid, "ok": True})
            elif cmd == "summary-add":
                paths = sorted(p for p in req.get("paths", [])
                               if not matches_any(p, cfg["summary_exclude"]))

                def add(text: str, rep: Report) -> str:
                    for p in sorted(paths, key=lambda s: (s.count("/"),
                                    posixpath.basename(s).lower() != "readme.md", s)):
                        body = (read_file(root, p) or b"").decode("utf-8", "replace")
                        text = summary_add(text, p, page_title(body, p), rep, summary)
                    return text
                reply({"id": rid, "changes": summary_edit(root, cfg, add)})
            elif cmd == "summary-remove":
                paths = req.get("paths", [])

                def remove(text: str, rep: Report) -> str:
                    for p in paths:
                        text = summary_remove(text, p, rep, summary)
                    return text
                reply({"id": rid, "changes": summary_edit(root, cfg, remove)})
            elif cmd == "summary-rename":
                reply({"id": rid, "changes": summary_edit(
                    root, cfg, lambda t, rep: summary_rename(t, req["old"], req["new"], rep, summary))})
            elif cmd == "in-summary":
                data = read_file(root, summary)
                pages = summary_pages(decode_text(data)[0]) if data else set()
                reply({"id": rid, "result": req["path"] in pages})
            else:
                reply({"id": rid, "error": "unknown command %r" % cmd})
        except Exception as exc:  # keep serving
            reply({"id": rid, "error": "%s: %s" % (type(exc).__name__, exc)})
    return 0


def cmd_install(root: str) -> int:
    hooks = os.path.relpath(os.path.join(HERE, "hooks"), root).replace(os.sep, "/")
    run_git(["config", "core.hooksPath", hooks], root)
    print("git core.hooksPath set to %s" % hooks)
    return 0


def main(argv: Optional[List[str]] = None) -> int:
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
        except (AttributeError, ValueError):
            pass
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("pre-commit")
    fx = sub.add_parser("fix")
    fx.add_argument("paths", nargs="*")
    fx.add_argument("--all", action="store_true", help="every markdown file in the repo")
    fx.add_argument("--dry-run", action="store_true", help="print a diff instead of writing")
    sub.add_parser("check")
    ats = sub.add_parser("add-to-summary", help="add existing pages to SUMMARY.md")
    ats.add_argument("paths", nargs="+")
    sub.add_parser("install")
    sub.add_parser("serve", help="JSON-lines server for the Obsidian plugin")
    args = ap.parse_args(argv)
    root = find_root()
    cfg = load_config(root)
    if args.cmd == "pre-commit":
        return cmd_precommit(root, cfg)
    if args.cmd == "fix":
        if not args.paths and not args.all:
            ap.error("give file paths or --all")
        return cmd_fix(root, cfg, args.paths, args.all, args.dry_run)
    if args.cmd == "check":
        return cmd_check(root, cfg)
    if args.cmd == "add-to-summary":
        return cmd_add_to_summary(root, cfg, args.paths)
    if args.cmd == "install":
        return cmd_install(root)
    if args.cmd == "serve":
        return cmd_serve(root, cfg)
    return 2


if __name__ == "__main__":
    sys.exit(main())
