# JForge Phase 8 — Cozy branding and login refresh

- Renamed the visible application branding from WebForge to JForge.
- Increased the header height from 72px to 88px, including a larger logo.
- Enlarged the login/register card to up to 540px with more generous padding.
- Updated the login heading to Fraunces (with Georgia fallback) and form typography to Nunito (with Trebuchet MS fallback).
- Kept the pastel honey-and-cocoa theme and split-screen illustration.
- Preserved the existing `webforge_token` browser storage key to avoid signing out existing users during the rebrand.
- The source folder remains `webforge-starter` for compatibility with existing setup instructions. Database and API routes remain unchanged.

## Run
Copy `server/.env` from your current working project, then run `npm run install:all` and `npm run dev` from the root folder.
