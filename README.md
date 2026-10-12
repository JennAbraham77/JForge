# JForge — Phase 3

Full-stack no-code website builder. Builds on Phase 2: React + Express + MongoDB, registration/login, user-owned projects, visual editor, and HTML export.

## What's new
- Drag to reorder existing canvas elements (use the grip handle at the left of each element)
- Portfolio, business and blog templates
- Undo/redo editing history (up to 60 snapshots)
- Desktop, tablet, mobile previews
- Font-size and corner-radius customization
- Improved generated HTML styles

## Setup
1. Keep Phase 2 as a backup. Extract this ZIP to a new folder.
2. Make sure local MongoDB is running.
3. Copy `server/.env.example` to `server/.env` and configure `JWT_SECRET` with a random secret of at least 32 characters.
4. From the project root run `npm run install:all` then `npm run dev`.
5. Open http://localhost:5173. Sign in with your existing Phase 2 account (same local MongoDB).
6. Create or open a project, use the editor, and click Save.

## Notes
- Templates replace the current unsaved canvas after confirmation. Save before applying one.
- Undo/redo history is per editing session and is reset when a project is reopened.
- Template images load from Unsplash and require internet.
- This is a learning project, not a hardened public website hosting service.
- The existing Phase 2 backend and MongoDB schema are unchanged.

## Phase 4 additions
- Local image upload (embedded in saved project; 800 KB per image)
- Navigation, feature card, footer, and contact-form components
- Full preview, HTML export, ZIP export with separate HTML/CSS files
- Project name and description settings
- Publish a read-only preview at `http://localhost:5000/site/<slug>`

**Important:** Published links are only reachable while your local backend is running and are not internet-hosted. Deploy the backend and database to share publicly. Published previews are public to anyone who knows the link. The contact form is a visual demo and does not send messages. For production, add rate limits, stricter validation, file storage, and secure hosting.

Existing MongoDB accounts and projects are retained. Copy your prior `server/.env` to this version and keep it private.
