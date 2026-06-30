# 💬 Chat App

A modern full-stack real-time chat application built using the MERN stack. Users can create an account, update their profile, upload profile pictures, and chat with other registered users through a clean and responsive interface.

## 🚀 Live Demo

**Frontend:** *chat-app-one-snowy-54.vercel.app*

**Backend API:** *https://chat-app-x61y.onrender.com*

---

## 📸 Screenshots
<img width="1818" height="951" alt="Screenshot 2026-06-30 141743" src="https://github.com/user-attachments/assets/d89e60d1-2ea5-4c31-9393-60340747b4e0" />

<img width="1919" height="1000" alt="Screenshot 2026-06-30 141322" src="https://github.com/user-attachments/assets/a61512ac-533c-4694-9c46-5f91fbb7b923" />
<img width="1919" height="996" alt="Screenshot 2026-06-30 141238" src="https://github.com/user-attachments/assets/62ca2a80-572b-4764-b45a-d9a26657d68f" />
<img width="1919" height="997" alt="Screenshot 2026-06-30 141212" src="https://github.com/user-attachments/assets/fe0ea122-8c26-4750-bb05-79d97594ccdb" />



---

## ✨ Features

* 🔐 User Authentication (Signup & Login)
* 🍪 JWT Authentication using HTTP-Only Cookies
* 👤 Update User Profile
* 🖼️ Upload & Change Profile Picture
* 💬 Real-Time One-to-One Messaging
* 🟢 Online/Offline User Status
* 📱 Responsive Design
* ⏳ Loading States & Skeleton Loaders
* 🔍 User Sidebar
* 🚪 Secure Logout
* ☁️ Cloud Image Uploads with Cloudinary
* 🌐 Fully Deployed (Frontend + Backend)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Zustand
* Axios
* React Router
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO
* Cookie Parser
* Cloudinary
* Multer
* bcrypt

---

## 📂 Project Structure

```
Chat-App/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=5001

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Deployment

* Frontend deployed on **Vercel**
* Backend deployed on **Render**
* Database hosted on **MongoDB Atlas**
* Images stored using **Cloudinary**

---

## 📌 Future Improvements

* Group Chats
* Message Reactions
* Voice Messages
* Read Receipts
* Typing Indicators
* End-to-End Encryption
* Message Search
* Push Notifications
* Dark Mode
* Video & Audio Calling

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 👨‍💻 Author

**Himanshu Kumar**

* GitHub: https://github.com/Himanshu777685
* LinkedIn: https://www.linkedin.com/in/himanshu-kumar-317408317

---

## ⭐ Support

If you found this project helpful, consider giving it a **Star ⭐** on GitHub.
