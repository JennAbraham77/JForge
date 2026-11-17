JForge — AI-Augmented Website Builder
JForge is a full-stack, no-code website builder that helps users create, customize, preview, and publish multi-page websites. It combines a visual React editor with AI-powered assistance using Google's Gemini API.
Features
Visual website editor
- Add and edit headings, paragraphs, buttons, images, sections, navigation bars, cards, footers, and contact-form layouts.
- Customize text, colors, fonts, alignment, and page backgrounds using the Properties panel.
- Manage multiple pages and link buttons between pages.
- Use starter templates, undo/redo, device previews, and project saving.
- Export websites and publish a locally hosted preview.
Four AI-powered tools
Tool	What it does
AI Content Assistant	Generates or rewrites text for a selected component; review before applying.
AI Website Generator	Creates an editable multi-page website from a description, including content and styling.
AI Design Suggestions	Analyzes the current page and suggests optional improvements to colors, typography, and alignment.
AI Chatbot	Answers website-building questions with conversation context during the current editor session.


The editor includes a floating AI Studio interface for the Website Generator, Design Suggestions, and Chatbot. The AI Content Assistant is available in the Properties panel when editing applicable components.
Technology stack
Layer	Technology
Frontend	React 18, Vite 6, CSS, Lucide React
Backend	Node.js, Express
Database	MongoDB with Mongoose
Authentication	JSON Web Tokens (JWT), bcryptjs
AI integration	Google Gemini via @google/genai
Export	JSZip


Project structure
webforge-starter/
├── client/
│   ├── src/
│   │   ├── App.jsx          # Editor, pages, UI, AI tool interfaces
│   │   ├── main.jsx
│   │   └── style.css        # Application styling
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── index.js             # API, authentication, projects, publishing
│   ├── ai.js                # Gemini endpoints
│   ├── package.json
│   └── .env                 # Create locally; do not commit
├── package.json
└── README.md
Prerequisites
- Node.js and npm
- MongoDB installed and running locally
- A Gemini API key from Google AI Studio
Installation
1. Clone the repository or extract the project ZIP.
2. Open a terminal in the webforge-starter directory.
3. Install dependencies:
npm install
npm --prefix client install
npm --prefix server install
Configure MongoDB
The local development setup uses MongoDB on port 27018, separate from any MongoDB instance running on the default port 27017.

Create the database directory if it does not already exist:
New-Item -ItemType Directory -Force C:\JForgeData
Start MongoDB in a separate PowerShell terminal (adjust the versioned installation path if necessary):
& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\JForgeData" --port 27018 --bind_ip 127.0.0.1
Keep this terminal open. Wait until MongoDB reports Waiting for connections.
Configure environment variables
Create server/.env:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27018/webforge
JWT_SECRET=replace_with_a_random_secret_of_at_least_32_characters
GEMINI_API_KEY=your_google_gemini_api_key
Replace both placeholders with real private values. Generate a strong random JWT secret. Never commit .env, passwords, or API keys to GitHub.

The current Gemini integration uses gemini-3.5-flash-lite. Model availability and API quotas can change.
Start JForge
From the project root:
npm run dev
This launches:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/api/health
Important: Open the frontend with http://localhost:5173, not http://127.0.0.1:5173. The development backend currently allows the localhost:5173 origin for CORS.
How to use
1. Open http://localhost:5173 and register or log in.
2. Create a new project or open a saved one.
3. Add components, create pages, and customize the design through the editor.
4. Use AI Content Assistant in Properties to generate text for a selected component.
5. Open the floating AI Studio to generate an entire website, request design suggestions, or ask the chatbot for guidance.
6. Review AI-generated results before applying changes; generating a new website may replace the current project's pages.
7. Save your changes, preview the site, export it, or publish a local preview.
Example AI Website Generator prompt:
Create a modern portfolio website with Home, About, Projects, and Contact pages. Use a black and green color scheme, clear navigation, and professional content.

API overview
Method	Endpoint	Purpose
GET	/api/health	Check backend availability
POST	/api/auth/register	Register an account
POST	/api/auth/login	Log in
GET	/api/auth/me	Get authenticated user
GET	/api/projects	List saved projects
POST	/api/ai/generate	Generate component text
POST	/api/ai/website	Generate a multi-page website
POST	/api/ai/design-suggestions	Analyze page design
POST	/api/ai/chat	Ask the AI chatbot


AI endpoints require a valid JWT. Additional project and publishing routes are defined in server/index.js.
Troubleshooting
Login shows “Failed to fetch”
Use http://localhost:5173 instead of http://127.0.0.1:5173. Check that the backend is running on port 5000.

Cannot GET / on port 5000
This is expected: port 5000 serves the API, not the React homepage. Use /api/health to test the backend.

MongoDB connection fails
Ensure MongoDB is running on port 27018 and that MONGO_URI matches. Do not start two MongoDB processes using the same database directory.

Gemini returns a 503 error
The model may be temporarily overloaded. Retry later. A 404 may indicate the selected model is unavailable to the API key.

Changes do not appear
Save the project, refresh the browser, and check the browser console and development terminals for errors.
Security and deployment notes
This repository is configured for local development. Before deploying publicly, configure production CORS and HTTPS, secure environment variables, implement AI request rate limits and abuse protections, and review publishing and authentication security. The local MongoDB configuration shown above does not enable database authentication and must not be exposed publicly.
Future enhancements
Potential improvements include hosted publishing, collaborative editing, additional templates, richer responsive layout controls, and persistent chatbot conversations.
License
No license has been specified for this project. Add a LICENSE file if you intend to distribute it under an open-source license.
