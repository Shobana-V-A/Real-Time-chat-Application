# 💬 Real-Time MERN Chat Application

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success)

A full-stack, real-time messaging application built with the MERN stack (MongoDB, Express.js, React, Node.js). Featuring a sleek, modern Glassmorphism UI, this application supports real-time one-on-one conversations, group chats, instant image sharing, user profile management, and seamless guest access.

---

## 🔑 Demo / Guest Credentials

Want to quickly test out the application without signing up? Use the pre-configured guest credentials below or click the **"🚀 Login as Guest User"** button directly on the login screen!

| Field | Demo Credential |
| :--- | :--- |
| **Email** | `guest@example.com` |
| **Password** | `123456` |

---

## 🚀 Live Links

- **Frontend App:** [chatapplicationchat.netlify.app](https://chatapplicationchat.netlify.app)
- **Backend API:** [real-time-chat-application-fdws.onrender.com](https://real-time-chat-application-fdws.onrender.com)

> *Note: The backend is hosted on a free Render tier and may take 30–50 seconds to wake up during initial request.*

---

## ✨ Key Features

- **⚡ Real-Time Messaging:** Powered by Socket.io for instant message delivery, dynamic typing indicators, and live unread notifications.
- **🔐 Secure Authentication:** JWT (JSON Web Tokens) authentication with encrypted passwords via `bcryptjs`. Includes 1-click **Guest User Access**.
- **👤 User Details & Profile Customization:** View any user's profile card (avatar, email, status). Update your own name, avatar picture, custom status message, and password seamlessly.
- **👥 Dynamic Group Chats:** Create group chats, search & add members, remove users, and rename groups with admin privileges.
- **🖼️ Image & Media Uploads:** Send media attachments in chat and upload custom profile photos powered by Cloudinary.
- **🔍 User Search:** Search registered users instantly by name or email to initiate new conversations.
- **💎 Glassmorphism UI/UX:** Responsive, frosted glass design built with Tailwind CSS, custom backdrops, and interactive animations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Routing:** React Router DOM (v6)
- **Styling:** Tailwind CSS (Glassmorphism design system)
- **Real-Time Client:** Socket.io-client
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB Atlas with Mongoose ODM
- **Real-Time Engine:** Socket.io
- **Security:** JSON Web Tokens (JWT), BcryptJS, CORS, Dotenv

### Media & Hosting
- **Image Storage:** Cloudinary
- **Frontend Hosting:** Netlify
- **Backend Hosting:** Render

---

## 🔌 API Endpoints Summary

### User Routes (`/api/user`)
- `POST /api/user` — Register new user
- `POST /api/user/login` — Authenticate user & issue JWT (auto-provisions `guest@example.com`)
- `GET /api/user?search=` — Search registered users (Protected)
- `PUT /api/user/profile` — Update user profile details (Protected)

### Chat Routes (`/api/chat`)
- `POST /api/chat` — Create or fetch 1-on-1 chat (Protected)
- `GET /api/chat` — Fetch all chats for logged-in user (Protected)
- `POST /api/chat/group` — Create group chat (Protected)
- `PUT /api/chat/rename` — Rename group chat (Protected)
- `PUT /api/chat/groupadd` — Add user to group (Protected)
- `PUT /api/chat/groupremove` — Remove user from group (Protected)

### Message Routes (`/api/message`)
- `POST /api/message` — Send new message (Protected)
- `GET /api/message/:chatId` — Fetch all messages for a specific chat (Protected)

---

## 💻 Run Locally

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB database)

### 1. Clone the repository
```bash
git clone https://github.com/Shobana-V-A/Real-Time-chat-Application.git
cd Real-Time-chat-Application
```

### 2. Backend Setup
Navigate to the `BACKEND` folder:
```bash
cd BACKEND
npm install
```

Create a `.env` file in `BACKEND/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend development server:
```bash
npm start
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window and navigate to `FRONTEND/`:
```bash
cd FRONTEND
npm install
```

Create a `.env` file in `FRONTEND/`:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_preset
```

Start the Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 👨‍💻 Author

**SHOBANA V A**  
GitHub: [@Shobana-V-A](https://github.com/Shobana-V-A)
