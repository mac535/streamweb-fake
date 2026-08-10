# STREAM Ecosystem Portal

A comprehensive, multi-role educational platform designed to streamline programs, event tracking, user management, and administrative workflows across the STREAM (Science, Technology, Reading, Engineering, Arts, Mathematics) ecosystem.

**🌐 Live Demo:** [https://streamweb-fake-front.onrender.com](https://streamweb-fake-front.onrender.com)

## 🏗️ Tech Stack
This project uses a monorepo approach with npm workspaces.
- **Frontend**: React 18, Vite, Tailwind CSS v3, React Router DOM v6
- **Backend**: Node.js, Express.js, JWT Auth, Socket.IO
- **Database**: Local File-based JSON Database (No external dependencies required)
- **Utilities**: Zod, Multer, Sharp, PDFKit, ExcelJS

## 🚀 Quick Start
### 1. Clone & Install
```bash
git clone https://github.com/mac535/streamweb-fake.git
cd streamweb-fake
npm install
```

### 2. Environment Setup
```bash
cd server
cp .env.example .env
```
*(Ensure your `.env` contains a `JWT_SECRET` for authentication)*

### 3. Run Locally
```bash
# Start both client and server concurrently
npm run dev
```
- **Backend (API)**: `http://localhost:5000`
- **Frontend (Client)**: `http://localhost:5173`

## 🔑 Demo Accounts
The system automatically seeds demo accounts on startup for testing:
- **Admin**: `admin@stream.edu` / `Admin@123`
- **STREAM Expert**: `expert@stream.edu` / `Demo@123`
- **STREAM Hub**: `lab@stream.edu` / `Demo@123`
- **iLab Corner**: `ilab@stream.edu` / `Demo@123`

## 📦 Key Features
- **Role-Based Access Control (RBAC)**: Secure multi-portal routing based on user roles with "Remember Me" portal memory.
- **Analytics & Reporting**: View high-level statistics and export comprehensive PDF/Excel reports for ecosystem activities.
- **Advanced Stock Management**: Track inventory, process smart bulk CSV uploads, and manage cascading assignments to hubs.
- **Event & Attendance Tracking**: Log daily events with location tags, footprint data, GPS coordinates, and up to 10 compressed photos.
- **Dynamic Forms**: Construct custom data-gathering forms (Checkboxes, Text, Radio).

---
*Developed by [@mac535](https://github.com/mac535)*
