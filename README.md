# DECA Sentrio

Monorepo for the DECA Sentrio E-Concern and Service Request Management System.

**Version:** 0.1.0  
**Author:** Karl Austin Pavia

## Repository Structure

```text
backend/
  Express.js + TypeScript API
  Prisma schema and seed script
  PostgreSQL integration

frontend/
  React + Vite application
  Auth pages and role-based layouts

DOCUMENTATION.md
FRONTEND_ARCHITECTURE.md
```

## Applications

### Backend

The backend is an Express.js REST API using TypeScript, Prisma ORM, PostgreSQL, JWT authentication, bcrypt, Zod, Multer, and Nodemailer.

```bash
npm run dev:backend
```

Backend health check:

```text
GET http://127.0.0.1:4000/health
```

Backend details are in [backend/README.md](./backend/README.md).

### Frontend

The frontend is a React + Vite app.

```bash
npm run dev:frontend
```

Frontend details are in [frontend/README.md](./frontend/README.md).

## Root Scripts

```bash
npm run dev:backend       # Start backend dev server
npm run dev:frontend      # Start frontend dev server
npm run build:backend     # Build backend
npm run build:frontend    # Build frontend
npm run prisma:generate   # Generate Prisma Client
npm run prisma:validate   # Validate Prisma schema
npm run prisma:migrate    # Run Prisma migration
npm run prisma:seed       # Seed backend database
```

## Environment

Backend environment variables belong in:

```text
backend/.env
```

Use:

```bash
cp backend/.env.example backend/.env
```

The project is designed to work with PostgreSQL. For deployment, the backend can use Supabase by setting `DATABASE_URL` to the Supabase PostgreSQL connection string.
