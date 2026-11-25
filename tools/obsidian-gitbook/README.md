# Editing this GitBook repo in Obsidian

This repository is synced with GitBook (Git Sync), so **GitBook markdown is the
format that gets committed**. You can open the repo root as an Obsidian vault and edit
it normally. Two pieces of glue make that safe:

| Piece | Where | What it does |
| --- | --- | --- |
| **GitBook Bridge** Obsidian plugin | `.obsidian/plugins/gitbook-bridge/` | Makes GitBook pages *look right* in Obsidian. |
| **Pre-commit normalizer** | `tools/obsidian-gitbook/` | Makes Obsidian edits *work in GitBook*. Runs on every commit. |

## One-time setup

1. Install **Python 3.8+** (needed by the commit hook).
2. From the repo root, run:

   ```
   python tools/obsidian-gitbook/gitbook_bridge.py install
   ```

   This sets `git config core.hooksPath tools/obsidian-gitbook/hooks`. It applies to
   every way you commit: the command line, VS Code, GitHub Desktop and the Obsidian Git plugin.
3. In Obsidian: **Open folder as vault**, then pick the repo root. Go to **Settings →
   Community plugins**, turn on community plugins, and enable **GitBook Bridge**.
   - If you had the "Show Hidden Files" plugin on, turn it off. GitBook Bridge indexes
     only `.gitbook/`. The other plugin also exposes `.git/`, which floods search, the
     graph and "recent files" with git internals.

The shared vault settings live in `.obsidian/app.json`:

| Setting | Value | Why |
| --- | --- | --- |
| Use `[[Wikilinks]]` | off | GitBook needs `[text](path.md)` links. |
| New link format | **Relative path** | GitBook resolves paths relative to the page. Obsidian's "absolute" format broke images (`electrical/.../refs/x.png` written inside `electrical/...`). |
| Default attachment location | `.gitbook/assets` | Same place GitBook stores uploads. |
| Strict line breaks | on | GitBook joins lines that have no blank line between them, and now Obsidian does too. |
| Automatically update links | on | Renaming or moving a page also updates `SUMMARY.md`. |

## What the plugin renders

In **Reading view**:

- `{% hint %}` becomes callouts. Also rendered: `{% tabs %}` (clickable tabs),
  `{% stepper %}`, `{% columns %}`, `{% content-ref %}` (page cards), `{% embed %}`
  (YouTube/Vimeo players, link cards otherwise), `{% file %}` (download card, plus an
  inline player for videos), `{% include %}` (content from `.gitbook/includes`),
  `{% swagger %}` and `{% code title=... %}`.
- GitBook `<figure><img src="../../.gitbook/assets/...">` images resolve relative to the
  page, so they display.
- Inline `$$x$$` math renders inline, as GitBook shows it.

In **Live Preview**, the same blocks are drawn rendered while you edit. Click a block, or
its `</>` button, to drop into the source. It renders again once the cursor leaves. In
Source mode the `{% ... %}` tags are only dimmed.

**Callouts become hints as you type.** Type `> [!info] lorem ipsum` and press Enter, and
the line becomes the following, with the cursor after the text:

```
{% hint style="info" %}
lorem ipsum
{% endhint %}
```

`> [!note]- Title` + Enter gives a `<details>` expandable instead. A multi-line callout you
type or paste is converted as soon as the cursor leaves it. Its title becomes a bold
first line. Callouts already saved in a file are not converted when you open it. The
commit hook converts those. Both features can be turned off in the plugin settings.

Commands (Ctrl+P):

- **GitBook Bridge: Convert current note to GitBook format.** Runs the normalizer now
  instead of waiting for the commit.
- **GitBook Bridge: Add current note to SUMMARY.md.** For pages that exist but are missing
  from GitBook's sidebar.
- **GitBook Bridge: Check vault for GitBook problems.** Lists broken links and pages that
  GitBook won't show.
- **GitBook Bridge: Re-render GitBook blocks in this note.**

## Automatic conversion while you edit

The plugin runs `gitbook_bridge.py serve` in the background. This is the same code the
commit hook uses, so the editor and the hook always agree.

- **While typing:** about 1.5 s after you stop typing, the note is converted. Lines that
  hold your cursor are left alone until you move off them, so text never changes under
  your cursor.
- **Leaving a note:** when you switch to another note, the note you left is converted
  completely, but only if you edited it. Notes you only viewed are never changed.
- **New pages:** when you leave a page created in this session, it gets a `# Title` if it
  has none and is added to `SUMMARY.md`. Empty "Untitled" notes are skipped.
- **Deleted and renamed pages:** deleting a page removes its `SUMMARY.md` entry. Obsidian
  already updates `SUMMARY.md` links when you rename; the plugin double-checks.
- **Status bar:** shows **GitBook ✓**, or **GitBook ⚠ n** with the warnings (such as broken
  links) in its tooltip.
- **Undo:** Ctrl+Z undoes a conversion, and the plugin won't redo it until you edit again.

Toggles for all of this are in the plugin settings. If Python can't be started, the
plugin says so once and the commit hook remains the safety net.

## What gets converted

You can write Obsidian-style markdown. The plugin converts it as you edit. On commit, the
hook converts anything that's left in the staged copy and your working copy:

| You write in Obsidian | GitBook gets |
| --- | --- |
| `[[Page]]`, `[[Page#Heading\|alias]]` | `[alias](../path/page.md#heading)` |
| `![[image.png]]`, `![[image.png\|300]]` | `![](<../.gitbook/assets/image.png>)`, `<figure><img ... width="300">` |
| `![[file.pdf]]`, `![[clip.mov]]`, `![](clip.mov)` | `{% file src="..." %}` |
| `![[.gitbook/includes/x]]` | `{% include "..." %}` |
| `![[Other note]]` (transclusion) | `{% content-ref %}` card to that page (warning; GitBook can't transclude) |
| `> [!info] text` with no body | `{% hint style="info" %}` with `text` as the hint's content |
| `> [!warning] Title` + body | `{% hint style="warning" %}` with the title as a bold first line. Types map as note/info → info, tip → success, warning → warning, danger/bug → danger. |
| `> [!note]- Folded` | `<details><summary>Folded</summary>` (a GitBook expandable) |
| `==highlight==` | `<mark>highlight</mark>` |
| `%%private comment%%` | `<!-- private comment -->` |
| `$x$` inline math | `$$x$$` (GitBook's inline syntax) |
| Vault-root paths, `%20` paths, moved files | Correct page-relative paths. Paths with spaces become `<...>`. |
| New page without a `# Title` | `# <file name>` added (GitBook uses the H1 as the page title) |
| New page | Added to `SUMMARY.md` under the folder's `README.md`, next to its siblings, or under the nearest ancestor page |
| Renamed / deleted page | `SUMMARY.md` entry moved / removed |

Rules:

- Code blocks, inline code, frontmatter and existing `$$math$$` are never touched.
- Content that is already GitBook-formatted passes through unchanged. Running the
  normalizer twice gives the same output.
- Partially staged files are safe. The staged copy and the working copy are converted
  separately, so your unstaged hunks stay unstaged.
- Problems that can't be fixed automatically (a broken link, an ambiguous
  `[[name]]`) are printed as warnings. To make broken links block the commit, set
  `"fail_on_broken_links": true` in `config.json`.
- To skip the hook once, run `git commit --no-verify`.

## Command line

```
python tools/obsidian-gitbook/gitbook_bridge.py check                 # report only
python tools/obsidian-gitbook/gitbook_bridge.py fix --all --dry-run   # show what would change
python tools/obsidian-gitbook/gitbook_bridge.py fix "path/to/page.md" # convert specific files
python tools/obsidian-gitbook/gitbook_bridge.py add-to-summary "path/to/page.md"
```

`config.json` controls which files are skipped (`normalize_exclude`), which files are never
auto-added to the table of contents (`summary_exclude`), and the toggles for each feature.

## Limitations

- In Live Preview, a GitBook block renders only when its tags sit on their own lines. A
  `{% %}` tag in the middle of a paragraph stays as text.
- GitBook has no transclusion, Dataview, Canvas, Excalidraw or Mermaid. Pages that
  depend on these won't look the same on the site.
- Hint blocks inside hint blocks render in Obsidian, but GitBook may flatten them.
- Heading anchors use GitHub-style slugs (`My Heading` becomes `#my-heading`).
