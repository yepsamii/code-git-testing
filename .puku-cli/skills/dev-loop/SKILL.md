---
name: dev-loop
description: Start the Electron + Vite dev loop for this repo using the configured `dev` preview server (port 3000), then confirm what to test in the app.
---

# dev-loop

This repo's dev workflow is wired up as a preview server config (see `.claude/launch.json` → `dev` → port 3000).

## Steps

1. Start the dev server:
   ```
   preview_start with name: "dev"
   ```
   This runs `npm run dev` (electron-vite dev). The renderer Vite server listens on `http://localhost:3000`; the Electron main process attaches to it.

2. Wait for the build to settle. Use `preview_logs` with `serverId` to confirm:
   - Vite reports the renderer listening on port 3000
   - Electron main process started without IPC preload errors

3. Surface what to test:
   - Resize any edge/corner of the card — the preview WebContentsView should track the new bounds live.
   - Enter a URL in the toolbar (e.g. `https://example.com`) and click **Go** — preview should reload.
   - Toggle the view mode button — card view ↔ full-window view.

4. Hot reload: edits in `src/` reload the renderer; edits in `electron/` reload the main process.

## Cleanup

When you're done, stop the server:
```
preview_stop with serverId
```

## When NOT to invoke

- Don't double-start — if `preview_list` already shows a `dev` entry, reuse it instead of starting a second one.
- Don't invoke for production-style work; use `npm run build` then `npm start` for that.
