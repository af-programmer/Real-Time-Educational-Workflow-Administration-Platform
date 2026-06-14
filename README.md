להפעלה מחדש בפעם הבאה:
mysql -u root -p eduflow < database/seed_full.sql

# Terminal 1 – Backend
cd server && npm run dev

# Terminal 2 – Frontend  
cd client && npm run dev



# EduFlow — School Management & Print Automation Platform

A production-ready full-stack web application built with React, Node.js + Express, and MySQL.

## Quick Start

### 1. Database Setup
```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS eduflow;" && mysql -u root -p < database/schema.sql && mysql -u root -p < database/seed.sql
```

### 2. Backend
```bash
cd server
npm install
# Edit .env with your MySQL credentials
npm run dev
```

### 3. Frontend
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Demo Accounts (Password: `Password123!`)
| Role      | Email                    |
|-----------|--------------------------|
| Admin     | admin@gmail.com        |
| Secretary | secretary@gmail.com    |
| Teacher   | teacher1@gmail.com     |
| Teacher   | teacher2@gmail.com     |

## Architecture

```
Client → Rate Limiter → CORS/Helmet → Auth Middleware (JWT)
      → Role Guard → Validate Middleware (Joi)
      → Route → Controller → Service → DAL → MySQL
```

## Tech Stack

**Backend:** Node.js 20, Express 4, MySQL 8, JWT, bcryptjs, Joi, Multer, PDFKit, Socket.io, Helmet, express-rate-limit

**Frontend:** React 18, Vite, React Router v6, Zustand, Axios, Tailwind CSS, React Hook Form + Zod, Socket.io-client, React Hot Toast

## Features

- **Teacher:** Submit print requests (PDF/images), grade management per class/subject, messaging
- **Secretary:** Print queue with filters, urgent request highlights, cover page PDF generation, merge requests, teacher profiles
- **Admin:** Full user CRUD, class/subject assignment, messaging, system notifications
- **Real-time:** Socket.io notifications for new/urgent requests and messages
- **Security:** JWT, bcrypt, role-based guards, Joi validation, SQL injection protection via parameterized queries, rate limiting, file type validation

## API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/auth/login | Public |
| GET | /api/auth/me | All |
| GET | /api/users | Admin |
| POST | /api/users | Admin |
| GET | /api/print-requests | Secretary/Admin |
| GET | /api/print-requests/mine | Teacher |
| POST | /api/print-requests | Teacher |
| PATCH | /api/print-requests/:id/status | Secretary/Admin |
| GET | /api/print-requests/:id/cover | Secretary/Admin |
| POST | /api/print-requests/merge | Secretary/Admin |
| GET | /api/grades/my-classes | Teacher |
| POST | /api/grades | Teacher |
| GET | /api/messages | All |
| POST | /api/messages | Teacher/Secretary/Admin |
| GET | /api/notifications | All |
