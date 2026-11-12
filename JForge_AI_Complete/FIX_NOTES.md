# JForge — Save Fix

This complete project includes the Phase 9 pastel theme, larger username, split login, and editor.

Fixes:
- Blog and Portfolio starter-template image elements now have `text: ''` as required by backend validation.
- New template items are normalized.
- Save normalizes existing items before sending them to the backend, so older unsaved projects with image components can be saved.
- Publish will not proceed if Save fails.
- Login branding now says JForge.

Copy your existing `server/.env` from the previous version. MongoDB data is not replaced.

From the project root:
```
npm run install:all
npm run dev
```
