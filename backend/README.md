# DECA Sentrio Backend

Backend API for the DECA Sentrio E-Concern and Service Request Management System.

**Version:** 0.1.0  
**Author:** Karl Austin Pavia

This project powers tenant registration, staff and office management, concern workflows, public/private concern access, appointment scheduling, and future notification/dashboard features for a single condominium operation.

For full technical details, read [../DOCUMENTATION.md](../DOCUMENTATION.md).

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT authentication
- bcrypt password hashing
- Zod validation
- Multer uploads
- Nodemailer SMTP transport

## Current Implemented Phases

- Phase 1: Project initialization
- Phase 2: Prisma database design
- Phase 3: Authentication system
- Phase 4: Authorization hardening
- Phase 5: Office and staff management
- Phase 6: Concern workflow engine
- Phase 7: Appointment and scheduling engine

## Main Features

- Tenant registration with pending approval status
- JWT login, refresh, logout, and current-user endpoint
- Role-based access control for `ADMIN`, `STAFF`, and `TENANT`
- Office-scoped staff access
- Office CRUD and staff profile management
- Public/private concern visibility
- Public concern voting
- Strict concern state machine
- Concern history audit trail
- Calendar-style appointment availability
- Slot-based appointment conflict prevention

## Project Structure

```text
prisma/
  schema.prisma
  seed.ts
src/
  app.ts
  server.ts
  config/
  middleware/
  modules/
    appointments/
    auth/
    concerns/
    dashboard/
    feedbacks/
    notifications/
    offices/
    staff/
    users/
  services/
  types/
  utils/
uploads/
```

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Create environment file

```bash
cp .env.example .env
```

Update `.env` with your local PostgreSQL connection and secrets.

Required values include:

```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/deca_sentrio?schema=public"
JWT_ACCESS_SECRET="replace-with-access-secret"
JWT_REFRESH_SECRET="replace-with-refresh-secret"
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="smtp-user"
SMTP_PASSWORD="smtp-password"
SMTP_FROM="DECA Sentrio <no-reply@example.com>"
FRONTEND_URL="http://localhost:3000"
NODE_ENV=development
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run migrations

```bash
npm run prisma:migrate
```

### 5. Seed the database

```bash
npm run prisma:seed
```

Seed credentials:

```text
Admin email: admin@deca.com
Password: Password123!
```

### 6. Start development server

```bash
npm run dev
```

From the repository root, you can also run:

```bash
npm run dev:backend
```

Health check:

```text
GET /health
```

## Scripts

```bash
npm run dev              # Start development server with tsx watch
npm run build            # Compile TypeScript
npm start                # Run compiled server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:validate  # Validate Prisma schema
npm run prisma:migrate   # Create/apply development migration
npm run prisma:seed      # Seed database
```

From the repository root:

```bash
npm run dev:backend
npm run build:backend
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate
npm run prisma:seed
```

## API Base

Preferred API base:

```text
/api/v1
```

Direct development paths are also mounted:

```text
/auth
/offices
/staff
/concerns
/appointments
```

## Key Endpoints

### Auth

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Offices

```text
POST   /api/v1/offices
GET    /api/v1/offices
GET    /api/v1/offices/:id
PATCH  /api/v1/offices/:id
DELETE /api/v1/offices/:id
```

### Staff

```text
POST   /api/v1/staff
GET    /api/v1/staff
GET    /api/v1/staff/:id
PATCH  /api/v1/staff/:id
DELETE /api/v1/staff/:id
```

### Concerns

```text
POST  /api/v1/concerns
GET   /api/v1/concerns
GET   /api/v1/concerns/:id
GET   /api/v1/concerns/:id/history
GET   /api/v1/concerns/:id/allowed-transitions
PATCH /api/v1/concerns/:id/accept
PATCH /api/v1/concerns/:id/reject
PATCH /api/v1/concerns/:id/assign
PATCH /api/v1/concerns/:id/reassign
PATCH /api/v1/concerns/:id/start
PATCH /api/v1/concerns/:id/resolve
PATCH /api/v1/concerns/:id/approve
PATCH /api/v1/concerns/:id/reopen
```

### Appointments

```text
POST  /api/v1/appointments
GET   /api/v1/appointments
GET   /api/v1/appointments/:id
GET   /api/v1/appointments/availability?officeId=&date=
PATCH /api/v1/appointments/:id/approve
PATCH /api/v1/appointments/:id/decline
PATCH /api/v1/appointments/:id/cancel
PATCH /api/v1/appointments/:id/complete
```

## Authentication

Protected endpoints require:

```http
Authorization: Bearer <accessToken>
```

JWT payload contains only:

```text
id
role
email
```

Refresh tokens are currently stored in process memory for MVP use. Server restarts clear refresh sessions.

## Concern Workflow

Valid concern lifecycle:

```text
SUBMITTED
-> ACCEPTED
-> ASSIGNED
-> IN_PROGRESS
-> RESOLVED
-> PENDING_TENANT_APPROVAL
-> CLOSED
```

Additional paths:

```text
SUBMITTED -> REJECTED
PENDING_TENANT_APPROVAL -> REOPENED -> ASSIGNED
```

All status changes must go through `ConcernWorkflowService`.

## Appointment Scheduling

Appointments are generated from office working hours:

```text
officeStartTime
officeEndTime
slotDurationMin
```

Availability returns slots as:

```text
AVAILABLE
PENDING_APPROVAL
BOOKED
```

No external calendar API is used.

## Current Limitations

- Tenant approval/user management endpoints are not implemented yet.
- Notification delivery is not implemented yet.
- Email service exists but is not wired into domain events yet.
- Refresh tokens are in-memory only.
- Dashboard analytics are not implemented yet.
- Feedback endpoints are not implemented yet.
- File upload lifecycle is not fully implemented yet.

## Recommended Verification

Run before handing changes to another developer:

```bash
npm run build
npm run prisma:validate
npm run prisma:generate
```

## Documentation

Use [DOCUMENTATION.md](./DOCUMENTATION.md) for:

- Full architecture details
- File-by-file explanations
- Prisma model descriptions
- Frontend integration guidance
- Phase-by-phase implementation notes
- Current limitations and roadmap
