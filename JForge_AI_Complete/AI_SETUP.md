# JForge AI Studio setup

1. Install Node.js 20+ and start MongoDB.
2. Copy `server/.env.example` to `server/.env`.
3. Set `JWT_SECRET` to a unique random string (32+ characters).
4. Set `GEMINI_API_KEY` to your Google AI Studio key. Keep it private.
5. From the project root, run `npm install` then `npm run dev`.
6. Open http://localhost:5173, log in, create/open a project.
7. In the left sidebar, use AI Studio to generate a website, improve selected text, or get design suggestions.
8. Add an **AI Chatbot** from Components, edit its instructions in Properties, and click it on the canvas to test chat.

AI requests require authentication and are rate-limited. The chatbot is interactive in the authenticated JForge editor. HTML/ZIP exports include a static chatbot placeholder, not a live Gemini connection; connecting exported sites requires a deployed backend. Never embed Gemini keys in exported HTML.

Existing editor features, templates, login, project saving, publishing and HTML/ZIP exports remain in place.
