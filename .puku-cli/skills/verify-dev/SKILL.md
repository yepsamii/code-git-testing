---
name: verify-dev
description: Run TypeScript typecheck and the electron-vite production build for this repo, then summarize errors. Use before committing Electron or TS changes — this repo has no test suite, so this is the primary safety net.
---

# verify-dev

This repo has no `test` script. Use the typecheck + production build as the verification step.

## Steps

1. From the repo root, run:
   ```bash
   npx --no-install tsc --noEmit
   ```
   If `npx --no-install` fails because TypeScript isn't reachable, fall back to `npx tsc --noEmit` (it'll install on demand in this throwaway scenario; the project depends on `typescript` ^5.6.3).

2. If typecheck passes, run the production build to catch bundler/electron-vite issues:
   ```bash
   npm run build
   ```

3. Read both outputs. Group the findings:
   - Type errors (file:line:col, message)
   - Build errors (which entrypoint: `main`, `preload`, or `renderer`)
   - Warnings worth flagging

## Output format

Be terse. Use this shape:

```
typecheck: pass | fail (N errors)
build:     pass | fail (main/preload/renderer)

errors:
- <file>:<line>:<col>  <message>
```

If both pass, say `clean` and stop. Do not invent issues.

## When NOT to invoke

- Don't run this after every single edit — the typecheck on a small repo is fast (~1–2s) but the build is ~10s. Use it before commits and after non-trivial changes.
- Don't run on a `.claude/`, `node_modules/`, or untracked-file edit.
