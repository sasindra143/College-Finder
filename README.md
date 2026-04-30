# 🎓 CareerCampus: The Ultimate College Discovery Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-1a202c?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

CareerCampus is a high-fidelity, production-grade College Discovery and Decision platform. Built to industry standards (comparable to Careers360 or CollegeDunia), it allows students to seamlessly search, compare, and discover the best educational institutions based on real data, advanced filters, and intelligent ranking logic.

**🌍 Live Link:** [colleges-finder-apllication.netlify.app](https://colleges-finder-apllication.netlify.app/)

---

## ✨ Key Features

- **🔍 Advanced College Discovery:** Search through a massive database of 37,000+ Indian institutions. Includes debounced real-time search and multi-parameter filtering (Location, Fees, Courses, Ownership, Ratings).
- **🏫 Detailed Institution Pages:** High-fidelity detail views featuring auto-inferred degree data, Google Maps integration, official website fallback routing, and placement statistics.
- **⚖️ College Comparison Engine:** Side-by-side comparative analysis of up to 3 colleges, automatically highlighting the "Top Value" metrics for Fees, Ratings, and Placements.
- **🧠 Smart Predictor Tool:** A rule-based engine predicting highly-likely college targets based on specific competitive exam inputs (JEE Main, NEET, CAT, CLAT) and expected rank.
- **💬 Q&A Discussion Forum:** A community-driven forum where students can ask queries and share advice regarding college admissions.
- **🔐 Secure Authentication & Dashboard:** JWT-based user authentication system with **Google OAuth 2.0 Integration**, allowing students to save favorite colleges and personalized comparison lists to a dedicated User Dashboard.

---

## 📸 Screenshots

### 1. Homepage & Live Search
![Homepage](./screenshots/homepage.png)

### 2. College Listing & Filters
![Listing](./screenshots/colleges_list.png)

### 3. Comparison Engine
![Compare](./screenshots/compare.png)

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js (App Router, Server/Client components)
- React.js
- Tailwind CSS (Premium gradients, interactive micro-animations)
- Context API (State Management)

**Backend:**
- Node.js & Express.js
- TypeScript
- Prisma ORM (PostgreSQL)
- Passport.js (Google OAuth 2.0)
- JWT & bcryptjs (Security)

---

## 🚀 Local Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or via a cloud provider like Neon/Supabase)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/career-campus.git
cd career-campus
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/college_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
FRONTEND_URL="http://localhost:3000"
```

Initialize the database:
```bash
npm run db:generate   # Generates Prisma Client
npm run db:push       # Pushes schema to Postgres
npm run db:seed       # (Optional) Seeds basic mock data
npm run dev           # Starts the backend server on port 5000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Start the development server:
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## 🌍 Deployment

This platform is 100% ready for production deployment.

1. **Backend (Railway / Render):**
   - Connect your GitHub repository to Railway.
   - Add the Environment Variables (`DATABASE_URL`, `PORT`, `JWT_SECRET`, `FRONTEND_URL`).
   - The included `postinstall: prisma generate` script will ensure the ORM builds properly.
   
2. **Frontend (Vercel):**
   - Import the `frontend` folder to Vercel.
   - Set the `NEXT_PUBLIC_API_URL` to your newly deployed backend URL.
   - Deploy!

---

## 🏗️ Post-Deployment Configuration (Critical)

To make the live site functional with your data, you must:
1. Ensure your **Backend** is live on Render: [college-finder-911y.onrender.com](https://college-finder-911y.onrender.com/)
2. Go to your **Netlify Dashboard** > **Site Configuration** > **Environment Variables**.
3. Add a new variable: `NEXT_PUBLIC_API_URL` and set its value to: `https://college-finder-911y.onrender.com/api`
4. Trigger a new deploy on Netlify.

---

*Built with ❤️ for the Next Generation of Students.*
