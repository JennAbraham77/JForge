# 🍯 JForge — Full-Stack Drag-and-Drop Website Builder

**Design it. Customize it. Make it yours.**

JForge is a full-stack website builder that allows users to create, customize, preview, and export websites through an interactive drag-and-drop editor, without requiring extensive coding knowledge.

Built using **React, Node.js, Express.js, and MongoDB**, JForge provides a user-friendly environment for designing websites with real-time customization and project management features.

## ✨ Features

### User Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing
- Personalized dashboard

### Interactive Website Builder
- Drag-and-drop component reordering
- Add, edit, and remove website components
- Real-time website preview
- Undo and redo functionality
- Responsive desktop, tablet, and mobile previews

### Design Customization
- Customize font families and font sizes
- Change text and background colors
- Adjust text alignment and corner radius
- Upload images or provide image URLs
- Customize the overall website background

### Website Components
- Headings and paragraphs
- Buttons and images
- Sections and navigation bars
- Feature cards and footers
- Contact form layouts

### Templates
JForge provides starter templates to help users quickly begin designing their websites:

- Portfolio
- Business
- Blog

### Project Management
- Create and save multiple website projects
- Store project data in MongoDB
- Edit and reopen existing projects
- Rename and delete projects

### Website Export and Publishing
- Export generated HTML
- Download website files as a ZIP containing HTML and CSS
- Preview completed websites
- Generate locally accessible published website links

*Note: Public internet hosting requires deployment. Contact forms are currently demonstration components.*

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript, HTML, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| UI Icons | Lucide React |
| Export | JSZip |
| Development Tools | VS Code, Git, GitHub, MongoDB Compass |

## 🏗️ System Architecture

```text
                USER
                  |
                  v
        React Frontend (Vite)
                  |
          HTTP / REST API
                  |
                  v
        Node.js + Express.js
                  |
            Mongoose ODM
                  |
                  v
              MongoDB
         /              \
       Users           Projects
```

The React frontend provides the visual website editor, while the Express backend handles authentication and project operations. MongoDB stores user accounts and saved website designs.

## 📁 Project Structure

```text
webforge-starter/
|
|-- client/
|   |-- src/
|   |   |-- App.jsx
|   |   |-- style.css
|   |-- package.json
|
|-- server/
|   |-- index.js
|   |-- .env.example
|   |-- package.json
|
|-- package.json
|-- README.md
```

## 🚀 Installation and Setup

### Prerequisites

Ensure that the following are installed:

- Node.js and npm
- MongoDB Community Server
- Git
- VS Code or another code editor

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/JForge.git
cd JForge
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/webforge
JWT_SECRET=replace_with_a_long_random_secret_of_at_least_32_characters
```

Never commit your actual `.env` file or secret keys to GitHub.

### 4. Start MongoDB

Make sure your local MongoDB server is running.

You can use MongoDB Compass to inspect the database and verify saved projects.

### 5. Run the Application

From the project root:

```bash
npm run dev
```

### 6. Open JForge

Frontend:

http://localhost:5173

Backend:

http://localhost:5000

## 📸 Application Screenshots

Screenshots of the following pages can be added here:

- Login and Registration Page
- User Dashboard
- Website Editor
- Component Customization
- Responsive Preview
- Completed Website

## ⚙️ How JForge Works

1. **Authentication:** Users register or log in to access their personal workspace.
2. **Project Creation:** Users create a new website project or open an existing one.
3. **Website Design:** Components are added to the canvas and reordered using drag-and-drop.
4. **Customization:** Text, fonts, colors, backgrounds, and layouts are modified using the Properties panel.
5. **Live Preview:** Users inspect their designs in different screen sizes.
6. **Project Storage:** Website designs are saved to MongoDB through the Express REST API.
7. **Export:** Completed designs can be exported as HTML or a ZIP containing HTML and CSS.

## 🎯 Project Objectives

- Develop a user-friendly visual website builder.
- Reduce the complexity of basic website development.
- Provide real-time component customization.
- Implement secure user authentication.
- Enable persistent storage and management of website projects.
- Generate reusable website code from visual designs.
- Support responsive website previews.

## 🔮 Future Enhancements

- Cloud deployment and publicly shareable website URLs
- Additional professionally designed templates
- Advanced drag-and-drop positioning
- Multi-page website support
- Functional contact forms
- Custom domain integration
- Collaborative website editing

## 📚 Learning Outcomes

Developing JForge provided practical experience in:

- Full-stack web application development
- React component architecture and state management
- REST API development using Express.js
- MongoDB database integration
- JWT authentication and password security
- Dynamic user-interface customization
- Code generation and website export
- Git and GitHub version control

---

## Sample Output
<img width="944" height="457" alt="image" src="https://github.com/user-attachments/assets/ea40e9a4-fa11-4466-9c8b-5cf0106f84e9" />
<img width="944" height="437" alt="image" src="https://github.com/user-attachments/assets/e0638ac2-bc1e-43b4-a1ae-b414ed739e5b" />
<img width="944" height="473" alt="image" src="https://github.com/user-attachments/assets/de1b2cdc-1701-4a37-910e-a704d2bd443a" />
<img width="934" height="494" alt="image" src="https://github.com/user-attachments/assets/8bacab02-7cfa-4c0b-9305-13750cd7ce1b" />
<img width="944" height="353" alt="image" src="https://github.com/user-attachments/assets/72ec0062-eba6-4761-96f5-cac325e89929" />


## 👩‍💻 Project Information

**Project Name:** JForge — Full-Stack Drag-and-Drop Website Builder

**Project Type:** Portfolio-Driven Development

**Domain:** Full-Stack Web Development

**Made by:** Jennifer B Abraham
