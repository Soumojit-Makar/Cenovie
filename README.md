# Cenovie — Premium IT & Software Solutions

A full-stack web application for **Cenovie**, a premium IT and software engineering company. Built on React + Vite (frontend) and Node.js + Express + MongoDB (backend).

---

## 🏗️ Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React 18, Vite, TailwindCSS, Framer Motion, React Router |
| Backend    | Node.js, Express, MongoDB + Mongoose            |
| Auth       | JWT, bcryptjs                                    |
| Media      | Cloudinary                                       |
| Email      | Nodemailer                                       |
| Security   | Helmet, express-rate-limit, CORS                |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for media uploads)

---

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env     # Fill in all environment variables
npm run dev              # Development server on :5000
```

**Seed the database:**
```bash
cd backend/seeds
node index.js
```
Default admin: `admin@cenovie.com` / `Admin@Cenovie2025`

---

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env     # Set VITE_API_URL=http://localhost:5000
npm run dev              # Development server on :5173
```

---

## 📁 Project Structure

```
cenovie/
├── frontend/
│   ├── src/
│   │   ├── pages/          # All route pages
│   │   ├── components/     # Reusable components
│   │   │   ├── layout/     # Navbar, Footer, AdminLayout
│   │   │   └── ui/         # Shared UI components
│   │   ├── services/       # API service layer
│   │   └── context/        # Auth context
│   └── public/             # Static assets
├── backend/
│   ├── models/             # Mongoose models
│   ├── routes/             # Express API routes
│   ├── middleware/         # Auth, upload middleware
│   ├── seeds/              # Database seed script
│   └── server.js           # Entry point
└── README.md
```

---

## 🔐 Environment Variables

See `backend/.env.example` for all required variables.

| Variable                | Description                    |
|-------------------------|--------------------------------|
| `MONGO_URI`             | MongoDB connection string       |
| `JWT_SECRET`            | JWT signing secret (32+ chars)  |
| `CLOUDINARY_*`          | Cloudinary credentials          |
| `SMTP_*`                | Email server settings           |
| `CLIENT_URL`            | Frontend URL (CORS)             |
| `GROQ_API_KEY`          | AI analysis (optional)          |

---

## 🔑 Admin Panel

Access at `/admin/login`

- **Email:** admin@cenovie.com
- **Password:** Admin@Cenovie2025 *(change after first login)*

---

## 🎨 Brand System

- **Primary:** Deep Navy (`#0a2040`, `#0d2c58`)
- **Accent:** Gold (`#d4920f`, `#f0ab18`)
- **Typography:** Syne (display) + DM Sans (body)

---

## 📦 Deployment

**Backend:** Railway, Render, or any Node.js host  
**Frontend:** Vercel, Netlify, or Cloudflare Pages  
**Database:** MongoDB Atlas (free tier available)

---

*Delivered by Cenovie Engineering — building software that scales businesses.*
