# WebContentsView Resizable Preview

A small Electron demo showing the [`WebContentsView`](https://www.electronjs.org/docs/latest/api/web-contents-view) API: a card in the UI can be resized by dragging its edges/corners, and a second `WebContentsView` loading a live web page tracks the card's bounds in real time.

## Why two views

`WebContentsView` is a native layer, not a DOM element — it paints on top of the window's web content and ignores CSS z-index. This app uses:

- **Chrome view** — the app's own UI (`src/index.html`): a URL bar and a resizable card.
- **Preview view** — the embedded page, positioned with `setBounds()` to match the card's inner viewport rect.

The card's resize handles live in a thin border strip *outside* the viewport rect, so they stay clickable instead of being covered by the preview view. A `ResizeObserver` on the viewport reports its rect to the main process on every layout change (drag-resize or window resize), which calls `previewView.setBounds()` — that's what makes the preview "responsive" to the card.

## Run

```bash
npm install
npm start
```

Drag any edge or corner of the card to resize it; the preview follows live. Enter a URL and click "Go" to load a different page.

## Structure

```
src/
  main.js      # BrowserWindow + two WebContentsViews, IPC handlers
  preload.js   # exposes previewAPI (setBounds/loadURL/getURL) to the renderer
  index.html   # toolbar + resizable card markup
  style.css    # card, viewport, and handle layout
  renderer.js  # drag-resize logic + ResizeObserver -> IPC
```
