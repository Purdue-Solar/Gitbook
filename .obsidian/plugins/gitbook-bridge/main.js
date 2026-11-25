/*
 * GitBook Bridge - lets a GitBook Git Sync repository be edited as an Obsidian vault.
 *
 *  - Indexes the hidden `.gitbook/` folder (assets + includes) so images, files and
 *    links into it resolve, without exposing `.git/` the way "show hidden files" does.
 *  - Renders GitBook liquid blocks in Reading view: hint, tabs/tab, stepper/step,
 *    columns/column, content-ref, embed, file, include, swagger, code.
 *  - Resolves file-relative paths in raw HTML (<img src>, <video>, <a href>), which is
 *    how GitBook writes figures, so they display in Obsidian.
 *  - Makes GitBook's inline `$$x$$` math render inline instead of as a display block.
 *  - Dims `{% ... %}` tags in the editor and adds commands that run the repo's
 *    normalizer (tools/obsidian-gitbook/gitbook_bridge.py).
 *
 * Plain CommonJS, no build step. The source of truth lives in the repository.
 */
'use strict';

const obsidian = require('obsidian');
const {
  Plugin, PluginSettingTab, Setting, MarkdownRenderer, MarkdownRenderChild,
  Notice, Modal, setIcon,
} = obsidian;

const DEFAULT_SETTINGS = {
  revealFolders: ['.gitbook'],
  renderBlocks: true,
  livePreviewBlocks: true,
  autoConvertCallouts: true,
  autoConvert: true,
  autoConvertDelay: 1500,
  autoSummary: true,
  fixHtmlPaths: true,
  inlineMath: true,
  pythonCommand: '',
  scriptPath: 'tools/obsidian-gitbook/gitbook_bridge.py',
};

const HINT = {
  info: { callout: 'info', icon: 'info', label: 'Info' },
  success: { callout: 'success', icon: 'check', label: 'Success' },
  warning: { callout: 'warning', icon: 'alert-triangle', label: 'Warning' },
  danger: { callout: 'danger', icon: 'zap', label: 'Danger' },
};

const VIDEO_EXT = ['mp4', 'mov', 'webm', 'mkv', 'm4v', 'ogv'];
const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif'];
const SCHEME_RE = /^(?:[a-z][a-z0-9+.\-]*:|\/\/)/i;

/* ------------------------------------------------------------------------- */
/* Path helpers                                                              */
/* ------------------------------------------------------------------------- */

function dirname(p) {
  const i = p.lastIndexOf('/');
  return i < 0 ? '' : p.slice(0, i);
}

function joinPath(base, rel) {
  const parts = (base ? base.split('/') : []).concat(rel.split('/'));
  const out = [];
  for (const part of parts) {
    if (!part || part === '.') continue;
    if (part === '..') {
      if (!out.length) return null; // escapes the vault
      out.pop();
    } else out.push(part);
  }
  return out.join('/');
}

function extname(p) {
  const m = /\.([^./]+)$/.exec(p);
  return m ? m[1].toLowerCase() : '';
}

function safeDecode(s) {
  try { return decodeURIComponent(s); } catch (e) { return s; }
}

/* ------------------------------------------------------------------------- */
/* Liquid ({% %}) parser                                                     */
/* ------------------------------------------------------------------------- */

const TAG_RE = /\{%[ \t]*(end)?([a-zA-Z][\w-]*)((?:(?!%\})[^\n])*?)[ \t]*%\}/g;
const DETAILS_RE = /^[ \t]*<(\/)?details\b([^>\n]*)>[ \t]*$/gim;
const SUMMARY_RE = /^\s*<summary\b[^>]*>([\s\S]*?)<\/summary>/i;
const ATTR_RE =/([a-zA-Z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"']+))/g;

/** Blank out fenced code blocks and inline code so tags inside them are ignored. */
function maskCode(text) {
  const lines = text.split('\n');
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = /^\s*(?:>\s*)*(`{3,}|~{3,})/.exec(line);
    if (fence) {
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length && /^\s*(?:>\s*)*[`~]+\s*$/.test(line)) fence = null;
      lines[i] = ' '.repeat(line.length);
    } else if (m) {
      fence = m[1];
      lines[i] = ' '.repeat(line.length);
    }
  }
  return lines.join('\n').replace(/(`+)(?!`)[^\n]*?[^`]\1(?!`)|``/g, (s) => ' '.repeat(s.length));
}

function parseAttrs(s) {
  const attrs = {};
  let m;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(s))) attrs[m[1]] = m[2] != null ? m[2] : m[3] != null ? m[3] : m[4];
  const bare = /^\s*(?:"([^"]*)"|'([^']*)')/.exec(s); // {% include "path" %}
  if (bare) attrs._ = bare[1] != null ? bare[1] : bare[2];
  return attrs;
}

/**
 * Parse text into a tree. Paired tags ({% x %}..{% endx %}) get children;
 * tags with no matching end ({% include %}, single {% embed %}) are leaves.
 * Node: {type:'tag', name, attrs, start, end, children} | {type:'text', start, end}
 */
function parseLiquid(text) {
  const masked = maskCode(text);
  const tokens = [];
  let m;
  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(masked))) {
    tokens.push({ end: !!m[1], name: m[2].toLowerCase(), attrs: parseAttrs(text.slice(m.index, m.index + m[0].length).replace(/^\{%\s*\w[\w-]*|%\}$/g, '')), s: m.index, e: m.index + m[0].length });
  }
  // GitBook expandables: <details> / <summary> / body / </details> on separate
  // blank-line-separated lines, which Obsidian would otherwise split into
  // unrelated HTML sections.
  DETAILS_RE.lastIndex = 0;
  while ((m = DETAILS_RE.exec(masked))) {
    const open = !m[1];
    tokens.push({ end: !open, name: 'details', attrs: open && /\bopen\b/i.test(m[2] || '') ? { open: '' } : {}, s: m.index, e: m.index + m[0].length });
  }
  tokens.sort((x, y) => x.s - y.s);
  // Pair openers with closers using a stack; unmatched openers become leaves.
  const stack = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!t.end) { stack.push(i); continue; }
    for (let k = stack.length - 1; k >= 0; k--) {
      const o = tokens[stack[k]];
      if (o.name === t.name) {
        o.pair = i; t.opener = stack[k];
        stack.length = k;
        break;
      }
    }
  }
  function build(from, to, tStart, tEnd) {
    const children = [];
    let pos = from;
    for (let i = tStart; i < tEnd; i++) {
      const t = tokens[i];
      if (t.end) continue; // stray closers stay as text
      if (t.s > pos) children.push({ type: 'text', start: pos, end: t.s });
      const node = { type: 'tag', name: t.name, attrs: t.attrs, start: t.s, end: t.e, children: [] };
      if (t.pair != null) {
        const close = tokens[t.pair];
        node.children = build(t.e, close.s, i + 1, t.pair);
        node.end = close.e;
        i = t.pair;
      }
      children.push(node);
      pos = node.end;
    }
    if (to > pos) children.push({ type: 'text', start: pos, end: to });
    return children;
  }
  return build(0, text.length, 0, tokens.length);
}

/** Line-based regions (expanded to paragraph boundaries) covered by top-level tags. */
function computeRegions(text) {
  const nodes = parseLiquid(text).filter((n) => n.type === 'tag');
  if (!nodes.length) return [];
  const lineStarts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') lineStarts.push(i + 1);
  const lines = text.split('\n');
  const lineOf = (off) => {
    let lo = 0, hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= off) lo = mid; else hi = mid - 1;
    }
    return lo;
  };
  const isBreak = (l) => l == null || /^\s*$/.test(l) || /^#{1,6}\s/.test(l) || /^\s*(```|~~~)/.test(l);
  const regions = [];
  for (const n of nodes) {
    let a = lineOf(n.start), b = lineOf(Math.max(n.start, n.end - 1));
    while (a > 0 && !isBreak(lines[a - 1]) && !isBreak(lines[a])) a--;
    while (b < lines.length - 1 && !isBreak(lines[b + 1]) && !isBreak(lines[b])) b++;
    const last = regions[regions.length - 1];
    if (last && a <= last.endLine + 1) last.endLine = Math.max(last.endLine, b);
    else regions.push({ startLine: a, endLine: b });
  }
  return regions.map((r) => ({
    startLine: r.startLine,
    endLine: r.endLine,
    text: lines.slice(r.startLine, r.endLine + 1).join('\n'),
  }));
}

/**
 * Exact character ranges for Live Preview widgets: top-level blocks that sit on
 * their own lines, extended to whole lines. Overlapping ranges are merged.
 */
function livePreviewRegions(text) {
  const out = [];
  for (const n of parseLiquid(text)) {
    if (n.type !== 'tag') continue;
    const from = text.lastIndexOf('\n', n.start - 1) + 1;
    let to = text.indexOf('\n', n.end);
    if (to < 0) to = text.length;
    if (text.slice(from, n.start).trim() || text.slice(n.end, to).trim()) continue; // inline: leave as text
    const last = out[out.length - 1];
    if (last && from <= last.to) { last.to = Math.max(last.to, to); continue; }
    out.push({ from, to });
  }
  for (const r of out) r.text = text.slice(r.from, r.to);
  return out;
}

/* ------------------------------------------------------------------------- */
/* Callout -> hint conversion (mirrors tools/obsidian-gitbook/gitbook_bridge.py) */
/* ------------------------------------------------------------------------- */

const CALLOUT_TO_HINT = {
  note: 'info', info: 'info', abstract: 'info', summary: 'info', tldr: 'info', todo: 'info',
  example: 'info', quote: 'info', cite: 'info',
  tip: 'success', hint: 'success', important: 'success', success: 'success', check: 'success', done: 'success',
  warning: 'warning', caution: 'warning', attention: 'warning', question: 'warning', help: 'warning', faq: 'warning',
  failure: 'danger', fail: 'danger', missing: 'danger', danger: 'danger', error: 'danger', bug: 'danger',
};
const CALLOUT_HEAD_RE = /^(\s*)>\s?\[!([\w-]+)\]([+-]?)[ \t]*(.*)$/;

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function insideFence(text, pos) {
  const before = text.slice(0, pos).split('\n');
  let fence = null;
  for (const line of before.slice(0, -1)) {
    const m = /^\s*(`{3,}|~{3,})/.exec(line);
    if (!m) continue;
    if (!fence) fence = m[1];
    else if (m[1][0] === fence[0] && m[1].length >= fence.length) fence = null;
  }
  return !!fence;
}

/** Build a block from a header-only callout. Returns text and cursor offset. */
function calloutHeaderToBlock(m) {
  const indent = m[1], kind = m[2].toLowerCase(), fold = m[3], title = m[4].trim();
  if (fold) {
    const head = indent + '<details>\n\n' + indent + '<summary>' + (title || kind[0].toUpperCase() + kind.slice(1)) + '</summary>\n\n' + indent;
    return { text: head + '\n\n' + indent + '</details>', cursor: head.length };
  }
  const head = indent + '{% hint style="' + (CALLOUT_TO_HINT[kind] || 'info') + '" %}\n' + indent + title;
  return { text: head + '\n' + indent + '{% endhint %}', cursor: head.length };
}

/** Same rules as the Python converter (titles become bold only when there is a body). */
function convertCalloutsText(text) {
  const lines = text.split('\n');
  const out = [];
  for (let i = 0; i < lines.length;) {
    const m = CALLOUT_HEAD_RE.exec(lines[i]);
    if (!m) { out.push(lines[i]); i++; continue; }
    const indent = m[1], kind = m[2].toLowerCase(), fold = m[3], title = m[4].trim();
    const quote = new RegExp('^' + escapeRe(indent) + '>\\s?(.*)$');
    const body = [];
    let j = i + 1;
    for (; j < lines.length; j++) {
      const q = quote.exec(lines[j]);
      if (!q) break;
      body.push(q[1]);
    }
    const inner = convertCalloutsText(body.join('\n')).replace(/^\n+|\n+$/g, '');
    const block = [];
    if (fold) {
      block.push('<details>', '', '<summary>' + (title || kind[0].toUpperCase() + kind.slice(1)) + '</summary>', '');
      if (inner) block.push(...inner.split('\n'), '');
      block.push('</details>');
    } else {
      block.push('{% hint style="' + (CALLOUT_TO_HINT[kind] || 'info') + '" %}');
      if (title && inner) {
        if (title.toLowerCase() !== kind) block.push('**' + title + '**', '');
      } else if (title) block.push(title);
      if (inner) block.push(...inner.split('\n'));
      block.push('{% endhint %}');
    }
    for (const b of block) out.push(b ? indent + b : b);
    i = j;
  }
  return out.join('\n');
}

/** Line range {from,to} of the callout containing 1-based line `n`, or null. */
function findCalloutBlock(doc, n) {
  // walk up to the header
  let h = n;
  while (h >= 1) {
    const t = doc.line(h).text;
    if (CALLOUT_HEAD_RE.test(t)) break;
    if (!/^\s*>/.test(t)) return null;
    h--;
  }
  if (h < 1) return null;
  const m = CALLOUT_HEAD_RE.exec(doc.line(h).text);
  const quote = new RegExp('^' + escapeRe(m[1]) + '>');
  let e = h;
  while (e < doc.lines && quote.test(doc.line(e + 1).text)) e++;
  if (n > e) return null;
  return { from: doc.line(h).from, to: doc.line(e).to };
}

/* ------------------------------------------------------------------------- */
/* Plugin                                                                    */
/* ------------------------------------------------------------------------- */

class GitBookBridgePlugin extends Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.regionCache = new Map(); // sourcePath -> {text, regions}
    this.hosts = new Map(); // `${sourcePath}:${startLine}` -> {el, text, ctx}
    this.revealed = new Set();

    this.addSettingTab(new BridgeSettingTab(this.app, this));
    this.registerMarkdownPostProcessor((el, ctx) => this.postProcess(el, ctx), 50);
    this.registerEditorDecorations();
    this.registerCommands();

    this.converter = new Converter(this);
    this.createdThisSession = new Set();
    this.editedPaths = new Set();
    this.statusEl = this.addStatusBarItem();
    this.statusEl.addClass('gb-status');
    this.app.workspace.onLayoutReady(() => {
      this.enableReveal();
      this.registerAutoConvert();
    });
  }

  onunload() {
    this.disableReveal();
    if (this.converter) this.converter.stop();
  }

  /* ---------------- automatic conversion (via the Python normalizer) ---------------- */

  setStatus(text, tooltip) {
    if (!this.statusEl) return;
    this.statusEl.setText(text);
    this.statusEl.setAttr('aria-label', tooltip || '');
    this.statusEl.setAttr('data-tooltip-position', 'top');
  }

  showWarnings(path, warnings) {
    const active = this.app.workspace.getActiveFile();
    if (!active || active.path !== path) return;
    if (!warnings || !warnings.length) this.setStatus('GitBook ✓', 'Note is GitBook-compatible');
    else this.setStatus('GitBook ⚠ ' + warnings.length, warnings.map((w) => w.replace(path + ': ', '')).join('\n'));
  }

  /** Ask the normalizer for edits. Returns {hunks, warnings} or null. */
  async requestConvert(path, text, isNew) {
    if (!this.settings.autoConvert) return null;
    try {
      return await this.converter.request({ cmd: 'convert', path, text, new: !!isNew });
    } catch (e) {
      console.warn('[gitbook-bridge] convert failed', e);
      return null;
    }
  }

  /**
   * Convert the note shown in a CodeMirror view. With skipCursorLines, hunks that
   * touch a line holding a cursor are held back (applied once the cursor moves).
   * Returns true if some hunks were deferred.
   */
  async convertView(view, path, { skipCursorLines, isNew } = {}) {
    const text = view.state.doc.toString();
    const res = await this.requestConvert(path, text, isNew);
    if (!res || res.error) return false;
    this.showWarnings(path, res.warnings);
    if (!res.hunks.length) return false;
    if (!view.dom.isConnected || view.state.doc.toString() !== text) return false; // stale
    const doc = view.state.doc;
    const cursorLines = new Set();
    for (const r of view.state.selection.ranges) {
      cursorLines.add(doc.lineAt(r.head).number);
      cursorLines.add(doc.lineAt(r.anchor).number);
    }
    let deferred = false;
    const changes = [];
    for (const h of res.hunks) {
      const first = doc.lineAt(h.from).number;
      const last = doc.lineAt(Math.max(h.from, h.to - 1)).number;
      let touches = false;
      if (skipCursorLines) for (const l of cursorLines) if (l >= first && l <= Math.max(last, first)) touches = true;
      if (touches) { deferred = true; continue; }
      changes.push({ from: h.from, to: h.to, insert: h.insert });
    }
    if (changes.length) view.dispatch({ changes, userEvent: 'input.gitbook-convert' });
    return deferred;
  }

  /** Convert a note that is not open in any editor, on disk. */
  async convertOnDisk(file, isNew) {
    const text = await this.app.vault.read(file);
    const res = await this.requestConvert(file.path, text, isNew);
    if (!res || res.error || !res.hunks.length) return;
    await this.app.vault.process(file, (data) => {
      if (data !== text) return data; // changed meanwhile; the commit hook will catch it
      let out = data;
      for (const h of res.hunks.slice().sort((a, b) => b.from - a.from)) out = out.slice(0, h.from) + h.insert + out.slice(h.to);
      return out;
    });
  }

  findView(path) {
    for (const leaf of this.app.workspace.getLeavesOfType('markdown')) {
      const v = leaf.view;
      if (v && v.file && v.file.path === path && v.editor && v.editor.cm) return v.editor.cm;
    }
    return null;
  }

  /** Full conversion when leaving a note, plus H1 / SUMMARY.md for new pages. */
  async finalizeFile(path) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!file || !(file instanceof obsidian.TFile) || file.extension !== 'md') return;
    const isNew = this.createdThisSession.has(path);
    if (!isNew && !this.editedPaths.has(path)) return; // only viewed: leave untouched
    this.editedPaths.delete(path);
    if (isNew) {
      const text = await this.app.vault.cachedRead(file);
      if (!text.trim()) return; // still an empty "Untitled" note
    }
    const view = this.findView(path);
    if (view) await this.convertView(view, path, { skipCursorLines: false, isNew });
    else await this.convertOnDisk(file, isNew);
    if (isNew && this.settings.autoSummary) {
      try {
        const res = await this.converter.request({ cmd: 'in-summary', path });
        if (res && res.result === false) {
          const added = await this.converter.request({ cmd: 'summary-add', paths: [path] });
          if (added && added.changes && added.changes.length) new Notice('GitBook: ' + added.changes.join('\n'), 6000);
        }
        this.createdThisSession.delete(path);
      } catch (e) { console.warn('[gitbook-bridge] summary-add failed', e); }
    }
  }

  registerAutoConvert() {
    const plugin = this;
    const isMd = (f) => f instanceof obsidian.TFile && f.extension === 'md';
    let reindexTimer = null;
    const reindexSoon = () => {
      clearTimeout(reindexTimer);
      reindexTimer = setTimeout(() => this.converter.request({ cmd: 'reindex' }).catch(() => {}), 500);
    };

    this.registerEvent(this.app.vault.on('create', (f) => {
      reindexSoon();
      if (isMd(f)) this.createdThisSession.add(f.path);
    }));
    this.registerEvent(this.app.vault.on('delete', (f) => {
      reindexSoon();
      if (!isMd(f)) return;
      this.createdThisSession.delete(f.path);
      if (this.settings.autoSummary && this.settings.autoConvert) {
        this.converter.request({ cmd: 'summary-remove', paths: [f.path] }).then((r) => {
          if (r && r.changes && r.changes.length) new Notice('GitBook: ' + r.changes.join('\n'), 6000);
        }).catch(() => {});
      }
    }));
    this.registerEvent(this.app.vault.on('rename', (f, oldPath) => {
      reindexSoon();
      if (!isMd(f)) return;
      if (this.createdThisSession.delete(oldPath)) this.createdThisSession.add(f.path);
      // Obsidian rewrites links in SUMMARY.md itself; this is a backstop.
      if (this.settings.autoSummary && this.settings.autoConvert) {
        setTimeout(() => this.converter.request({ cmd: 'summary-rename', old: oldPath, new: f.path }).catch(() => {}), 1500);
      }
    }));

    // Leaving a note: convert it completely (no cursor-line hold back).
    let current = this.app.workspace.getActiveFile();
    current = current ? current.path : null;
    this.registerEvent(this.app.workspace.on('active-leaf-change', () => {
      const f = this.app.workspace.getActiveFile();
      const next = f ? f.path : null;
      if (current && current !== next) this.finalizeFile(current);
      current = next;
      if (!f) this.setStatus('');
    }));
    this.registerEvent(this.app.workspace.on('quit', () => { if (current) this.finalizeFile(current); }));

    // While typing: debounce, then convert everything except the lines being edited.
    let cm;
    try { cm = require('@codemirror/view'); } catch (e) { return; }
    this.registerEditorExtension(cm.ViewPlugin.fromClass(class {
      constructor(view) { this.view = view; this.timer = null; this.deferred = false; }
      update(u) {
        if (!plugin.settings.autoConvert) return;
        let userEdit = false;
        for (const tr of u.transactions) {
          if (!tr.docChanged) continue;
          if (tr.isUserEvent('undo') || tr.isUserEvent('redo')) { userEdit = false; this.deferred = false; clearTimeout(this.timer); return; }
          if (tr.isUserEvent('input.gitbook-convert') || tr.isUserEvent('input.gitbook-callout')) continue;
          if (tr.isUserEvent('input') || tr.isUserEvent('paste') || tr.isUserEvent('delete') || tr.isUserEvent('move') || tr.isUserEvent('drop')) userEdit = true;
        }
        if (userEdit) {
          try {
            const info = u.state.field(obsidian.editorInfoField);
            if (info && info.file) plugin.editedPaths.add(info.file.path);
          } catch (e) { /* ignore */ }
          this.schedule(plugin.settings.autoConvertDelay);
        }
        else if (this.deferred && u.selectionSet) {
          // cursor moved off a held-back line: apply soon
          const doc = u.state.doc;
          const before = u.startState.doc.lineAt(Math.min(u.startState.selection.main.head, u.startState.doc.length)).number;
          const after = doc.lineAt(u.state.selection.main.head).number;
          if (before !== after) this.schedule(250);
        }
      }
      schedule(ms) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.run(), ms);
      }
      async run() {
        const view = this.view;
        if (!view.dom.isConnected) return;
        let path = '';
        try { const info = view.state.field(obsidian.editorInfoField); path = info && info.file ? info.file.path : ''; } catch (e) { /* ignore */ }
        if (!path || !path.endsWith('.md')) return;
        this.deferred = await plugin.convertView(view, path, { skipCursorLines: true, isNew: false });
      }
      destroy() { clearTimeout(this.timer); }
    }));
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  /* ---------------- hidden folder indexing ---------------- */

  shouldReveal(path) {
    if (!path) return false;
    const parts = path.split('/');
    if (!this.settings.revealFolders.includes(parts[0])) return false;
    return !parts.slice(1).some((p) => p.startsWith('.'));
  }

  async enableReveal() {
    const adapter = this.app.vault.adapter;
    if (!this.settings.revealFolders.length || this.origReconcileDeletion) return;
    if (!adapter || typeof adapter.reconcileDeletion !== 'function' || typeof adapter.reconcileFileInternal !== 'function') {
      console.warn('[gitbook-bridge] vault adapter internals changed; .gitbook will stay hidden');
      return;
    }
    const plugin = this;
    const orig = adapter.reconcileDeletion;
    this.origReconcileDeletion = orig;
    adapter.reconcileDeletion = async function (realPath, normalizedPath, ...rest) {
      if (plugin.shouldReveal(normalizedPath)) {
        let exists = false;
        try {
          exists = typeof adapter._exists === 'function'
            ? await adapter._exists(adapter.getFullPath(normalizedPath), normalizedPath)
            : await adapter.exists(normalizedPath);
        } catch (e) { exists = false; }
        if (exists) {
          plugin.revealed.add(normalizedPath);
          await adapter.reconcileFileInternal(adapter.getRealPath ? adapter.getRealPath(normalizedPath) : realPath, normalizedPath);
          return;
        }
        plugin.revealed.delete(normalizedPath);
      }
      return orig.call(this, realPath, normalizedPath, ...rest);
    };
    try {
      for (const folder of this.settings.revealFolders) {
        if (await adapter.exists(folder)) {
          await adapter.reconcileFileInternal(adapter.getRealPath ? adapter.getRealPath(folder) : folder, folder);
        }
      }
      await adapter.listRecursive('');
    } catch (e) {
      console.error('[gitbook-bridge] failed to index hidden folders', e);
    }
  }

  async disableReveal() {
    const adapter = this.app.vault.adapter;
    if (!this.origReconcileDeletion) return;
    adapter.reconcileDeletion = this.origReconcileDeletion;
    this.origReconcileDeletion = null;
    const paths = Array.from(this.revealed).sort((a, b) => b.length - a.length);
    this.revealed.clear();
    for (const p of paths) {
      try { await adapter.reconcileDeletion(adapter.getRealPath ? adapter.getRealPath(p) : p, p); } catch (e) { /* ignore */ }
    }
  }

  /* ---------------- path resolution ---------------- */

  fileExists(path) {
    if (path == null) return false;
    if (this.app.vault.getAbstractFileByPath(path)) return true;
    try {
      const fs = require('fs');
      const base = this.app.vault.adapter.getBasePath();
      return fs.existsSync(require('path').join(base, path));
    } catch (e) {
      return false;
    }
  }

  /** Resolve a GitBook (file-relative) or Obsidian (vault-root) path to a vault path. */
  resolve(raw, sourcePath) {
    if (!raw || SCHEME_RE.test(raw) || raw.startsWith('#')) return null;
    const clean = safeDecode(raw.replace(/^<|>$/g, '').split('#')[0].split('?')[0]);
    if (!clean) return null;
    const candidates = [joinPath(dirname(sourcePath || ''), clean), joinPath('', clean.replace(/^\/+/, ''))];
    for (const c of candidates) if (c && this.fileExists(c)) return c;
    return null;
  }

  resourceUrl(path) {
    return this.app.vault.adapter.getResourcePath(path);
  }

  /* ---------------- post processor ---------------- */

  postProcess(el, ctx) {
    if (this.settings.fixHtmlPaths) this.fixPaths(el, ctx.sourcePath);
    if (this.settings.inlineMath) this.fixInlineMath(el);
    if (!this.settings.renderBlocks) return;

    const info = ctx.getSectionInfo(el);
    if (!info) return;
    const regions = this.getRegions(ctx.sourcePath, info.text);
    for (const r of regions) {
      if (info.lineEnd < r.startLine || info.lineStart > r.endLine) continue;
      const key = ctx.sourcePath + ':' + r.startLine;
      if (info.lineStart <= r.startLine) {
        // Host section: render the whole region (plus any of this section past it).
        const lines = info.text.split('\n');
        const end = Math.max(r.endLine, info.lineEnd);
        const md = lines.slice(info.lineStart, end + 1).join('\n');
        this.hosts.set(key, { el, text: r.text });
        this.renderHost(el, md, ctx);
      } else {
        // Section inside a region rendered elsewhere: hide it, keeping any tail.
        const host = this.hosts.get(key);
        if (host && host.el.isConnected && host.text !== r.text && !host.rerendering) {
          host.rerendering = true; // the region changed: refresh the host once
          host.text = r.text;
          this.renderHost(host.el, r.text, ctx).finally(() => { host.rerendering = false; });
        }
        if (info.lineEnd > r.endLine) {
          const lines = info.text.split('\n');
          const tail = lines.slice(r.endLine + 1, info.lineEnd + 1).join('\n');
          el.empty();
          this.renderMarkdown(tail, el, ctx.sourcePath, this.childFor(el, ctx));
        } else {
          el.addClass('gb-hidden');
        }
      }
      return;
    }
  }

  getRegions(sourcePath, text) {
    const cached = this.regionCache.get(sourcePath);
    if (cached && cached.text === text) return cached.regions;
    const regions = computeRegions(text);
    this.regionCache.set(sourcePath, { text, regions });
    return regions;
  }

  childFor(el, ctx) {
    const child = new MarkdownRenderChild(el);
    ctx.addChild(child);
    return child;
  }

  async renderHost(el, md, ctx) {
    el.empty();
    el.removeClass('gb-hidden');
    el.addClass('gb-host');
    const component = this.childFor(el, ctx);
    try {
      await this.renderLiquid(md, el, ctx.sourcePath, component, 0);
    } catch (e) {
      console.error('[gitbook-bridge] render failed', e);
      el.empty();
      await this.renderMarkdown(md, el, ctx.sourcePath, component);
    }
  }

  /** Rewrite file-relative HTML src attributes to resource URLs before rendering. */
  preprocess(md, sourcePath) {
    return md.replace(/(<(?:img|video|source|audio)\b[^>]*?\bsrc=)(["'])([^"']+)\2/gi, (all, pre, q, src) => {
      const p = this.resolve(src, sourcePath);
      return p ? pre + q + this.resourceUrl(p) + q : all;
    });
  }

  async renderMarkdown(md, el, sourcePath, component) {
    md = this.preprocess(md, sourcePath);
    if (MarkdownRenderer.render) await MarkdownRenderer.render(this.app, md, el, sourcePath, component);
    else await MarkdownRenderer.renderMarkdown(md, el, sourcePath, component);
    this.fixPaths(el, sourcePath);
  }

  async renderLiquid(md, el, sourcePath, component, depth) {
    await this.renderNodes(parseLiquid(md), md, el, sourcePath, component, depth);
  }

  async renderNodes(nodes, md, el, sourcePath, component, depth) {
    for (const n of nodes) {
      if (n.type === 'text') {
        const chunk = md.slice(n.start, n.end);
        if (chunk.trim()) await this.renderMarkdown(chunk, el.createDiv({ cls: 'gb-md' }), sourcePath, component);
      } else {
        await this.renderTag(n, md, el, sourcePath, component, depth);
      }
    }
  }

  async renderTag(n, md, el, sourcePath, component, depth) {
    const kids = (target) => this.renderNodes(n.children, md, target, sourcePath, component, depth);
    const a = n.attrs || {};
    switch (n.name) {
      case 'hint': {
        const h = HINT[(a.style || 'info').toLowerCase()] || HINT.info;
        const box = el.createDiv({ cls: 'callout gb-hint', attr: { 'data-callout': h.callout } });
        const title = box.createDiv({ cls: 'callout-title' });
        setIcon(title.createDiv({ cls: 'callout-icon' }), h.icon);
        title.createDiv({ cls: 'callout-title-inner', text: h.label });
        await kids(box.createDiv({ cls: 'callout-content' }));
        return;
      }
      case 'tabs': {
        const wrap = el.createDiv({ cls: 'gb-tabs' });
        const bar = wrap.createDiv({ cls: 'gb-tabs-bar' });
        const body = wrap.createDiv({ cls: 'gb-tabs-body' });
        const tabs = n.children.filter((c) => c.type === 'tag' && c.name === 'tab');
        const buttons = [], panels = [];
        tabs.forEach((t, i) => {
          const btn = bar.createEl('button', { cls: 'gb-tab-btn', text: (t.attrs && t.attrs.title) || 'Tab ' + (i + 1) });
          const panel = body.createDiv({ cls: 'gb-tab-panel' });
          buttons.push(btn); panels.push(panel);
          btn.addEventListener('click', () => {
            buttons.forEach((b, j) => b.toggleClass('is-active', j === i));
            panels.forEach((p, j) => p.toggleClass('is-active', j === i));
          });
        });
        for (let i = 0; i < tabs.length; i++) {
          await this.renderNodes(tabs[i].children, md, panels[i], sourcePath, component, depth);
        }
        if (buttons.length) { buttons[0].addClass('is-active'); panels[0].addClass('is-active'); }
        return;
      }
      case 'stepper': {
        const ol = el.createEl('ol', { cls: 'gb-stepper' });
        for (const c of n.children) {
          if (c.type === 'tag' && c.name === 'step') {
            await this.renderNodes(c.children, md, ol.createEl('li', { cls: 'gb-step' }), sourcePath, component, depth);
          } else if (c.type === 'text' && md.slice(c.start, c.end).trim()) {
            await this.renderMarkdown(md.slice(c.start, c.end), ol.createDiv(), sourcePath, component);
          }
        }
        return;
      }
      case 'columns': {
        const row = el.createDiv({ cls: 'gb-columns' });
        for (const c of n.children) {
          if (c.type !== 'tag' || c.name !== 'column') continue;
          const col = row.createDiv({ cls: 'gb-column' });
          if (c.attrs && c.attrs.width) col.style.flex = '0 0 ' + c.attrs.width;
          await this.renderNodes(c.children, md, col, sourcePath, component, depth);
        }
        return;
      }
      case 'content-ref': {
        const card = el.createDiv({ cls: 'gb-card gb-content-ref' });
        setIcon(card.createDiv({ cls: 'gb-card-icon' }), 'file-text');
        const body = card.createDiv({ cls: 'gb-card-body' });
        if (n.children.some((c) => c.type === 'tag' || md.slice(c.start, c.end).trim())) await kids(body);
        else this.internalLink(body, a.url, a.url, sourcePath);
        return;
      }
      case 'embed': {
        const url = a.url || '';
        const box = el.createDiv({ cls: 'gb-embed' });
        const yt = /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/.exec(url);
        const vimeo = /vimeo\.com\/(\d+)/.exec(url);
        if (yt || vimeo) {
          const src = yt ? 'https://www.youtube.com/embed/' + yt[1] : 'https://player.vimeo.com/video/' + vimeo[1];
          box.createEl('iframe', { cls: 'gb-embed-frame', attr: { src, allowfullscreen: '', frameborder: '0', loading: 'lazy' } });
        } else {
          const card = box.createDiv({ cls: 'gb-card' });
          setIcon(card.createDiv({ cls: 'gb-card-icon' }), 'link');
          const body = card.createDiv({ cls: 'gb-card-body' });
          let host = url;
          try { host = new URL(url).hostname; } catch (e) { /* keep raw */ }
          body.createDiv({ cls: 'gb-card-title' }).createEl('a', { text: host, href: url, cls: 'external-link', attr: { target: '_blank', rel: 'noopener' } });
          body.createDiv({ cls: 'gb-card-sub', text: url });
        }
        if (n.children.length) await kids(box.createDiv({ cls: 'gb-caption' }));
        return;
      }
      case 'file': {
        const src = a.src || '';
        const path = this.resolve(src, sourcePath);
        const ext = extname(src);
        const box = el.createDiv({ cls: 'gb-file' });
        if (path && VIDEO_EXT.includes(ext)) {
          box.createEl('video', { attr: { src: this.resourceUrl(path), controls: '', preload: 'metadata' }, cls: 'gb-video' });
        } else if (path && IMAGE_EXT.includes(ext)) {
          box.createEl('img', { attr: { src: this.resourceUrl(path) } });
        }
        const card = box.createDiv({ cls: 'gb-card' });
        setIcon(card.createDiv({ cls: 'gb-card-icon' }), VIDEO_EXT.includes(ext) ? 'film' : 'paperclip');
        const body = card.createDiv({ cls: 'gb-card-body' });
        const name = safeDecode(src.split('/').pop() || src);
        if (path) this.internalLink(body.createDiv({ cls: 'gb-card-title' }), path, name, sourcePath);
        else body.createDiv({ cls: 'gb-card-title gb-missing', text: name + ' (missing)' });
        if (n.children.length) await kids(body.createDiv({ cls: 'gb-card-sub' }));
        return;
      }
      case 'include': {
        const target = a._ || a.src || a.path || '';
        const path = this.resolve(target, sourcePath);
        const box = el.createDiv({ cls: 'gb-include' });
        if (!path || depth > 4) {
          box.createDiv({ cls: 'gb-missing', text: 'Missing include: ' + target });
          return;
        }
        let content = await this.app.vault.adapter.read(path);
        content = content.replace(/^---\n[\s\S]*?\n---\n?/, '');
        await this.renderLiquid(content, box, path, component, depth + 1);
        return;
      }
      case 'swagger':
      case 'openapi': {
        const card = el.createDiv({ cls: 'gb-card gb-swagger' });
        setIcon(card.createDiv({ cls: 'gb-card-icon' }), 'braces');
        const body = card.createDiv({ cls: 'gb-card-body' });
        body.createDiv({ cls: 'gb-card-title', text: ((a.method || '').toUpperCase() + ' ' + (a.path || '')).trim() || 'OpenAPI' });
        if (a.src) body.createDiv({ cls: 'gb-card-sub' }).createEl('a', { text: a.src, href: a.src, cls: 'external-link' });
        if (n.children.length) await kids(body.createDiv());
        return;
      }
      case 'details': {
        const det = el.createEl('details', { cls: 'gb-expandable' });
        if ('open' in a) det.setAttribute('open', '');
        const sum = det.createEl('summary', { cls: 'gb-expandable-summary' });
        const body = det.createDiv({ cls: 'gb-expandable-body' });
        // Pull <summary> out of the first text chunk; render the rest as the body.
        const children = n.children.slice();
        let title = 'Details';
        const first = children[0];
        if (first && first.type === 'text') {
          const chunk = md.slice(first.start, first.end);
          const sm = SUMMARY_RE.exec(chunk);
          if (sm) {
            title = sm[1].trim() || title;
            children[0] = { type: 'text', start: first.start + sm.index + sm[0].length, end: first.end };
          }
        }
        const tmp = createDiv();
        await this.renderMarkdown(title, tmp, sourcePath, component);
        const p = tmp.querySelector('p');
        sum.createSpan({ cls: 'gb-expandable-title' }).append(...Array.from((p || tmp).childNodes));
        await this.renderNodes(children, md, body, sourcePath, component, depth);
        return;
      }
      case 'code': {
        const box = el.createDiv({ cls: 'gb-code' });
        if (a.title) box.createDiv({ cls: 'gb-code-title', text: a.title });
        await kids(box);
        return;
      }
      default: {
        const box = el.createDiv({ cls: 'gb-block' });
        box.createDiv({ cls: 'gb-block-label', text: n.name });
        await kids(box);
      }
    }
  }

  internalLink(parent, path, text, sourcePath) {
    const link = parent.createEl('a', { cls: 'internal-link', text: text || path, href: path, attr: { 'data-href': path } });
    link.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const resolved = this.resolve(path, sourcePath) || path;
      this.app.workspace.openLinkText(resolved, sourcePath, ev.ctrlKey || ev.metaKey);
    });
    return link;
  }

  /** Make raw-HTML <img>/<video>/<a> paths work relative to the note (GitBook style). */
  fixPaths(el, sourcePath) {
    el.querySelectorAll('img[src], video[src], source[src], audio[src]').forEach((node) => {
      if (node.closest('.internal-embed')) return;
      const raw = node.getAttribute('src');
      if (!raw || SCHEME_RE.test(raw)) return;
      const p = this.resolve(raw, sourcePath);
      if (p) node.setAttribute('src', this.resourceUrl(p));
    });
    el.querySelectorAll('a[href]:not(.internal-link):not(.external-link)').forEach((a) => {
      const raw = a.getAttribute('href');
      if (!raw || SCHEME_RE.test(raw) || raw.startsWith('#')) return;
      const p = this.resolve(raw, sourcePath);
      if (!p || a.dataset.gbBound) return;
      a.dataset.gbBound = '1';
      a.addClass('internal-link');
      a.setAttribute('data-href', p);
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.app.workspace.openLinkText(p, sourcePath, ev.ctrlKey || ev.metaKey);
      });
    });
  }

  /** GitBook writes inline math as $$x$$; Obsidian renders that as a display block. */
  fixInlineMath(el) {
    el.querySelectorAll('.math-block').forEach((m) => {
      const parent = m.parentElement;
      if (!parent || !/^(P|LI|TD|TH|SPAN|EM|STRONG|DIV)$/.test(parent.tagName) || parent.classList.contains('el-div')) return;
      const hasText = Array.from(parent.childNodes).some((c) => c !== m && (
        (c.nodeType === 3 && c.textContent.trim()) ||
        (c.nodeType === 1 && c.tagName !== 'BR' && !c.classList.contains('math-block'))));
      if (hasText) m.addClass('gb-inline-math');
    });
  }

  /* ---------------- editor ---------------- */

  registerEditorDecorations() {
    let cm;
    try { cm = require('@codemirror/view'); } catch (e) { return; }
    const { ViewPlugin, Decoration, MatchDecorator } = cm;
    const decorator = new MatchDecorator({
      regexp: /\{%[^\n]*?%\}/g,
      decoration: Decoration.mark({ class: 'cm-gb-liquid' }),
    });
    this.registerEditorExtension(ViewPlugin.fromClass(class {
      constructor(view) { this.decorations = decorator.createDeco(view); }
      update(u) { this.decorations = decorator.updateDeco(u, this.decorations); }
    }, { decorations: (v) => v.decorations }));

    let st;
    try { st = require('@codemirror/state'); } catch (e) { return; }
    try { this.registerEditorExtension(this.livePreviewExtension(cm, st)); } catch (e) {
      console.error('[gitbook-bridge] live preview extension failed', e);
    }
    try { this.registerEditorExtension(this.calloutConversionExtension(cm, st)); } catch (e) {
      console.error('[gitbook-bridge] callout conversion extension failed', e);
    }
  }

  /** Render GitBook blocks in place in Live Preview; show source while the cursor is inside. */
  livePreviewExtension(cm, st) {
    const { Decoration, EditorView, WidgetType } = cm;
    const { StateField, RangeSetBuilder } = st;
    const plugin = this;

    class LiquidWidget extends WidgetType {
      constructor(text, sourcePath) {
        super();
        this.text = text;
        this.sourcePath = sourcePath;
      }
      eq(other) { return other.text === this.text && other.sourcePath === this.sourcePath; }
      toDOM(view) {
        const el = document.createElement('div');
        el.className = 'gb-lp-block markdown-rendered';
        const component = new obsidian.Component();
        component.load();
        el._gbComponent = component;
        plugin.renderLiquid(this.text, el, this.sourcePath, component, 0).catch((e) => {
          console.error('[gitbook-bridge] live preview render failed', e);
          el.setText(this.text);
        });
        const edit = el.createDiv({ cls: 'gb-lp-edit', attr: { 'aria-label': 'Edit block' } });
        setIcon(edit, 'code-2');
        el.addEventListener('mousedown', (ev) => {
          const t = ev.target;
          const isEdit = t.closest && t.closest('.gb-lp-edit');
          if (!isEdit && t.closest && t.closest('a, button, summary, input, iframe, video, audio, .gb-tab-btn')) return;
          ev.preventDefault();
          const start = view.posAtDOM(el);
          const line = view.state.doc.lineAt(start);
          const anchor = Math.min(line.to + 1 <= view.state.doc.length ? view.state.doc.lineAt(line.to + 1).to : line.to, view.state.doc.length);
          view.dispatch({ selection: { anchor } });
          view.focus();
        });
        return el;
      }
      destroy(dom) { if (dom._gbComponent) dom._gbComponent.unload(); }
      ignoreEvent() { return true; }
    }

    const isLivePreview = (state) => {
      try { return state.field(obsidian.editorLivePreviewField); } catch (e) { return false; }
    };
    const sourcePathOf = (state) => {
      try {
        const info = state.field(obsidian.editorInfoField);
        return (info && info.file && info.file.path) || '';
      } catch (e) { return ''; }
    };

    const build = (state, regions) => {
      if (!plugin.settings.livePreviewBlocks || !isLivePreview(state)) return Decoration.none;
      const sel = state.selection.ranges;
      const path = sourcePathOf(state);
      const b = new RangeSetBuilder();
      for (const r of regions) {
        if (sel.some((s) => s.to >= r.from && s.from <= r.to)) continue; // editing: show source
        b.add(r.from, r.to, Decoration.replace({ widget: new LiquidWidget(r.text, path), block: true }));
      }
      return b.finish();
    };

    // High precedence so our block widget wins over Obsidian's own HTML-block
    // rendering of <details> (which would otherwise show it in pieces).
    return st.Prec.highest(StateField.define({
      create(state) {
        const regions = livePreviewRegions(state.doc.toString());
        return { regions, decos: build(state, regions) };
      },
      update(value, tr) {
        let regions = value.regions;
        if (tr.docChanged) regions = livePreviewRegions(tr.state.doc.toString());
        const lpChanged = isLivePreview(tr.startState) !== isLivePreview(tr.state);
        if (tr.docChanged || tr.selection || lpChanged) return { regions, decos: build(tr.state, regions) };
        return value;
      },
      provide: (f) => EditorView.decorations.from(f, (v) => v.decos),
    }));
  }

  /** Turn Obsidian callouts into GitBook hints while typing. */
  calloutConversionExtension(cm, st) {
    const { ViewPlugin, keymap } = cm;
    const { Prec } = st;
    const plugin = this;
    const enabled = () => plugin.settings.autoConvertCallouts;

    // 1) Enter at the end of a fresh callout header converts it immediately.
    const enterKey = Prec.highest(keymap.of([{
      key: 'Enter',
      run(view) {
        if (!enabled()) return false;
        const { state } = view;
        const sel = state.selection.main;
        if (state.selection.ranges.length !== 1 || !sel.empty) return false;
        const line = state.doc.lineAt(sel.head);
        if (sel.head !== line.to) return false;
        const m = CALLOUT_HEAD_RE.exec(line.text);
        if (!m) return false;
        if (line.number < state.doc.lines) {
          const next = state.doc.line(line.number + 1).text;
          if (new RegExp('^' + escapeRe(m[1]) + '>').test(next)) return false; // has a body: convert on leave
        }
        if (insideFence(state.doc.toString(), line.from)) return false;
        const { text, cursor } = calloutHeaderToBlock(m);
        view.dispatch({
          changes: { from: line.from, to: line.to, insert: text },
          selection: { anchor: line.from + cursor },
          userEvent: 'input.gitbook-callout',
        });
        return true;
      },
    }]));

    // 2) Callouts that were typed or pasted are converted once the cursor leaves them.
    const onLeave = ViewPlugin.fromClass(class {
      constructor(view) { this.view = view; this.pending = []; this.scheduled = false; }
      update(u) {
        if (!enabled()) { this.pending = []; return; }
        if (u.docChanged) {
          this.pending = this.pending.map((p) => u.changes.mapPos(p));
          for (const tr of u.transactions) {
            if (!tr.docChanged || !(tr.isUserEvent('input') || tr.isUserEvent('paste') || tr.isUserEvent('move'))) continue;
            if (tr.isUserEvent('input.gitbook-callout')) continue;
            tr.changes.iterChangedRanges((fA, tA, fB, tB) => { this.pending.push(u.changes.mapPos(fB, -1)); });
          }
        }
        if (this.pending.length && (u.docChanged || u.selectionSet) && !this.scheduled) {
          this.scheduled = true;
          setTimeout(() => { this.scheduled = false; this.flush(); }, 0);
        }
      }
      flush() {
        const view = this.view;
        if (!view.dom.isConnected) return;
        const state = view.state;
        const doc = state.doc;
        const text = doc.toString();
        const keep = [];
        const changes = [];
        const seen = new Set();
        for (const pos of this.pending) {
          if (pos < 0 || pos > doc.length) continue;
          const block = findCalloutBlock(doc, doc.lineAt(pos).number);
          if (!block) continue;
          if (seen.has(block.from)) continue;
          seen.add(block.from);
          const sel = state.selection.main;
          if (sel.head >= block.from && sel.head <= block.to) { keep.push(pos); continue; } // still editing it
          if (insideFence(text, block.from)) continue;
          changes.push({ from: block.from, to: block.to, insert: convertCalloutsText(doc.sliceString(block.from, block.to)) });
        }
        this.pending = keep;
        if (changes.length) view.dispatch({ changes, userEvent: 'input.gitbook-callout' });
      }
    });

    return [enterKey, onLeave];
  }

  /* ---------------- commands ---------------- */

  registerCommands() {
    this.addCommand({
      id: 'normalize-current-note',
      name: 'Convert current note to GitBook format',
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file || file.extension !== 'md') return false;
        if (!checking) this.normalizeFile(file);
        return true;
      },
    });
    this.addCommand({
      id: 'add-to-summary',
      name: 'Add current note to SUMMARY.md (GitBook table of contents)',
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file || file.extension !== 'md' || file.path === 'SUMMARY.md') return false;
        if (!checking) {
          this.runScript(['add-to-summary', file.path]).then((res) => {
            if (res) new Notice((res.out + '\n' + res.err).trim() || 'Already in SUMMARY.md', 8000);
          });
        }
        return true;
      },
    });
    this.addCommand({
      id: 'check-vault',
      name: 'Check vault for GitBook problems',
      callback: async () => {
        const res = await this.runScript(['check']);
        if (res) new OutputModal(this.app, 'GitBook check', res.out + (res.err ? '\n' + res.err : '')).open();
      },
    });
    this.addCommand({
      id: 'rerender',
      name: 'Re-render GitBook blocks in this note',
      callback: () => {
        this.regionCache.clear();
        this.app.workspace.getLeavesOfType('markdown').forEach((leaf) => {
          const view = leaf.view;
          if (view && view.previewMode && view.previewMode.rerender) view.previewMode.rerender(true);
        });
      },
    });
  }

  async normalizeFile(file) {
    // Flush the editor to disk first so the script sees the latest text.
    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (view && view.file === file && view.save) await view.save();
    const res = await this.runScript(['fix', file.path]);
    if (!res) return;
    const msg = (res.out + '\n' + res.err).trim();
    new Notice(msg || 'Already GitBook-compatible', 8000);
  }

  async runScript(args) {
    const cp = require('child_process');
    const base = this.app.vault.adapter.getBasePath();
    const script = require('path').join(base, this.settings.scriptPath);
    const candidates = this.settings.pythonCommand ? [this.settings.pythonCommand] : ['python3', 'python', 'py'];
    for (const cmd of candidates) {
      const parts = cmd.split(' ').filter(Boolean);
      const exe = parts[0];
      const pre = parts.slice(1);
      if (exe === 'py' && !pre.length) pre.push('-3');
      const res = await new Promise((resolve) => {
        cp.execFile(exe, pre.concat([script]).concat(args), { cwd: base, windowsHide: true, maxBuffer: 1 << 24 },
          (error, stdout, stderr) => resolve({ error, out: String(stdout || ''), err: String(stderr || '') }));
      });
      if (res.error && (res.error.code === 'ENOENT' || /was not found|not recognized/i.test(res.err))) continue;
      return res;
    }
    new Notice('GitBook Bridge: Python 3 not found. Set its path in the plugin settings.', 8000);
    return null;
  }
}

/**
 * Long-running `gitbook_bridge.py serve` process speaking JSON lines, so the
 * plugin and the commit hook share one implementation of every conversion.
 */
class Converter {
  constructor(plugin) {
    this.plugin = plugin;
    this.proc = null;
    this.starting = null;
    this.nextId = 1;
    this.pending = new Map();
    this.buffer = '';
    this.crashes = 0;
    this.disabled = false;
  }

  candidates() {
    const s = this.plugin.settings.pythonCommand;
    const list = s ? [s] : ['python3', 'python', 'py -3'];
    return list.map((c) => c.split(' ').filter(Boolean));
  }

  start() {
    if (this.proc) return Promise.resolve(true);
    if (this.disabled) return Promise.resolve(false);
    if (this.starting) return this.starting;
    this.starting = (async () => {
      const cp = require('child_process');
      const nodePath = require('path');
      const base = this.plugin.app.vault.adapter.getBasePath();
      const script = nodePath.join(base, this.plugin.settings.scriptPath);
      for (const [exe, ...pre] of this.candidates()) {
        const proc = await new Promise((resolve) => {
          let p;
          try {
            p = cp.spawn(exe, pre.concat(['-u', script, 'serve']), {
              cwd: base, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'],
              env: Object.assign({}, process.env, { PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' }),
            });
          } catch (e) { resolve(null); return; }
          p.once('error', () => resolve(null));
          p.once('spawn', () => resolve(p));
        });
        if (!proc) continue;
        this.attach(proc);
        try {
          await this.send({ cmd: 'reindex' }, 8000); // handshake (rejects Windows Store "python" stubs)
          this.starting = null;
          return true;
        } catch (e) {
          this.detach(proc);
          try { proc.kill(); } catch (err) { /* ignore */ }
        }
      }
      this.starting = null;
      this.disabled = true;
      new Notice('GitBook Bridge: could not start Python 3 for automatic conversion. Set the Python command in the plugin settings (the commit hook still converts on commit).', 10000);
      return false;
    })();
    return this.starting;
  }

  attach(proc) {
    this.proc = proc;
    this.buffer = '';
    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', (chunk) => {
      this.buffer += chunk;
      let nl;
      while ((nl = this.buffer.indexOf('\n')) >= 0) {
        const line = this.buffer.slice(0, nl).trim();
        this.buffer = this.buffer.slice(nl + 1);
        if (!line) continue;
        let msg;
        try { msg = JSON.parse(line); } catch (e) { console.warn('[gitbook-bridge] bad reply', line); continue; }
        const p = this.pending.get(msg.id);
        if (!p) continue;
        this.pending.delete(msg.id);
        clearTimeout(p.timer);
        if (msg.error) p.reject(new Error(msg.error)); else p.resolve(msg);
      }
    });
    proc.stderr.setEncoding('utf8');
    proc.stderr.on('data', (d) => console.warn('[gitbook-bridge] python:', d));
    proc.on('exit', () => {
      if (this.proc !== proc) return;
      this.detach(proc);
      if (++this.crashes > 3) this.disabled = true;
    });
  }

  detach(proc) {
    if (this.proc === proc) this.proc = null;
    for (const p of this.pending.values()) { clearTimeout(p.timer); p.reject(new Error('converter stopped')); }
    this.pending.clear();
  }

  send(obj, timeout) {
    return new Promise((resolve, reject) => {
      if (!this.proc) { reject(new Error('converter not running')); return; }
      const id = this.nextId++;
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error('converter timeout')); }, timeout || 10000);
      this.pending.set(id, { resolve, reject, timer });
      this.proc.stdin.write(JSON.stringify(Object.assign({ id }, obj)) + '\n');
    });
  }

  async request(obj) {
    if (!(await this.start())) throw new Error('converter unavailable');
    return this.send(obj);
  }

  restart() {
    this.stop();
    this.disabled = false;
    this.crashes = 0;
  }

  stop() {
    const p = this.proc;
    if (p) { this.detach(p); try { p.stdin.end(); p.kill(); } catch (e) { /* ignore */ } }
  }
}

class OutputModal extends Modal {
  constructor(app, title, text) {
    super(app);
    this.titleText = title;
    this.body = text;
  }
  onOpen() {
    this.titleEl.setText(this.titleText);
    this.contentEl.createEl('pre', { cls: 'gb-output', text: this.body.trim() || 'No problems found.' });
  }
  onClose() { this.contentEl.empty(); }
}

class BridgeSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    const s = this.plugin.settings;
    containerEl.empty();
    new Setting(containerEl)
      .setName('Hidden folders to index')
      .setDesc('Dot-folders Obsidian should treat as part of the vault (comma separated). Reload Obsidian after changing.')
      .addText((t) => t.setValue(s.revealFolders.join(', ')).onChange(async (v) => {
        s.revealFolders = v.split(',').map((x) => x.trim()).filter((x) => x.startsWith('.') && x !== '.git' && x !== '.obsidian');
        await this.plugin.saveSettings();
      }));
    new Setting(containerEl)
      .setName('Render GitBook blocks')
      .setDesc('Render {% hint %}, tabs, steppers, embeds, includes... in Reading view.')
      .addToggle((t) => t.setValue(s.renderBlocks).onChange(async (v) => { s.renderBlocks = v; await this.plugin.saveSettings(); }));
    new Setting(containerEl)
      .setName('Convert to GitBook format automatically')
      .setDesc('Run the repo\'s normalizer (wikilinks, embeds, callouts, ==highlights==, $math$, paths) while you edit. Lines you are typing on are converted once the cursor leaves them; the whole note is converted when you switch away from it.')
      .addToggle((t) => t.setValue(s.autoConvert).onChange(async (v) => { s.autoConvert = v; await this.plugin.saveSettings(); }));
    new Setting(containerEl)
      .setName('Delay after typing (ms)')
      .addText((t) => t.setValue(String(s.autoConvertDelay)).onChange(async (v) => {
        const n = parseInt(v, 10);
        if (n >= 200) { s.autoConvertDelay = n; await this.plugin.saveSettings(); }
      }));
    new Setting(containerEl)
      .setName('Keep SUMMARY.md in sync')
      .setDesc('Add new pages to GitBook\'s table of contents when you leave them, and remove deleted pages.')
      .addToggle((t) => t.setValue(s.autoSummary).onChange(async (v) => { s.autoSummary = v; await this.plugin.saveSettings(); }));
    new Setting(containerEl)
      .setName('Render GitBook blocks in Live Preview')
      .setDesc('Show hints, tabs, expandables... rendered while editing; the source appears when the cursor enters the block.')
      .addToggle((t) => t.setValue(s.livePreviewBlocks).onChange(async (v) => { s.livePreviewBlocks = v; await this.plugin.saveSettings(); }));
    new Setting(containerEl)
      .setName('Convert callouts to GitBook hints while typing')
      .setDesc('"> [!info] text" + Enter becomes {% hint style="info" %}. Typed or pasted callouts are converted when the cursor leaves them.')
      .addToggle((t) => t.setValue(s.autoConvertCallouts).onChange(async (v) => { s.autoConvertCallouts = v; await this.plugin.saveSettings(); }));
    new Setting(containerEl)
      .setName('Resolve file-relative HTML paths')
      .setDesc('Show <img src="../../.gitbook/assets/..."> figures the way GitBook does.')
      .addToggle((t) => t.setValue(s.fixHtmlPaths).onChange(async (v) => { s.fixHtmlPaths = v; await this.plugin.saveSettings(); }));
    new Setting(containerEl)
      .setName('Inline $$math$$')
      .setDesc('Render $$x$$ that sits inside a sentence inline, as GitBook does.')
      .addToggle((t) => t.setValue(s.inlineMath).onChange(async (v) => { s.inlineMath = v; await this.plugin.saveSettings(); }));
    new Setting(containerEl)
      .setName('Python command')
      .setDesc('Used for automatic conversion and the commands. Empty = try python3, python, py -3.')
      .addText((t) => t.setPlaceholder('python').setValue(s.pythonCommand).onChange(async (v) => { s.pythonCommand = v.trim(); await this.plugin.saveSettings(); this.plugin.converter.restart(); }));
  }
}

module.exports = GitBookBridgePlugin;
module.exports.default = GitBookBridgePlugin;
module.exports._internals = { parseLiquid, computeRegions, maskCode, joinPath, livePreviewRegions, convertCalloutsText, calloutHeaderToBlock, CALLOUT_HEAD_RE };
