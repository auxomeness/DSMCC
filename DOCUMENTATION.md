# DECA Sentrio Backend Documentation

Production-grade technical documentation for the DECA Sentrio E-Concern and Service Request Management backend.

This document is intended for backend maintainers, frontend developers, onboarding engineers, QA testers, and future implementers extending the system after Phase 7.

## Repository Layout Note

The repository is now organized as a monorepo:

```text
backend/   Express.js + TypeScript + Prisma API
frontend/  React + Vite frontend
```

Backend paths in this document such as `src/app.ts`, `prisma/schema.prisma`, and `uploads/` refer to files inside `backend/`. For example, `src/app.ts` means `backend/src/app.ts` from the repository root.

## Table of Contents

- 1. System Overview
- 2. Architecture Overview
- 3. Project Structure
  - 3.1 Core Files
  - 3.2 Config Layer
  - 3.3 Middleware Layer
  - 3.4 Utils Layer
  - 3.5 Modules Overview
- 4. Phase 1 - Project Initialization
- 5. Phase 2 - Database Design (Prisma)
- 6. Phase 3 - Authentication System
  - 6.1 Login Flow
  - 6.2 Register Flow
  - 6.3 JWT System
- 7. Phase 4 - Authorization System
  - 7.1 RBAC
  - 7.2 Visibility System
- 8. Phase 5 - Office & Staff System
- 9. Phase 6 - Concern Workflow Engine
- 10. Phase 7 - Appointment & Scheduling Engine
- 11. Frontend Integration Guide
- 12. Database Usage (Prisma)
- 13. Current Limitations
- 14. Roadmap (Future Phases)

---

## 1. System Overview

DECA Sentrio is a backend system for managing condominium concerns, office-based service requests, staff assignments, tenant approvals, and appointment scheduling inside a single condominium organization.

It is not designed as a multi-tenant SaaS product. The current assumptions fit one condominium operation: DECA Sentrio Midrise Condominium.

### Purpose

The backend centralizes:

- Tenant account registration and approval.
- Concern creation and lifecycle tracking.
- Office-based staff operations.
- Concern visibility and upvote aggregation.
- Appointment booking through an internal calendar-style slot system.
- Audit history for concern status transitions.

### Target Users

**Admin**

- Approves and manages users.
- Manages offices and staff profiles.
- Has global access to concerns and appointments.
- Will later use analytics, dashboard, feedback, and notification systems.

**Staff**

- Belongs to exactly one office.
- Works within office-scoped access rules.
- Can manage appointments in their office.
- Can accept, reject, start, resolve, and process concerns depending on workflow role.

**Tenant**

- Registers and waits for approval.
- Creates concerns.
- Views own private concerns and all public concerns.
- Votes on public concerns using "same issue" votes.
- Creates and cancels own appointments.
- Approves or reopens resolved concerns.

### Core Philosophy

The backend follows four major domain principles.

**Workflow-driven system**

Concerns are not generic records with arbitrary statuses. They are state-machine entities. Status changes must flow through the concern workflow engine.

**Office-scoped access**

Staff access is scoped by office. Under Model B, staff can see and operate on all applicable records inside their assigned office, not only records individually assigned to them.

**Strict state machines**

Concern lifecycle transitions are validated by a transition map and policy layer. Invalid transitions are rejected.

**Slot-based scheduling**

Appointments are time-slot reservations inside office working hours. The backend generates slots, checks conflicts, and exposes availability for frontend calendar UI.

---

## 2. Architecture Overview

DECA Sentrio uses a modular Express.js architecture with TypeScript, Prisma ORM, and PostgreSQL.

### Technology Stack

- Runtime: Node.js
- API framework: Express.js
- Language: TypeScript
- ORM: Prisma
- Database: PostgreSQL
- Authentication: JWT access tokens and refresh tokens
- Password hashing: bcrypt
- Validation: Zod
- Uploads: Multer
- Email transport: Nodemailer
- Security middleware: Helmet, CORS, express-rate-limit

### Architecture Layers

**API Layer**

Routes and controllers live under `src/modules/*`. Routes define URL structure and middleware order. Controllers remain thin and delegate work to services.

**Service Layer**

Services contain business logic, Prisma calls, domain validation, and workflow orchestration. Controllers should not access Prisma directly.

**Workflow Layer**

Concern workflow files under `src/modules/concerns/workflow/` enforce lifecycle transitions, role policies, assignment rules, and concern history logging.

**Scheduling Layer**

Appointment scheduling files under `src/modules/appointments/` generate office slots, compute availability, prevent conflicts, and enforce appointment lifecycle.

**Database Layer**

Prisma schema and Prisma Client are the source of truth for data models, relations, enums, and indexes.

**Middleware Layer**

Middleware handles identity, roles, validation, office scope, visibility gatekeeping, upload handling, and errors.

### ASCII Architecture Diagram

```text
Frontend Client
  |
  | HTTP JSON + Bearer JWT
  v
Express App (src/app.ts)
  |
  +-- Global Middleware
  |     Helmet, CORS, Rate Limit, JSON Parser
  |
  +-- Route Modules
  |     auth, offices, staff, concerns, appointments
  |
  +-- Controllers
  |     thin request/response handlers
  |
  +-- Services
  |     business logic + Prisma access
  |
  +-- Domain Engines
  |     Concern Workflow Engine
  |     Appointment Scheduling Engine
  |
  +-- Prisma Client
        |
        v
     PostgreSQL
```

### Request Flow Example

```text
PATCH /api/v1/concerns/:id/resolve
  -> requireAuth
  -> validate(requiredRemarksSchema)
  -> concern.controller.resolveConcern()
  -> concern.service.resolveConcern()
  -> concernWorkflowService.resolve()
  -> validate transition IN_PROGRESS -> RESOLVED -> PENDING_TENANT_APPROVAL
  -> check assigned staff/admin policy
  -> update Concern.status inside transaction
  -> create ConcernHistory records
  -> return standard JSON response
```

---

## 3. Project Structure

Current major files:

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
  services/
  types/
  utils/
uploads/
```

---

### 3.1 Core Files

## src/app.ts

- Initializes the Express application.
- Registers global middleware:
  - `helmet`
  - `cors`
  - `express-rate-limit`
  - JSON and URL-encoded parsers
  - static `/uploads`
- Defines `GET /health`.
- Mounts routes at both direct paths and `/api/v1` paths:
  - `/auth`, `/api/v1/auth`
  - `/offices`, `/api/v1/offices`
  - `/staff`, `/api/v1/staff`
  - `/concerns`, `/api/v1/concerns`
  - `/appointments`, `/api/v1/appointments`
- Registers `notFoundMiddleware`.
- Registers centralized `errorMiddleware`.

This file is the central API composition layer.

## src/server.ts

- Imports the Express app.
- Reads `PORT` from validated environment configuration.
- Starts the HTTP server.
- Logs startup.
- Handles `SIGINT` and `SIGTERM` for graceful shutdown.

This file should remain small. Application setup belongs in `src/app.ts`.

## package.json

- Defines runtime dependencies and developer tooling.
- Important scripts:
  - `npm run dev`: starts TypeScript watch mode through `tsx`.
  - `npm run build`: compiles TypeScript.
  - `npm start`: runs compiled JavaScript from `dist/server.js`.
  - `npm run prisma:generate`: generates Prisma Client.
  - `npm run prisma:validate`: validates Prisma schema.
  - `npm run prisma:migrate`: runs Prisma development migration.
  - `npm run prisma:seed`: runs seed script.

## tsconfig.json

- Enables strict TypeScript.
- Compiles source to `dist`.
- Includes `src/**/*.ts` and `prisma/**/*.ts`.
- Excludes `node_modules` and `dist`.

## .env.example

- Documents required environment variables.
- Includes:
  - `PORT`
  - `DATABASE_URL`
  - JWT secrets and expiry values
  - SMTP settings
  - `FRONTEND_URL`
  - `NODE_ENV`

## .gitignore

- Ignores generated and local-only files:
  - `node_modules/`
  - `dist/`
  - `.env`
  - upload contents except `uploads/.gitkeep`

---

### 3.2 Config Layer

## src/config/env.ts

- Loads environment variables using `dotenv`.
- Validates configuration using Zod.
- Exits process if required environment variables are invalid.
- Exports `env`.

Important behavior:

- `PORT` is coerced to a number.
- `NODE_ENV` must be `development`, `test`, or `production`.
- `FRONTEND_URL` must be a URL.
- JWT and SMTP values are required.

All runtime configuration should be read from this file instead of using `process.env` directly throughout the codebase.

## src/config/prisma.ts

- Instantiates and exports a singleton Prisma Client.
- Used by services and middleware that need database access.

The app should not instantiate new Prisma clients per request.

## src/config/smtp.ts

- Creates a Nodemailer transport from validated SMTP environment variables.
- Used by `email.service.ts`.
- Email sending is structurally prepared but not fully integrated into domain events yet.

---

### 3.3 Middleware Layer

## src/middleware/auth.middleware.ts

- Extracts Bearer token from `Authorization` header.
- Verifies access token using `verifyAccessToken`.
- Attaches `req.user` with:
  - `id`
  - `role`
  - `email`
- Exports:
  - `authMiddleware`
  - `requireAuth`

This is identity middleware only. It does not decide role authorization or office scope.

## src/middleware/role.middleware.ts

- Exports `requireRole(roles)`.
- Exports `authorize(...roles)` as a compatibility helper.
- Requires `req.user` to exist.
- Rejects users whose role is not included in the allowed role list.

Use this for RBAC gates such as admin-only endpoints.

## src/middleware/office.middleware.ts

- Implements `requireOfficeScope`.
- Resolves an office target from:
  - `req.params.officeId`
  - `req.body.officeId`
  - concern id in `req.params.id` or `req.params.concernId`
- ADMIN bypasses office scope.
- TENANT bypasses office scope because tenant ownership rules are handled elsewhere.
- STAFF must belong to the target office.

This middleware supports office-scoped access under Model B.

## src/middleware/visibility.middleware.ts

- Implements request-level concern visibility gatekeeping.
- Reads concern id from route params.
- Loads concern access metadata using `getConcernForAccess`.
- Uses `canAccessConcern`.

Important rule:

- This middleware is a fast request gate.
- `concern-access.service.ts` remains the source of truth for final concern query filtering.

## src/middleware/error.middleware.ts

- Centralized Express error handler.
- Converts Zod errors into standard `400` validation responses.
- Converts `AppError` into configured status responses.
- Logs unknown errors.
- Returns standard error body:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## src/middleware/notFound.middleware.ts

- Handles unmatched routes.
- Returns a `404` standard error response.

## src/middleware/validation.middleware.ts

- Accepts a Zod schema.
- Validates `{ body, params, query }`.
- Replaces request data with parsed values.
- Forwards validation errors to `errorMiddleware`.

All request body, params, and query validation should go through this middleware.

## src/middleware/upload.middleware.ts

- Configures Multer disk storage into `uploads`.
- Generates unique filenames.
- Allows only:
  - `.jpg`
  - `.jpeg`
  - `.png`
  - `.webp`
- Limits file size to 5 MB.

This is prepared for upload endpoints. Advanced file handling is not complete.

---

### 3.4 Utils Layer

## src/utils/jwt.ts

- Defines JWT payload shape:
  - `id`
  - `role`
  - `email`
- Exports:
  - `generateAccessToken`
  - `generateRefreshToken`
  - `verifyAccessToken`
  - `verifyRefreshToken`
  - `signAccessToken`
  - `signRefreshToken`

JWT payload intentionally avoids password, status objects, staff details, and office details to prevent stale or sensitive token data.

## src/utils/logger.ts

- Simple logging utility.
- Provides:
  - `logger.info`
  - `logger.error`

This can later be replaced with a structured logger such as Pino or Winston.

## src/utils/response.ts

- Defines standard JSON response helpers.
- `successResponse(message, data)` returns:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

- `errorResponse(message, errors)` returns:

```json
{
  "success": false,
  "message": "Error",
  "errors": []
}
```

All controllers should use these helpers for response consistency.

## src/utils/asyncHandler.ts

- Wraps async Express handlers.
- Forwards promise rejections to `next`.
- Current controllers mostly use explicit `try/catch`, but this utility is available for later cleanup.

## src/utils/appError.ts

- Defines `AppError`.
- Carries a message and HTTP status code.
- Used throughout services and middleware for predictable error handling.

## src/utils/pagination.ts

- Parses `page` and `limit`.
- Returns:
  - `page`
  - `limit`
  - `skip`
  - `take`
- Caps limit at 100.

List endpoints can use this when pagination is added.

---

### 3.5 Modules Overview

## src/modules/auth/

Purpose:

- Handles registration, login, refresh token flow, logout, and current user lookup.

Internal files:

- `auth.controller.ts`: Express handlers for auth endpoints.
- `auth.service.ts`: business logic for registration, login, refresh token store, logout, and `getMe`.
- `auth.routes.ts`: route declarations and auth-specific rate limiting.
- `auth.validation.ts`: Zod schemas for auth requests.
- `auth.types.ts`: auth response and user typing.

Flow:

```text
Route -> validate -> controller -> authService -> Prisma/JWT/bcrypt -> response
```

Endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## src/modules/users/

Purpose:

- Placeholder module for future user administration.

Current state:

- Contains `.gitkeep`.
- User approval and user management endpoints are not yet implemented.

Expected future responsibilities:

- Tenant approval and rejection.
- User suspension and reactivation.
- Admin user listing and filtering.
- Unit registration limit enforcement during tenant approval.

## src/modules/offices/

Purpose:

- Admin control over condominium service departments.

Internal files:

- `office.controller.ts`: thin request handlers.
- `office.service.ts`: office creation, listing, update, soft delete/deactivation decisions.
- `office.routes.ts`: admin-only route declarations.
- `office.validation.ts`: Zod schemas for office input.

Flow:

```text
Admin request -> requireAuth -> requireRole(ADMIN) -> validate -> officeController -> officeService -> Prisma
```

Key rules:

- Only ADMIN can manage offices.
- Office `name` is unique.
- Office has `isActive`.
- Office has scheduling fields:
  - `officeStartTime`
  - `officeEndTime`
  - `slotDurationMin`
- Office delete is never unsafe hard deletion:
  - If dependencies exist, the office is deactivated.
  - If no dependencies exist, `deletedAt` is set and `isActive` becomes false.

## src/modules/staff/

Purpose:

- Admin control over staff profiles and office assignments.

Internal files:

- `staff.controller.ts`: thin request handlers.
- `staff.service.ts`: user-role linking checks, office assignment, office head enforcement, soft delete.
- `staff.routes.ts`: admin-only route declarations.
- `staff.validation.ts`: Zod schemas for staff input.

Key rules:

- Staff profile must link to an existing `User`.
- Linked user must have role `STAFF`.
- Staff belongs to exactly one office.
- Staff cannot be assigned to inactive/deleted offices.
- Only one non-deleted office head is allowed per office.
- Soft deleting staff sets `deletedAt` and clears `isOfficeHead`.

## src/modules/concerns/

Purpose:

- Handles concern creation, visibility-aware reading, voting, history, and workflow actions.

Internal files:

- `concern.controller.ts`: concern endpoint handlers.
- `concern.service.ts`: concern creation, query filtering, detail lookup, history lookup, and workflow delegation.
- `concern.routes.ts`: concern routes.
- `concern.validation.ts`: Zod schemas.
- `concern-access.service.ts`: source of truth for concern access policy.
- `concern-vote.service.ts`: tenant "same issue" vote toggle and count logic.
- `workflow/concern-workflow.service.ts`: state machine transition engine.
- `workflow/concern-transition.map.ts`: strict transition map.
- `workflow/concern-actions.policy.ts`: role and office policy for transitions.
- `workflow/concern-validator.ts`: transition validation.

Flow:

```text
Concern action route
  -> validate
  -> concernController
  -> concernService
  -> concernWorkflowService
  -> transition validation + policy checks
  -> Prisma transaction
  -> Concern update + ConcernHistory record
```

Critical rule:

- Status changes must go through `ConcernWorkflowService`.
- Direct status mutation outside the workflow engine is prohibited except initial creation with `SUBMITTED`.

## src/modules/appointments/

Purpose:

- Internal calendar-style appointment scheduling engine.

Internal files:

- `appointment.controller.ts`: appointment endpoint handlers.
- `appointment.service.ts`: lifecycle rules, role access, conflict prevention.
- `appointment.routes.ts`: route declarations.
- `appointment.validation.ts`: Zod schemas.
- `appointment-availability.service.ts`: computes slot availability by office and date.
- `appointment-slot.service.ts`: generates time slots from office hours.

Flow:

```text
Frontend calendar request
  -> GET /appointments/availability?officeId=&date=
  -> appointmentAvailabilityService
  -> appointmentSlotService
  -> Prisma appointment lookup
  -> slot statuses returned
```

## src/modules/notifications/

Purpose:

- Placeholder module for future notification endpoints.

Current state:

- Contains `.gitkeep`.
- `src/services/notification.service.ts` exists as a structural service but persistence behavior is not implemented.

Expected future responsibilities:

- In-app notification list.
- Mark as read.
- Notification event handling from concerns and appointments.

## src/modules/feedbacks/

Purpose:

- Placeholder module for future public feedback/suggestion endpoints.

Current state:

- Contains `.gitkeep`.
- Prisma model exists.

Expected future responsibilities:

- Submit feedback publicly.
- Admin list/delete feedback.

## src/modules/dashboard/

Purpose:

- Placeholder module for future admin analytics and dashboard.

Current state:

- Contains `.gitkeep`.

Expected future responsibilities:

- Tenant counts.
- Staff counts.
- Concern counts by status/category/office.
- Appointment metrics.
- Monthly trends.

## src/services/email.service.ts

- Wraps Nodemailer SMTP transport.
- Sends basic email input:
  - `to`
  - `subject`
  - `text`
  - `html`
- Not yet wired into production notification events.

## src/services/notification.service.ts

- Defines `CreateNotificationInput`.
- Placeholder `createNotification` currently throws because notification persistence belongs to a future phase.

## src/services/upload.service.ts

- Provides helper for mapping uploaded filename to public `/uploads/:filename` URL.

## src/types/express.d.ts

- Extends Express request typing.
- Adds `req.user` with:
  - `id`
  - `role`
  - `email`

## prisma/schema.prisma

- Prisma source of truth for database schema.
- Defines enums, models, relations, indexes, and constraints.

## prisma/seed.ts

- Seeds:
  - `admin@deca.com`
  - five offices
  - one approved staff office head per office
- Uses bcrypt for seed passwords.
- Default seed password is `Password123!`.

---

## 4. Phase 1 - Project Initialization

Phase 1 established the backend foundation.

### Express setup

- `src/app.ts` creates the Express app.
- `src/server.ts` starts the server.
- Health endpoint added at `/health`.
- Route mounting supports both direct and `/api/v1` forms.

### TypeScript setup

- `tsconfig.json` enables strict TypeScript.
- Build output goes to `dist`.
- `tsx` is used for development and seed execution.

### Folder structure creation

Major folders:

```text
src/config
src/middleware
src/modules
src/services
src/types
src/utils
prisma
uploads
```

### Dependencies installed

Core dependencies:

- `express`
- `@prisma/client`
- `dotenv`
- `cors`
- `helmet`
- `express-rate-limit`
- `jsonwebtoken`
- `bcrypt`
- `zod`
- `multer`
- `nodemailer`

Developer dependencies:

- `typescript`
- `tsx`
- `prisma`
- Type packages for Express, Node, JWT, bcrypt, multer, nodemailer, and CORS.

### Prisma initialization

- Prisma schema created at `prisma/schema.prisma`.
- Prisma Client is exposed through `src/config/prisma.ts`.
- Seed script configured through `package.json`.

---

## 5. Phase 2 - Database Design (Prisma)

Phase 2 defined the database model layer using Prisma and PostgreSQL.

### Enums

## Role

Values:

- `ADMIN`
- `STAFF`
- `TENANT`

Purpose:

- Determines high-level account permissions.

## UserStatus

Values:

- `PENDING`
- `APPROVED`
- `REJECTED`
- `SUSPENDED`

Purpose:

- Controls account approval and login eligibility.

## ConcernCategory

Values:

- `PLUMBING`
- `ELECTRICAL`
- `WATER`
- `CLEANING`
- `WASTE_MANAGEMENT`
- `FACILITY_MAINTENANCE`
- `ADMINISTRATIVE`
- `OTHER`

Purpose:

- Classifies concern type.

## ConcernStatus

Values:

- `SUBMITTED`
- `ACCEPTED`
- `REJECTED`
- `ASSIGNED`
- `IN_PROGRESS`
- `RESOLVED`
- `PENDING_TENANT_APPROVAL`
- `REOPENED`
- `CLOSED`

Purpose:

- Drives the concern state machine.

## ConcernVisibility

Values:

- `PUBLIC`
- `PRIVATE`

Purpose:

- Controls who can view concerns.

## AppointmentStatus

Values:

- `PENDING`
- `APPROVED`
- `DECLINED`
- `COMPLETED`
- `CANCELLED`

Purpose:

- Controls appointment lifecycle.

## NotificationType

Values:

- `ACCOUNT_APPROVAL`
- `CONCERN_ACCEPTED`
- `CONCERN_REJECTED`
- `CONCERN_ASSIGNED`
- `CONCERN_UPDATED`
- `CONCERN_RESOLVED`
- `CONCERN_CLOSED`
- `APPOINTMENT_APPROVED`
- `APPOINTMENT_DECLINED`
- `SYSTEM`

Purpose:

- Classifies future in-app notifications.

## FeedbackType

Values:

- `FEEDBACK`
- `SUGGESTION`

Purpose:

- Classifies public feedback submissions.

### Models

## User

Purpose:

- Stores all platform identities: admins, staff users, and tenants.

Fields:

- `id`: UUID primary key.
- `firstName`, `lastName`: required names.
- `email`: unique login identifier.
- `phoneNumber`: optional, not unique.
- `password`: bcrypt hash.
- `role`: `Role`, defaults to `TENANT`.
- `status`: `UserStatus`, defaults to `PENDING`.
- `profileImage`: optional.
- `lastLoginAt`: login tracking timestamp.
- `building`, `floor`, `unitNumber`: tenant unit identity.
- `deletedAt`, `createdAt`, `updatedAt`.

Relations:

- Optional one-to-one `staffProfile`.
- Many `concerns` as tenant.
- Many `concernVotes`.
- Many `histories` as action actor.
- Many `appointments`.
- Many `notifications`.

Constraints:

- `email` is unique.

Indexes:

- `email`
- `role`
- `status`
- `role, status, building, floor, unitNumber`

The compound unit index supports the future rule: maximum three approved tenant accounts per unit.

## Office

Purpose:

- Represents a service department such as Plumbing Office or Electrical Office.

Fields:

- `id`: UUID primary key.
- `name`: unique.
- `description`: optional.
- `officeHours`: human-readable hours.
- `officeStartTime`: machine-readable `HH:mm` start time.
- `officeEndTime`: machine-readable `HH:mm` end time.
- `slotDurationMin`: appointment slot duration, default `60`.
- `isActive`: active/deactivated switch.
- `deletedAt`, `createdAt`, `updatedAt`.

Relations:

- Many `staff`.
- Many `concerns`.
- Many `appointments`.

Constraints:

- `name` is unique.

Indexes:

- `isActive`

## Staff

Purpose:

- Connects a user account to an office and staff role.

Fields:

- `id`: UUID primary key.
- `userId`: unique user relation.
- `officeId`: assigned office.
- `position`: required.
- `specialization`: optional.
- `isOfficeHead`: determines assignment authority.
- `deletedAt`, `createdAt`, `updatedAt`.

Relations:

- Belongs to `User`.
- Belongs to `Office`.
- Has many assigned concerns.

Constraints:

- `userId` is unique, enforcing one staff profile per user.

Indexes:

- `userId`
- `officeId`
- `officeId, isOfficeHead`

The service layer enforces one active office head per office.

## Concern

Purpose:

- Core concern/service request entity.

Fields:

- `id`: UUID primary key.
- `concernNumber`: unique human-readable concern number.
- `title`
- `category`
- `description`
- `building`
- `floor`
- `unitNumber`
- `locationDescription`
- `preferredSchedule`
- `imageUrl`
- `status`
- `visibility`
- `tenantId`
- `officeId`
- `assignedStaffId`
- Lifecycle timestamps:
  - `submittedAt`
  - `acceptedAt`
  - `assignedAt`
  - `startedAt`
  - `resolvedAt`
  - `closedAt`
- `createdAt`, `updatedAt`

Relations:

- Belongs to tenant `User`.
- Belongs to `Office`.
- Optionally belongs to assigned `Staff`.
- Has many `ConcernHistory`.
- Has many `ConcernVote`.

Constraints:

- `concernNumber` is unique.

Indexes:

- `status`
- `visibility`
- `category`
- `tenantId`
- `officeId`
- `assignedStaffId`
- `createdAt`
- `building, floor, unitNumber`

## ConcernVote

Purpose:

- Stores tenant "I have the same issue" votes for public concerns.

Fields:

- `id`
- `concernId`
- `tenantId`
- `createdAt`

Relations:

- Belongs to `Concern`.
- Belongs to tenant `User`.

Constraints:

- Unique `concernId, tenantId`, enforcing one vote per tenant per concern.

Indexes:

- `concernId`
- `tenantId`

## ConcernHistory

Purpose:

- Immutable audit trail for concern workflow actions.

Fields:

- `id`
- `concernId`
- `userId`
- `action`
- `oldStatus`
- `newStatus`
- `remarks`
- `createdAt`
- `updatedAt`

Relations:

- Belongs to `Concern`.
- Belongs to actor `User`.

Indexes:

- `concernId`
- `userId`
- `createdAt`

Concern history should not be updated or deleted by application workflows.

## Appointment

Purpose:

- Time-slot reservation for an office schedule.

Fields:

- `id`
- `tenantId`
- `officeId`
- `scheduledAt`
- `purpose`
- `status`
- `remarks`
- `deletedAt`
- `createdAt`
- `updatedAt`

Relations:

- Belongs to tenant `User`.
- Belongs to `Office`.

Indexes:

- `officeId`
- `tenantId`
- `status`
- `scheduledAt`

## Notification

Purpose:

- Future in-app notification storage.

Fields:

- `id`
- `userId`
- `type`
- `title`
- `message`
- `isRead`
- `deletedAt`
- `createdAt`
- `updatedAt`

Relations:

- Belongs to `User`.

Indexes:

- `userId`
- `isRead`
- `type`
- `userId, isRead`

## Feedback

Purpose:

- Stores public feedback and suggestions.

Fields:

- `id`
- `name`
- `email`
- `type`
- `message`
- `deletedAt`
- `createdAt`
- `updatedAt`

Indexes:

- `type`
- `createdAt`

### concernNumber generation

Concern numbers are generated in `ConcernService.generateConcernNumber`.

Current format:

```text
DEC-YYYY-0001
```

Example:

```text
DEC-2026-0001
```

The current algorithm counts concerns created in the current year and pads the next number to four digits.

### location system (building, floor, unitNumber)

Tenant unit identity and concern location use plain fields:

- `building`
- `floor`
- `unitNumber`
- `locationDescription`

No separate `Unit` model is currently used. This keeps MVP complexity low while still supporting the unit registration limit through indexed user fields.

### immutable history system

All concern status transitions create `ConcernHistory` entries. The workflow service performs concern updates and history creation inside transactions.

---

## 6. Phase 3 - Authentication System

Phase 3 introduced tenant registration, login, JWT identity, in-memory refresh tokens, logout, and current-user lookup.

### Endpoints

Mounted under both `/auth` and `/api/v1/auth`.

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### 6.1 Login Flow

Flow:

```text
POST /auth/login
  -> validate email/password
  -> find user by email
  -> bcrypt compare
  -> check approval gate
  -> if STAFF, require Staff profile
  -> update lastLoginAt
  -> generate access token
  -> generate refresh token
  -> store refresh token in memory
  -> return tokens + user summary
```

Rules:

- TENANT must have `status = APPROVED`.
- STAFF must have `status = APPROVED`.
- STAFF must have a linked `Staff` profile.
- ADMIN can login regardless of approval status.
- Invalid password returns a generic invalid credential error.

Response data:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "...",
    "role": "TENANT",
    "email": "tenant@example.com",
    "status": "APPROVED"
  }
}
```

### 6.2 Register Flow

Flow:

```text
POST /auth/register
  -> validate tenant registration fields
  -> ensure email is not registered
  -> hash password with bcrypt
  -> create user as TENANT
  -> set status PENDING
  -> return user summary
```

Required fields:

- `firstName`
- `lastName`
- `email`
- `password`
- `building`
- `floor`
- `unitNumber`

Optional:

- `phoneNumber`

Important:

- Registration does not grant immediate login access.
- Admin approval is required in a future user management phase.

### 6.3 JWT System

Access tokens:

- Generated by `generateAccessToken`.
- Short-lived based on `JWT_ACCESS_EXPIRES`.
- Used in `Authorization: Bearer <token>`.

Refresh tokens:

- Generated by `generateRefreshToken`.
- Longer-lived based on `JWT_REFRESH_EXPIRES`.
- Stored in process memory only.

Token payload:

```ts
{
  id: string;
  role: Role;
  email: string;
}
```

Refresh token limitations:

- Server restart clears refresh sessions.
- Multi-process scaling is not supported.
- Production should replace this with a database-backed session or refresh token store.

### Auth route rate limiting

Auth routes apply extra rate limits to:

- register
- login
- refresh

This reduces brute-force risk but does not replace account lockout.

---

## 7. Phase 4 - Authorization System

Phase 4 introduced the access control infrastructure used across later modules.

### 7.1 RBAC

RBAC is implemented through `requireRole(roles)`.

Examples:

```ts
requireRole([Role.ADMIN])
requireRole([Role.ADMIN, Role.STAFF])
```

Current high-level role behavior:

- ADMIN: global access.
- STAFF: office-scoped access.
- TENANT: personal records plus public concerns.

### Office-scoped access

Staff users are scoped to one office through their `Staff.officeId`.

Model B rule:

```text
STAFF can access all relevant records inside their office.
```

This is used for:

- Concern operations.
- Appointment approval and office appointment listing.

### 7.2 Visibility System

Concerns have `visibility`:

- `PUBLIC`
- `PRIVATE`

PUBLIC concerns:

- Visible to all tenants.
- Visible to all staff.
- Visible to admin.

PRIVATE concerns:

- Visible to owner tenant.
- Visible to assigned staff.
- Visible to staff in the concern office under office scope.
- Visible to admin.

Source of truth:

- `src/modules/concerns/concern-access.service.ts`

Do not reimplement concern access rules inline in future services.

### Voting system

Public concerns support "same issue" votes.

Rules:

- Only tenants can vote.
- Only public concerns can be voted on.
- One tenant can vote once per concern.
- Voting toggles:
  - If no vote exists, create it.
  - If vote exists, delete it.

Storage:

- `ConcernVote` table.
- Unique constraint on `concernId, tenantId`.

Scaling note:

- Current vote count uses relational count queries.
- If public concern traffic grows, add a denormalized counter on `Concern`.

---

## 8. Phase 5 - Office & Staff System

Phase 5 introduced organizational structure.

### Office CRUD

Admin-only endpoints:

- `POST /offices`
- `GET /offices`
- `GET /offices/:id`
- `PATCH /offices/:id`
- `DELETE /offices/:id`

Mounted under:

- `/offices`
- `/api/v1/offices`

Office fields:

- `name`
- `description`
- `officeHours`
- `officeStartTime`
- `officeEndTime`
- `slotDurationMin`
- `isActive`

Delete behavior:

- `OfficeService.canDeleteOffice()` centralizes delete decisions.
- If office has active staff, concerns, or active appointments, it is deactivated only.
- If no dependencies exist, it is soft deleted with `deletedAt`.

### Staff management

Admin-only endpoints:

- `POST /staff`
- `GET /staff`
- `GET /staff/:id`
- `PATCH /staff/:id`
- `DELETE /staff/:id`

Mounted under:

- `/staff`
- `/api/v1/staff`

Staff rules:

- Must link to an existing `User`.
- Linked user must have role `STAFF`.
- Staff belongs to exactly one office.
- Staff cannot be assigned to inactive offices.
- Staff soft delete sets `deletedAt`.

### Office head logic

Rules:

- Only one active staff member per office can have `isOfficeHead = true`.
- Service layer enforces this in `StaffService.assertSingleOfficeHead`.
- If an office head is soft deleted, the office intentionally remains without a head until admin assigns another one.

### Soft delete behavior

Soft deletion is implemented through `deletedAt`, not physical removal.

This preserves relations and historical integrity.

---

## 9. Phase 6 - Concern Workflow Engine

Phase 6 made concerns the core workflow engine.

### Lifecycle

Valid state flow:

```text
SUBMITTED
  -> ACCEPTED
  -> ASSIGNED
  -> IN_PROGRESS
  -> RESOLVED
  -> PENDING_TENANT_APPROVAL
  -> CLOSED
```

Additional edge states:

```text
SUBMITTED -> REJECTED
PENDING_TENANT_APPROVAL -> REOPENED -> ASSIGNED
```

### State machine design

The transition map is defined in:

- `src/modules/concerns/workflow/concern-transition.map.ts`

Map:

```text
SUBMITTED -> ACCEPTED | REJECTED
ACCEPTED -> ASSIGNED
REJECTED -> none
ASSIGNED -> IN_PROGRESS
IN_PROGRESS -> RESOLVED
RESOLVED -> PENDING_TENANT_APPROVAL
PENDING_TENANT_APPROVAL -> CLOSED | REOPENED
REOPENED -> ASSIGNED
CLOSED -> none
```

### Transition validation

`concern-validator.ts` rejects invalid transitions.

Examples rejected:

- `SUBMITTED -> IN_PROGRESS`
- `ACCEPTED -> CLOSED`
- `CLOSED -> REOPENED`

### Role-based rules

Defined in:

- `concern-actions.policy.ts`

Rules:

- TENANT:
  - create concern
  - approve resolution
  - reopen from pending tenant approval
- STAFF:
  - accept/reject concerns in office
  - start assigned work
  - mark assigned work resolved
- OFFICE HEAD:
  - assign/reassign staff in same office
- ADMIN:
  - allowed through policy overrides for administrative control

### Assignment rules

Assignment uses `ConcernWorkflowService.assign`.

Rules:

- Concern must be `ACCEPTED`, unless this is an explicit reassignment of an already assigned concern.
- Actor must be office head or admin.
- Assigned staff must belong to same office.
- Assignment sets:
  - `assignedStaffId`
  - `status = ASSIGNED`
  - `assignedAt`

### ConcernHistory audit system

Every workflow transition writes a `ConcernHistory` record.

Fields:

- `concernId`
- `userId`
- `action`
- `oldStatus`
- `newStatus`
- `remarks`
- `createdAt`

Actions include:

- `CREATED`
- `ACCEPTED`
- `REJECTED`
- `ASSIGNED`
- `REASSIGNED`
- `STARTED`
- `RESOLVED`
- `PENDING_TENANT_APPROVAL`
- `CLOSED`
- `REOPENED`

### Workflow service as single source of truth

Critical rule:

```text
Do not directly update Concern.status outside ConcernWorkflowService.
```

Allowed exception:

- Initial concern creation sets status to `SUBMITTED`.

All later status changes must go through:

- `ConcernWorkflowService.transition`
- `ConcernWorkflowService.assign`
- `ConcernWorkflowService.resolve`

### Notification hook

`ConcernWorkflowService.onStatusChange()` exists as a structural hook.

It does not send notifications yet. Delivery belongs to a future notification phase.

---

## 10. Phase 7 - Appointment & Scheduling Engine

Phase 7 introduced internal appointment scheduling.

### Core idea

Appointments are time-slot reservations inside an office schedule.

They are not Google Calendar events and do not use external scheduling APIs.

### Office working hours

Office scheduling fields:

- `officeStartTime`: `HH:mm`
- `officeEndTime`: `HH:mm`
- `slotDurationMin`: integer minutes, default `60`

Example:

```text
08:00 - 17:00, 60 minutes
```

Produces:

```text
08:00-09:00
09:00-10:00
10:00-11:00
...
16:00-17:00
```

### Slot generation

Implemented in:

- `appointment-slot.service.ts`

Responsibilities:

- Validate `YYYY-MM-DD` date input.
- Validate `HH:mm` office times.
- Convert office hours to concrete UTC `Date` slot starts.
- Generate slots based on `slotDurationMin`.

### Availability engine

Implemented in:

- `appointment-availability.service.ts`

Responsibilities:

- Load office schedule.
- Reject inactive offices.
- Generate daily slots.
- Load blocking appointments.
- Return slot states.

Slot states:

- `AVAILABLE`
- `PENDING_APPROVAL`
- `BOOKED`

Availability endpoint:

```http
GET /appointments/availability?officeId=<uuid>&date=YYYY-MM-DD
```

Example response data:

```json
[
  {
    "time": "08:00-09:00",
    "scheduledAt": "2026-06-18T08:00:00.000Z",
    "status": "AVAILABLE"
  },
  {
    "time": "09:00-10:00",
    "scheduledAt": "2026-06-18T09:00:00.000Z",
    "status": "BOOKED"
  }
]
```

### Conflict detection

Before creating an appointment:

- Appointment must match a generated slot.
- Slot must be available.
- Slot must not already have `PENDING` or `APPROVED` appointment.

During approval:

- Pending appointment can be approved only if no other approved appointment occupies that same slot.

### Booking rules

Create appointment:

- TENANT only.
- Status becomes `PENDING`.
- Must belong to an active office.
- Must use valid slot.

Approve:

- STAFF in same office or ADMIN.
- Only `PENDING` appointments.
- Status becomes `APPROVED`.

Decline:

- STAFF in same office or ADMIN.
- Only `PENDING` appointments.
- Status becomes `DECLINED`.

Cancel:

- Tenant who created appointment or ADMIN.
- Only `PENDING` or `APPROVED`.
- Status becomes `CANCELLED`.

Complete:

- STAFF in same office or ADMIN.
- Only `APPROVED`.
- Status becomes `COMPLETED`.

### Appointment endpoints

Mounted under:

- `/appointments`
- `/api/v1/appointments`

Endpoints:

- `POST /appointments`
- `GET /appointments`
- `GET /appointments/:id`
- `GET /appointments/availability?officeId=&date=`
- `PATCH /appointments/:id/approve`
- `PATCH /appointments/:id/decline`
- `PATCH /appointments/:id/cancel`
- `PATCH /appointments/:id/complete`

### Frontend calendar behavior

The frontend should call availability for a selected office/date, render returned slots, and allow booking only slots with `status = AVAILABLE`.

### Integration hooks

`AppointmentService.onAppointmentChange()` exists as a structural hook.

It does not yet:

- send notifications
- update related concerns
- emit domain events

Those belong to future phases.

---

## 11. Frontend Integration Guide

### API base

Preferred API base:

```text
/api/v1
```

Direct paths also exist during development:

```text
/auth
/offices
/staff
/concerns
/appointments
```

Frontend should use `/api/v1` consistently.

### Standard response format

Success:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

### JWT usage

After login, store:

- `accessToken`
- `refreshToken`

Use access token in all protected requests:

```http
Authorization: Bearer <accessToken>
```

When access token expires:

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}
```

Important:

- Refresh tokens are currently in-memory server storage.
- Users may be logged out after server restart.

### Auth integration

Register:

```http
POST /api/v1/auth/register
```

Login:

```http
POST /api/v1/auth/login
```

Current user:

```http
GET /api/v1/auth/me
Authorization: Bearer <accessToken>
```

Frontend login behavior:

- Show pending approval message when login returns `403 Account is not approved for login`.
- Do not expose admin/staff views based only on local UI state. Use authenticated user role.

### Concern integration

Create:

```http
POST /api/v1/concerns
Authorization: Bearer <tenant accessToken>
```

List:

```http
GET /api/v1/concerns
Authorization: Bearer <accessToken>
```

The backend automatically applies visibility and role filtering.

Detail:

```http
GET /api/v1/concerns/:id
```

History:

```http
GET /api/v1/concerns/:id/history
```

Allowed transitions:

```http
GET /api/v1/concerns/:id/allowed-transitions
```

Workflow state rendering:

- Use `status` to render current workflow stage.
- Use `allowedTransitions` to show valid action buttons.
- Do not hard-code all buttons purely on the frontend; backend is source of truth.

Common action endpoints:

- `PATCH /api/v1/concerns/:id/accept`
- `PATCH /api/v1/concerns/:id/reject`
- `PATCH /api/v1/concerns/:id/assign`
- `PATCH /api/v1/concerns/:id/reassign`
- `PATCH /api/v1/concerns/:id/start`
- `PATCH /api/v1/concerns/:id/resolve`
- `PATCH /api/v1/concerns/:id/approve`
- `PATCH /api/v1/concerns/:id/reopen`

### Appointment integration

Calendar availability:

```http
GET /api/v1/appointments/availability?officeId=<uuid>&date=YYYY-MM-DD
```

The frontend calendar should:

- Let user select office.
- Let user select date.
- Fetch availability.
- Render slots.
- Disable `BOOKED` and `PENDING_APPROVAL`.
- Allow booking `AVAILABLE`.

Create appointment:

```http
POST /api/v1/appointments
Authorization: Bearer <tenant accessToken>
Content-Type: application/json

{
  "officeId": "...",
  "scheduledAt": "2026-06-18T08:00:00.000Z",
  "purpose": "Plumbing inspection"
}
```

Staff/admin actions:

- `PATCH /api/v1/appointments/:id/approve`
- `PATCH /api/v1/appointments/:id/decline`
- `PATCH /api/v1/appointments/:id/complete`

Tenant/admin cancel:

- `PATCH /api/v1/appointments/:id/cancel`

### Admin dashboard integration

Dashboard module is not implemented yet.

For now, frontend admin tools can integrate:

- Office list and CRUD.
- Staff list and CRUD.
- Concern list filtered by admin access.
- Appointment list.

Future dashboard endpoints should be added under:

```text
/api/v1/dashboard
```

---

## 12. Database Usage (Prisma)

### Prisma client usage

Prisma Client is instantiated in:

```text
src/config/prisma.ts
```

Services import:

```ts
import { prisma } from "../../config/prisma";
```

Routes and controllers should not use Prisma directly.

### DATABASE_URL connection

Configure PostgreSQL connection in `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/deca_sentrio?schema=public"
```

### Generate Prisma Client

```bash
npm run prisma:generate
```

Equivalent:

```bash
npx prisma generate
```

### Validate schema

```bash
npm run prisma:validate
```

Equivalent:

```bash
npx prisma validate
```

### Migrations

Development migration:

```bash
npm run prisma:migrate
```

Equivalent:

```bash
npx prisma migrate dev
```

Important:

- Phase 4 added `ConcernVisibility` and `ConcernVote`.
- Phase 7 added office scheduling fields.
- A database migration is required before using these features against a real PostgreSQL database.

### Seed system

Run:

```bash
npm run prisma:seed
```

Seed creates:

- Admin account:
  - `admin@deca.com`
  - password `Password123!`
- Offices:
  - Maintenance Office
  - Plumbing Office
  - Electrical Office
  - Utility Office
  - Administrative Office
- One staff office head per office.

### Prisma transaction usage

Used where multiple writes must stay consistent:

- Concern creation creates concern and history.
- Concern workflow transitions update concern and history.
- Appointment creation checks conflict and creates appointment.

### Direct SQL policy

Current code uses Prisma only. Avoid raw SQL unless a PostgreSQL-specific constraint is required.

Potential future raw SQL:

- Partial unique index for one office head per office:

```sql
CREATE UNIQUE INDEX staff_one_head_per_office
ON "Staff" ("officeId")
WHERE "isOfficeHead" = true AND "deletedAt" IS NULL;
```

This is not currently in Prisma schema because Prisma does not model portable partial unique indexes directly.

---

## 13. Current Limitations

### No notification system yet

- `Notification` model exists.
- `notification.service.ts` is a placeholder.
- Concern and appointment hooks exist but do not deliver notifications.

### No email system active

- SMTP transport exists.
- `email.service.ts` can send email.
- Domain events are not wired to email.

### No persistent refresh tokens

- Refresh tokens are stored in process memory.
- Restart clears sessions.
- Multi-process scaling is not supported.

### No analytics dashboard yet

- Dashboard module is placeholder-only.
- No aggregate endpoints exist yet.

### No advanced file system yet

- Multer upload middleware exists.
- Upload service can map filenames to `/uploads`.
- No full upload endpoint lifecycle is implemented.
- No cloud/object storage integration exists.

### No user management module yet

- Tenant approval endpoints are not implemented.
- User suspension/reactivation endpoints are not implemented.
- Unit registration limit is indexed for support but not enforced yet.

### No feedback module endpoints yet

- Feedback model exists.
- Feedback routes/controllers/services are not implemented.

### No production session strategy yet

- Refresh tokens should move to database-backed sessions before production scale.

### No account lockout yet

- Auth rate limiting exists.
- Failed login counters and `lockedUntil` fields are not implemented.

### No SLA/escalation logic yet

- Concern workflow has states.
- No deadlines, escalation timers, or service-level agreements exist.

---

## 14. Roadmap (Future Phases)

### Phase 8 - Notification system

Implement:

- In-app notification persistence.
- Notification list endpoint.
- Mark one/all as read.
- Event-driven hooks from concern workflow and appointment lifecycle.
- Email delivery through `email.service.ts`.

Recommended architecture:

```text
Domain action -> event hook -> notification service -> DB notification + optional email
```

### Phase 9 - Analytics dashboard

Implement admin analytics:

- Total tenants.
- Total staff.
- Total concerns.
- Open concerns.
- Resolved concerns.
- Closed concerns.
- Pending approvals.
- Concerns by category.
- Concerns by office.
- Monthly concern count.
- Appointment load by office.

### Phase 10 - File upload system upgrade

Implement:

- Concern image upload endpoint.
- Completion proof uploads.
- File validation tied to authenticated users.
- Optional image metadata storage.
- Production storage strategy such as S3, R2, or local volume policy.

### Phase 11 - Production hardening

Implement:

- DB-backed refresh tokens.
- Account lockout:
  - `failedLoginAttempts`
  - `lockedUntil`
- Structured logging.
- Request correlation IDs.
- Central audit logs.
- Security headers review.
- Production CORS allowlist.
- Migration/rollback discipline.
- Automated test suite.

### Phase 12 - Advanced features (SLA, escalation, automation)

Potential features:

- SLA timers per concern category.
- Escalation rules for overdue concerns.
- Automatic office routing by category.
- Recurring office availability blocks.
- Admin holds for appointment slots.
- Advanced public concern aggregation.
- Tenant satisfaction/feedback after closure.

---

## Developer Checklist

Before implementing new backend features:

1. Confirm the target phase/module.
2. Add Zod validation first.
3. Keep controllers thin.
4. Put business rules in services.
5. Use Prisma only through service layer.
6. Use `AppError` for predictable errors.
7. Use `successResponse` for controller responses.
8. Apply `requireAuth` and `requireRole` where needed.
9. For concerns, use `concern-access.service.ts` for visibility/access rules.
10. For concern status changes, use `ConcernWorkflowService` only.
11. For appointments, use the availability engine before booking.
12. Run:

```bash
npm run build
npm run prisma:validate
npm run prisma:generate
```

---

## Glossary

**Admin**

Global manager with full backend access.

**Staff**

Office worker linked through `Staff` profile.

**Office Head**

Staff member with assignment authority inside one office.

**Tenant**

Resident user who can create concerns and appointments.

**Concern**

Workflow-driven service request.

**ConcernHistory**

Immutable audit record for concern actions.

**PUBLIC Concern**

Visible to all tenants, staff, and admins.

**PRIVATE Concern**

Visible only through ownership, office scope, assignment, or admin access.

**Appointment**

Office time-slot reservation with approval workflow.

**Slot**

Generated time interval based on office working hours and duration.
