
An end-to-end **Full-Stack Web Application** built with **React (frontend)** and **Node.js + Express + MongoDB (backend)**.
This project integrates **user authentication, file uploads, battles, reviews, ratings, analytics, and an owner panel** into a single powerful platform.

---

## ✨ Features

### 🔐 Authentication

* Secure **signup & login** with JWT authentication.
* Role-based access for **users and owners/admins**.

### 📂 Upload & Battle System

* Users can **upload images/files** to participate in battles.
* Battles allow content to be **compared and rated**.
* Owners can **create/manage battles**.

### ⭐ Reviews & Ratings

* Users can leave **star ratings & reviews**.
* Reviews are displayed with **interactive charts**.

### 👑 Owner/Admin Panel

* Dedicated dashboard for owners.
* Manage **battles, uploads, and reviews**.
* **Content moderation** tools included.

### 🎨 Frontend (React + Vite)

* Responsive and modern UI.
* Context API for authentication state.
* Navigation across pages: **Home, Login, Signup, Dashboard, Owner Panel**.

### ⚡ Backend (Node.js + Express + MongoDB)

* REST API for authentication, uploads, reviews, battles.
* Middleware for **auth & error handling**.
* Secure `.env` environment variables.

---

## ⚡ Functionality

### 👤 User Functionality

* Register/Login securely.
* Upload files/images to join battles.
* Participate in **battles** and view results.
* Rate and review content (⭐ ratings + text reviews).
* View analytics via **charts & stats**.
* Personal **dashboard** to manage uploads/reviews.

### 👑 Owner/Admin Functionality

* Create/manage battles.
* Approve or remove uploads.
* Monitor reviews & ratings.
* Access analytics dashboard to track engagement.

### 🌐 General App Functionality

* Fully **responsive frontend** (mobile + desktop).
* **API-driven backend** with modular routes.
* **MongoDB persistence** for all data.
* JWT-based **authentication & authorization**.
* **Charts & visualizations** for review statistics.

---

## 📂 Project Structure

```
final-merged-app/
│── backend/               # Node.js + Express backend
│   ├── config/            # Database connection
│   ├── middleware/        # Authentication & middlewares
│   ├── models/            # MongoDB models (User, Upload, Review, Battle)
│   ├── routes/            # API routes (auth, uploads, reviews, battles, owner)
│   ├── server.js          # Entry point
│   └── .env.example       # Example environment variables
│
│── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/    # UI components (Header, BattleCard, etc.)
│   │   ├── context/       # AuthContext for state management
│   │   ├── pages/         # Pages (Home, Login, Signup, Dashboard, etc.)
│   │   ├── App.jsx        # Main App
│   │   ├── api.js         # API integration
│   │   └── styles.css     # Global styles
│   └── vite.config.js     # Vite config
│
└── README.md              # Documentation
```

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, Context API, CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose ORM)
**Auth & Security:** JWT, bcrypt.js
**Visualization:** Custom Review Charts
**Tools:** Git, npm, dotenv

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/final-merged-app.git
cd final-merged-app
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # Add MongoDB URI & JWT_SECRET
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # Add backend API URL
npm run dev
```

Now visit 👉 **[http://localhost:5173/](http://localhost:5173/)**

---

## 🔑 Example `.env` (Backend)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## 🔑 Example `.env` (Frontend)

```env
VITE_API_URL=http://localhost:5000
```

---

## 📊 API Endpoints

### Auth

* `POST /api/auth/signup` – Register new user
* `POST /api/auth/login` – Login user

### Uploads & Battles

* `POST /api/uploads` – Upload file
* `GET /api/battles` – Fetch battles

### Reviews

* `POST /api/reviews/:id` – Add review
* `GET /api/reviews/:id` – Fetch reviews

---

## 📸 Screenshots (Optional)

👉 *(Add UI screenshots here for better presentation!)*


