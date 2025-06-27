A full-stack MERN application for tracking employee payroll, hourly costs, and holiday management with role-based authentication.

# Backend setup
cd backend
npm install
# Add your MongoDB URI to .env
npx ts-node-dev src/server.ts

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# Logins
# Viewer
viewer@company.com
password123

# HR
hr@company.com
password123


## Deployed URLs

- **Frontend (Vercel)**: https://payscope-git-main-ehabqasim466-1527s-projects.vercel.app/
- **Backend (Railway)**: https://challenge-production-aa29.up.railway.app/api

## Features

- JWT Authentication (HR/Viewer roles)
- Employee CRUD operations
- Holiday tracking
- Payroll calculations with currency conversion
- Responsive dashboard with charts
- Real-time monthly burn calculations

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, JWT
- **Frontend**: React, TypeScript, Redux Toolkit, Tailwind CSS, Recharts
- **Build**: Vite
