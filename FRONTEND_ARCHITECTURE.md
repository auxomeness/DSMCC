# DECA Sentrio Frontend Architecture

Frontend architecture plan for the React application that will integrate with the DECA Sentrio backend.

This document is implementation-ready guidance for frontend developers. It does not contain React code. It defines product experience, page hierarchy, navigation, layouts, component architecture, state management, API integration, and future scalability.

## Table of Contents

- 1. Frontend Overview
- 2. Frontend Architecture
- 3. Route Structure
- 4. Global Layout Structure
- 5. Tenant Pages
- 6. Staff Pages
- 7. Admin Pages
- 8. Concern Module UI Design
- 9. Appointment Module UI Design
- 10. Dashboard Design
- 11. Component Architecture
- 12. State Management Architecture
- 13. API Integration Strategy
- 14. Folder Structure
- 15. Future Frontend Features

---

## 1. Frontend Overview

The DECA Sentrio frontend is the user-facing operations interface for a condominium concern, appointment, staff, and office management system. It should feel like a practical internal operations tool: clear, structured, fast to scan, and optimized for repeated daily workflows.

The frontend is not a marketing website. It is a role-aware application for:

- Tenants submitting concerns and booking appointments.
- Staff managing office queues and service work.
- Admins managing users, offices, staff, concerns, appointments, feedback, and future analytics.

### Purpose of the Frontend

The frontend should allow users to:

- Authenticate securely.
- Register as tenants and understand approval status.
- Create and track concerns.
- View public concerns and vote "same issue".
- Process concern workflow actions according to role.
- Book appointments through office availability slots.
- Manage offices and staff as an admin.
- Prepare for future notifications, dashboards, and analytics.

### User Types

**Admin**

- Full management interface.
- Access to offices, staff, tenants, all concerns, all appointments, feedback, system configuration, and analytics.
- Needs dense data tables, filters, operational dashboards, and fast management actions.

**Staff**

- Office-scoped work interface.
- Sees concerns and appointments in assigned office.
- Needs queues, assigned work, workflow action buttons, appointment approvals, and calendar views.

**Tenant**

- Personal service portal.
- Creates concerns, tracks status, books appointments, views public concerns, votes on shared issues, and reviews notifications.
- Needs friendly but efficient flows with clear statuses and next actions.

### Role-Based Experience

The same backend serves all roles, but the frontend must separate navigation and permissions:

- Admin layout exposes management modules.
- Staff layout exposes office work queues and schedule management.
- Tenant layout exposes self-service concern and appointment workflows.

Frontend role checks are for UX only. Backend RBAC remains the authority. The UI should hide unauthorized actions but must still handle `401` and `403` responses gracefully.

### High-Level Navigation Philosophy

Navigation should be predictable and task-oriented:

- Primary sidebar for major modules.
- Top bar for search, notifications, profile, and current context.
- Role-specific dashboard as landing page.
- Detail pages include workflow timeline and next actions.
- Tables and lists should be filterable and searchable.
- Calendar views should use clear slot states: available, pending, booked.

---

## 2. Frontend Architecture

Recommended frontend stack:

- React
- TypeScript
- React Router
- Axios
- React Query / TanStack Query
- Zustand or Context API
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui

### React

Use React for component-based UI composition. The DECA frontend has repeated UI patterns: dashboards, forms, data tables, status badges, workflow timelines, modals, and calendars. React is a strong fit for modular, role-based screens.

### TypeScript

Use TypeScript for:

- API response typing.
- Role and status enums.
- Form schemas.
- Route parameter safety.
- Component prop contracts.

Important shared frontend types should mirror backend enums:

- `Role`
- `UserStatus`
- `ConcernStatus`
- `ConcernVisibility`
- `AppointmentStatus`
- `FeedbackType`
- `NotificationType`

### React Router

Use React Router for:

- Public routes.
- Protected routes.
- Role-based route guards.
- Nested layouts by role.
- Detail pages such as `/concerns/:id` and `/appointments/:id`.

Recommended patterns:

- `PublicRoute`
- `ProtectedRoute`
- `RoleRoute`
- Role layout nesting.

### Axios

Use Axios for API transport because it supports:

- Base URL configuration.
- Request interceptors for access token.
- Response interceptors for refresh handling.
- Standard error normalization.

Axios should live under `src/services/api/`.

### React Query / TanStack Query

Use React Query for server state:

- Authenticated current user fetch.
- Concern lists and detail records.
- Appointment availability and appointment lists.
- Office/staff list queries.
- Dashboard data when implemented.

React Query should own:

- Caching.
- Refetching.
- Mutation loading states.
- Invalidations after create/update/delete.

### Zustand or Context API

Use Zustand for lightweight client state:

- Auth token memory/local persistence state.
- Sidebar collapsed state.
- UI preferences.
- Last selected office/date filters if needed.

Use React Context only for static providers such as theme or app shell settings. Avoid putting large server-state datasets in Zustand.

### React Hook Form

Use React Hook Form for:

- Login/register forms.
- Concern creation form.
- Appointment request form.
- Office and staff forms.
- Feedback forms.

It keeps form state performant and works cleanly with Zod.

### Zod

Use Zod on the frontend for:

- Form validation.
- Runtime API payload validation where helpful.
- Shared schema logic mirroring backend request constraints.

Do not rely only on frontend validation. Backend validation remains authoritative.

### Tailwind CSS

Use Tailwind CSS for utility-first styling and fast creation of consistent layouts.

Design principles:

- restrained colors
- high contrast status indicators
- dense but readable dashboards
- responsive sidebar patterns
- predictable spacing scales

### shadcn/ui

Use shadcn/ui for accessible, composable primitives:

- Button
- Input
- Select
- Dialog
- Sheet
- Tabs
- Table
- Badge
- Calendar
- Popover
- Dropdown Menu
- Toast
- Alert
- Form

Use shadcn as a component foundation, not as a rigid design system. Compose domain-specific components on top.

---

## 3. Route Structure

The frontend should use `/api/v1` as API base, but frontend browser routes should be clean product routes.

### Full Route Map

```text
/
  -> redirect by auth state and role

/login
/register
/forgot-password
/reset-password
/feedback

/tenant
/tenant/dashboard
/tenant/concerns
/tenant/concerns/create
/tenant/concerns/public
/tenant/concerns/:id
/tenant/appointments
/tenant/appointments/create
/tenant/appointments/calendar
/tenant/appointments/:id
/tenant/notifications
/tenant/profile
/tenant/settings
/tenant/feedback

/staff
/staff/dashboard
/staff/concerns
/staff/concerns/queue
/staff/concerns/assigned
/staff/concerns/:id
/staff/appointments
/staff/appointments/calendar
/staff/appointments/:id
/staff/notifications
/staff/profile
/staff/settings

/admin
/admin/dashboard
/admin/offices
/admin/offices/create
/admin/offices/:id
/admin/staff
/admin/staff/create
/admin/staff/:id
/admin/tenants
/admin/tenants/:id
/admin/concerns
/admin/concerns/public
/admin/concerns/:id
/admin/appointments
/admin/appointments/calendar
/admin/appointments/:id
/admin/feedback
/admin/notifications
/admin/analytics
/admin/system
/admin/profile
/admin/settings

/unauthorized
/not-found
```

### Route Guard Rules

Public routes:

- `/login`
- `/register`
- `/feedback`
- `/forgot-password`
- `/reset-password`

Authenticated routes:

- all `/tenant/*`
- all `/staff/*`
- all `/admin/*`

Role route rules:

- TENANT only: `/tenant/*`
- STAFF only: `/staff/*`
- ADMIN only: `/admin/*`

Fallback behavior:

- Unknown route -> `/not-found`
- Authenticated but wrong role -> `/unauthorized`
- Unauthenticated protected access -> `/login`

### Default Redirects

After login:

- `ADMIN` -> `/admin/dashboard`
- `STAFF` -> `/staff/dashboard`
- `TENANT` -> `/tenant/dashboard`

Root route:

- no token -> `/login`
- token + role -> role dashboard

---

## 4. Global Layout Structure

The frontend should use separate layouts for public, tenant, staff, and admin views.

### Public Layout

Pages:

- Login
- Register
- Forgot Password
- Reset Password
- Feedback & Suggestions

Regions:

- centered auth panel or compact public shell
- DECA Sentrio identity
- simple footer
- optional public feedback link

UX goals:

- fast login
- clear tenant approval messaging
- simple registration flow
- no sidebar

### Tenant Layout

Regions:

- Sidebar
- Top Navigation
- Notification Bell
- Profile Menu
- Main Content

Sidebar items:

- Dashboard
- My Concerns
- Public Concerns
- Appointments
- Notifications
- Feedback
- Profile
- Settings

Top navigation:

- page title
- create concern button
- notification bell
- user menu

Main content:

- card/table/list based workflow screens
- status-first concern and appointment information

### Staff Layout

Regions:

- Sidebar
- Top Navigation
- Notification Bell
- Profile Menu
- Main Content

Sidebar items:

- Dashboard
- Concern Queue
- Assigned Concerns
- Office Concerns
- Appointments
- Calendar
- Notifications
- Profile
- Settings

Top navigation:

- office name/context
- queue count
- notification bell
- profile menu

Main content:

- office-scoped data only
- queue and workflow action emphasis

### Admin Layout

Regions:

- Sidebar
- Top Navigation
- Analytics Summary Strip
- Management Content Area
- Profile Menu

Sidebar items:

- Dashboard
- Offices
- Staff
- Tenants
- Concerns
- Appointments
- Feedback
- Analytics
- System Configuration
- Notifications
- Settings

Top navigation:

- global search
- notification bell
- admin profile menu

Main content:

- management tables
- filters
- action dialogs
- analytics cards

---

## 5. Tenant Pages

### Tenant Dashboard

Purpose:

- Provide quick overview of tenant concerns, appointments, and pending actions.

Features:

- Open concerns count.
- Pending tenant approval count.
- Upcoming appointments.
- Recent concern activity.
- Quick actions: Create Concern, Book Appointment.

API endpoints consumed:

- `GET /api/v1/concerns`
- `GET /api/v1/appointments`
- future `GET /api/v1/notifications`

Components used:

- `DashboardShell`
- `StatCard`
- `ConcernList`
- `AppointmentCard`
- `QuickActionButton`
- `EmptyState`

### My Concerns

Purpose:

- Show tenant's own concerns, including private and public concerns they created.

Features:

- Status filters.
- Visibility filter.
- Search by title/location.
- Concern cards/table.

API endpoints consumed:

- `GET /api/v1/concerns`

Components used:

- `ConcernFilterBar`
- `ConcernList`
- `ConcernCard`
- `StatusBadge`
- `VisibilityBadge`

### Create Concern

Purpose:

- Allow tenant to submit a new concern.

Features:

- Form validation.
- Office selector.
- Category selector.
- Public/private visibility selector.
- Preferred schedule field.
- Image upload placeholder.

API endpoints consumed:

- `GET /api/v1/offices`
- `POST /api/v1/concerns`

Components used:

- `ConcernForm`
- `OfficeSelect`
- `CategorySelect`
- `VisibilityToggle`
- `DateTimePicker`
- `ImageUploadField`

### Concern Details

Purpose:

- Show full concern information, workflow timeline, history, votes, and available actions.

Features:

- Concern metadata.
- Current status.
- Workflow timeline.
- History records.
- Vote count if public.
- Tenant action buttons:
  - Approve resolution
  - Reopen concern

API endpoints consumed:

- `GET /api/v1/concerns/:id`
- `GET /api/v1/concerns/:id/history`
- `GET /api/v1/concerns/:id/allowed-transitions`
- `PATCH /api/v1/concerns/:id/approve`
- `PATCH /api/v1/concerns/:id/reopen`

Components used:

- `ConcernDetailHeader`
- `WorkflowTimeline`
- `ConcernHistoryList`
- `StatusBadge`
- `ConcernActionPanel`
- `VoteButton`

### Public Concerns

Purpose:

- Allow tenants to view public concerns and vote "same issue".

Features:

- Public-only concern feed.
- Category/status filters.
- Vote button.
- Vote count.
- Open concern detail.

API endpoints consumed:

- `GET /api/v1/concerns?visibility=PUBLIC`
- future vote endpoint using `concernVoteService`

Components used:

- `PublicConcernFeed`
- `ConcernCard`
- `VoteButton`
- `CategoryBadge`

### Appointments

Purpose:

- Show tenant appointment history and upcoming bookings.

Features:

- Pending/approved/declined/cancelled filters.
- Cancel appointment.
- Link to calendar booking.

API endpoints consumed:

- `GET /api/v1/appointments`
- `PATCH /api/v1/appointments/:id/cancel`

Components used:

- `AppointmentList`
- `AppointmentCard`
- `AppointmentStatusBadge`
- `CancelAppointmentDialog`

### Calendar View

Purpose:

- Visualize office availability by date.

Features:

- Office selector.
- Date picker.
- Slot availability grid.
- Available slot click to create appointment.

API endpoints consumed:

- `GET /api/v1/offices`
- `GET /api/v1/appointments/availability?officeId=&date=`

Components used:

- `OfficeSelect`
- `CalendarDatePicker`
- `AvailabilityGrid`
- `CalendarSlot`

### Create Appointment

Purpose:

- Submit appointment request for a selected available slot.

Features:

- Office selector.
- Availability preview.
- Purpose field.
- Submit pending appointment.

API endpoints consumed:

- `GET /api/v1/appointments/availability`
- `POST /api/v1/appointments`

Components used:

- `AppointmentRequestForm`
- `AvailabilityGrid`
- `CalendarSlot`

### Notifications

Purpose:

- Future notification center.

Features:

- Unread/read tabs.
- Notification cards.
- Mark all as read.

API endpoints consumed:

- planned `GET /api/v1/notifications`
- planned `PATCH /api/v1/notifications/:id/read`
- planned `PATCH /api/v1/notifications/read-all`

Components used:

- `NotificationList`
- `NotificationCard`
- `EmptyState`

### Profile

Purpose:

- Show current user profile and tenant unit information.

Features:

- User details.
- Unit details.
- Account status.

API endpoints consumed:

- `GET /api/v1/auth/me`
- future profile update endpoint.

Components used:

- `ProfileSummary`
- `UnitInfoCard`

### Settings

Purpose:

- Tenant preference and security settings.

Features:

- Password change placeholder.
- Notification preferences placeholder.

API endpoints consumed:

- planned settings endpoints.

Components used:

- `SettingsSection`
- `FormCard`

### Feedback & Suggestions

Purpose:

- Submit public or authenticated feedback.

Features:

- Feedback form.
- Suggestion form.

API endpoints consumed:

- planned `POST /api/v1/feedbacks`

Components used:

- `FeedbackForm`

---

## 6. Staff Pages

### Staff Dashboard

Purpose:

- Show office workload summary.

Features:

- Queue counts.
- Assigned concern count.
- Pending appointment approvals.
- Recent office activity.

API endpoints consumed:

- `GET /api/v1/concerns`
- `GET /api/v1/appointments`
- future dashboard endpoints.

Components used:

- `StatCard`
- `ConcernQueuePreview`
- `AppointmentApprovalList`

### Office Concerns

Purpose:

- Show all concerns visible to staff office under Model B.

Features:

- Status filters.
- Category filters.
- Public/private indicators.
- Assignment state.

API endpoints consumed:

- `GET /api/v1/concerns`

Components used:

- `ConcernTable`
- `StatusBadge`
- `VisibilityBadge`

### Concern Queue

Purpose:

- Show newly submitted concerns requiring accept/reject.

Features:

- Accept concern.
- Reject with remarks.
- Open detail.

API endpoints consumed:

- `GET /api/v1/concerns?status=SUBMITTED`
- `PATCH /api/v1/concerns/:id/accept`
- `PATCH /api/v1/concerns/:id/reject`

Components used:

- `ConcernQueueTable`
- `ActionMenu`
- `RemarksDialog`

### Assigned Concerns

Purpose:

- Show concerns assigned to the logged-in staff member.

Features:

- Start work.
- Resolve with remarks.
- View history.

API endpoints consumed:

- `GET /api/v1/concerns`
- `PATCH /api/v1/concerns/:id/start`
- `PATCH /api/v1/concerns/:id/resolve`

Components used:

- `AssignedConcernList`
- `WorkflowActionButtons`

### Concern Details

Purpose:

- Full office concern detail view.

Features:

- Status timeline.
- Assignment panel for office heads.
- Accept/reject/start/resolve actions depending on allowed transitions.

API endpoints consumed:

- `GET /api/v1/concerns/:id`
- `GET /api/v1/concerns/:id/history`
- `GET /api/v1/concerns/:id/allowed-transitions`
- transition endpoints.

Components used:

- `ConcernDetailHeader`
- `WorkflowTimeline`
- `AssignmentPanel`
- `ConcernHistoryList`

### Appointments

Purpose:

- Manage office appointment requests.

Features:

- Pending approvals list.
- Approve/decline appointments.
- Complete approved appointments.

API endpoints consumed:

- `GET /api/v1/appointments`
- `PATCH /api/v1/appointments/:id/approve`
- `PATCH /api/v1/appointments/:id/decline`
- `PATCH /api/v1/appointments/:id/complete`

Components used:

- `AppointmentTable`
- `AppointmentStatusBadge`
- `RemarksDialog`

### Calendar

Purpose:

- Office schedule view.

Features:

- Daily availability grid.
- Approved bookings.
- Pending approval slots.

API endpoints consumed:

- `GET /api/v1/appointments/availability`
- `GET /api/v1/appointments`

Components used:

- `OfficeCalendar`
- `AvailabilityGrid`
- `CalendarSlot`

### Notifications

Purpose:

- Future office notifications.

API endpoints consumed:

- planned notification endpoints.

Components used:

- `NotificationList`

### Profile

Purpose:

- Staff profile and office membership display.

API endpoints consumed:

- `GET /api/v1/auth/me`
- future staff profile endpoint.

Components used:

- `ProfileSummary`
- `OfficeMembershipCard`

### Settings

Purpose:

- Staff account settings.

API endpoints consumed:

- planned settings endpoints.

Components used:

- `SettingsSection`

---

## 7. Admin Pages

### Admin Dashboard

Purpose:

- Global operational summary.

Features:

- Total tenants.
- Total staff.
- Total concerns.
- Open concerns.
- Pending approvals.
- Appointment load.
- Recent system activity.

API endpoints consumed:

- planned `GET /api/v1/dashboard/summary`
- interim: `GET /api/v1/concerns`, `GET /api/v1/staff`, `GET /api/v1/offices`, `GET /api/v1/appointments`

Components used:

- `AdminStatGrid`
- `RecentActivityTable`
- `ChartCard`

### Office Management

Purpose:

- Manage service departments and schedules.

Features:

- Create office.
- Edit office.
- Deactivate/soft delete office.
- Configure office working hours and slot duration.

API endpoints consumed:

- `POST /api/v1/offices`
- `GET /api/v1/offices`
- `GET /api/v1/offices/:id`
- `PATCH /api/v1/offices/:id`
- `DELETE /api/v1/offices/:id`

Components used:

- `OfficeTable`
- `OfficeForm`
- `ConfirmDialog`
- `StatusBadge`

### Staff Management

Purpose:

- Link staff users to staff profiles and offices.

Features:

- Create staff profile.
- Assign office.
- Set office head.
- Soft delete staff.

API endpoints consumed:

- `POST /api/v1/staff`
- `GET /api/v1/staff`
- `GET /api/v1/staff/:id`
- `PATCH /api/v1/staff/:id`
- `DELETE /api/v1/staff/:id`

Components used:

- `StaffTable`
- `StaffForm`
- `OfficeHeadBadge`

### Tenant Management

Purpose:

- Approve, reject, suspend, and view tenants.

Features:

- Pending approvals.
- Unit occupancy check.
- Tenant detail.
- Suspension/reactivation.

API endpoints consumed:

- planned users endpoints.

Components used:

- `TenantTable`
- `ApprovalDialog`
- `UnitOccupancyCard`

### Concern Monitoring

Purpose:

- Monitor all concerns.

Features:

- Global filters.
- Status timeline.
- Office grouping.
- Open detail.

API endpoints consumed:

- `GET /api/v1/concerns`
- `GET /api/v1/concerns/:id`
- `GET /api/v1/concerns/:id/history`

Components used:

- `ConcernTable`
- `ConcernDetailDrawer`
- `WorkflowTimeline`

### Public Concern Monitoring

Purpose:

- Monitor public issue aggregation.

Features:

- Public concern feed.
- Vote counts.
- High-volume issue detection.

API endpoints consumed:

- `GET /api/v1/concerns?visibility=PUBLIC`

Components used:

- `PublicConcernTable`
- `VoteCountBadge`

### Appointment Monitoring

Purpose:

- Monitor appointments across all offices.

Features:

- Global calendar.
- Office filters.
- Status filters.

API endpoints consumed:

- `GET /api/v1/appointments`
- `GET /api/v1/appointments/availability`

Components used:

- `AppointmentTable`
- `OfficeCalendar`

### Feedback Management

Purpose:

- Review public feedback and suggestions.

API endpoints consumed:

- planned feedback endpoints.

Components used:

- `FeedbackTable`
- `FeedbackDetailDialog`

### System Configuration

Purpose:

- Admin configuration area.

Features:

- Office scheduling defaults.
- Notification settings placeholder.
- Future SLA settings.

API endpoints consumed:

- current office update endpoints.
- planned system endpoints.

Components used:

- `SettingsSection`
- `ConfigForm`

### Notifications

Purpose:

- Global notification center for admin.

API endpoints consumed:

- planned notification endpoints.

Components used:

- `NotificationList`

### Analytics

Purpose:

- Operational analytics.

API endpoints consumed:

- planned dashboard endpoints.

Components used:

- `ChartCard`
- `MetricGrid`
- `TrendChart`

### Profile

Purpose:

- Admin profile.

API endpoints consumed:

- `GET /api/v1/auth/me`

Components used:

- `ProfileSummary`

### Settings

Purpose:

- Admin account and UI preferences.

API endpoints consumed:

- planned settings endpoints.

Components used:

- `SettingsSection`

---

## 8. Concern Module UI Design

### Concern Creation Form

Fields:

- Title
- Category
- Description
- Building
- Floor
- Unit Number
- Location Description
- Visibility
- Preferred Schedule
- Image Upload

Behavior:

- Tenant-only.
- Validate required fields before submit.
- Office must be selected.
- Visibility defaults to `PRIVATE`.
- Preferred schedule should use date/time picker.
- Image upload should be optional until upload lifecycle is complete.

Submit endpoint:

```text
POST /api/v1/concerns
```

### Concern Detail View

Sections:

- Header:
  - concern number
  - title
  - status
  - visibility
  - category
- Location card:
  - building
  - floor
  - unit number
  - location description
- Office/assignment card.
- Description.
- Image preview.
- Workflow action panel.
- Timeline.
- History.
- Public vote area if public.

### Workflow Timeline

Show statuses:

```text
SUBMITTED
ACCEPTED
ASSIGNED
IN_PROGRESS
RESOLVED
PENDING_TENANT_APPROVAL
CLOSED
```

Special states:

- `REJECTED`
- `REOPENED`

Timeline state display:

- completed
- current
- pending
- failed/rejected
- reopened

### Status Badges

Use consistent colors:

- `SUBMITTED`: neutral
- `ACCEPTED`: blue
- `ASSIGNED`: indigo
- `IN_PROGRESS`: amber
- `RESOLVED`: emerald
- `PENDING_TENANT_APPROVAL`: purple
- `CLOSED`: green
- `REJECTED`: red
- `REOPENED`: orange

### Activity History

Render `ConcernHistory` as:

- action label
- old status -> new status
- remarks
- actor
- timestamp

Endpoint:

```text
GET /api/v1/concerns/:id/history
```

### Public Concern Voting

For public concerns:

- show vote count
- show "I have the same issue" button
- show whether current tenant voted

Backend service exists, but public vote endpoints should be added before UI implementation.

### Comment-ready Area for Future Expansion

Reserve a tab/section for future comments:

- comments list
- add comment form
- internal staff notes

Do not implement comments until backend supports them.

---

## 9. Appointment Module UI Design

### Calendar Interface

The calendar should be office-first:

1. Select office.
2. Select date.
3. Fetch availability.
4. Render slots.
5. Select available slot.
6. Submit appointment purpose.

### Availability Grid

Endpoint:

```text
GET /api/v1/appointments/availability?officeId=&date=
```

Slot statuses:

- `AVAILABLE`
- `PENDING_APPROVAL`
- `BOOKED`

### Available Slots

Display as selectable buttons.

Behavior:

- Tenant can select.
- Staff/admin can inspect.
- Use clear action affordance.

### Booked Slots

Display as disabled, high-confidence occupied slots.

Label:

- "Booked"

### Pending Approval Slots

Display as disabled for tenants.

Label:

- "Pending approval"

### Appointment Request Form

Fields:

- Office
- Date
- Slot
- Purpose

Submit endpoint:

```text
POST /api/v1/appointments
```

### Appointment Detail Page

Display:

- office
- tenant
- scheduled time
- purpose
- status
- remarks
- lifecycle actions based on role

### Appointment Status Tracking

Statuses:

- `PENDING`
- `APPROVED`
- `DECLINED`
- `COMPLETED`
- `CANCELLED`

### Office Availability Viewer

Admin and staff should have a read-focused view of office slots, including pending and booked slots.

---

## 10. Dashboard Design

### Tenant Dashboard

Widgets:

- Open concerns.
- Pending tenant approval concerns.
- Upcoming appointments.
- Public concern highlights.
- Recent activity.

Cards:

- "Create Concern"
- "Book Appointment"
- "View Public Concerns"

Statistics:

- total concerns
- active concerns
- closed concerns
- upcoming appointments

Recent activity:

- latest concern history entries
- appointment status changes

Charts:

- small monthly concern count
- appointment trend placeholder

KPIs:

- active concern count
- next appointment date

### Staff Dashboard

Widgets:

- Office queue count.
- Assigned concerns.
- Pending appointment approvals.
- In-progress work.

Cards:

- "Review Queue"
- "View Assigned"
- "Open Calendar"

Statistics:

- submitted concerns in office
- assigned concerns
- in-progress concerns
- pending appointments

Recent activity:

- office concern transitions
- new appointments

Charts:

- concerns by status
- appointments by day

KPIs:

- pending queue size
- appointments awaiting approval

### Admin Dashboard

Widgets:

- Total tenants.
- Total staff.
- Total offices.
- Total concerns.
- Open concerns.
- Pending tenant approvals.
- Appointment load.

Cards:

- "Manage Offices"
- "Manage Staff"
- "Review Tenants"
- "Monitor Concerns"

Statistics:

- concerns by category
- concerns by office
- monthly concern trend
- appointment counts

Recent activity:

- latest concerns
- latest registrations
- latest appointments

Charts:

- line chart: monthly concerns
- bar chart: concerns by office
- donut chart: concerns by category

KPIs:

- open concerns
- pending approvals
- unresolved concerns
- booked appointments

---

## 11. Component Architecture

### Buttons

Reusable button variants:

- primary
- secondary
- destructive
- ghost
- icon
- loading

Use shadcn `Button` as base.

### Forms

Reusable form primitives:

- `FormShell`
- `FormSection`
- `FormActions`
- `FieldError`

Use React Hook Form and Zod.

### Inputs

Components:

- `TextInput`
- `PasswordInput`
- `Textarea`
- `Select`
- `DatePicker`
- `DateTimePicker`
- `FileInput`

### Cards

Cards should be used for individual grouped data, not page sections.

Components:

- `StatCard`
- `InfoCard`
- `ActionCard`
- `SummaryCard`

### Tables

Components:

- `DataTable`
- `SortableHeader`
- `TableFilters`
- `BulkActionBar`

Use for admin/staff management screens.

### Modals

Components:

- `ConfirmDialog`
- `FormDialog`
- `RemarksDialog`
- `DetailDialog`

Use for destructive actions and quick edits.

### Status Badges

Components:

- `ConcernStatusBadge`
- `AppointmentStatusBadge`
- `UserStatusBadge`
- `VisibilityBadge`
- `OfficeActiveBadge`

### Workflow Timeline

Component:

- `WorkflowTimeline`

Responsibilities:

- Render concern lifecycle.
- Show current status.
- Show completed/pending states.
- Support rejected/reopened state.

### Concern Card

Shows:

- title
- concern number
- category
- status
- visibility
- location
- vote count if public

### Concern List

Composes:

- filters
- cards/table
- pagination
- loading state
- empty state

### Appointment Card

Shows:

- office
- scheduled time
- purpose
- status
- actions

### Calendar Slot

Props:

- `time`
- `scheduledAt`
- `status`
- `selected`
- `disabled`

Variants:

- available
- pending
- booked

### Notification Card

Future component for:

- title
- message
- type
- timestamp
- read/unread state

### Pagination Components

Components:

- `PaginationControls`
- `PageSizeSelect`
- `ResultCount`

### Empty States

Use module-specific copy:

- "No concerns yet"
- "No appointments for this date"
- "No staff found"

### Loading States

Use:

- skeleton cards
- table skeletons
- button spinners

### Error States

Use:

- inline field errors
- toast for mutation failures
- page-level error panel for query failures

---

## 12. State Management Architecture

### Auth Store

Use Zustand.

State:

- `accessToken`
- `refreshToken`
- `user`
- `isAuthenticated`

Actions:

- `setTokens`
- `setUser`
- `logout`
- `hydrateFromStorage`

Persist:

- refresh token if chosen by app security policy
- access token can be memory-only or session storage depending on UX requirements

### User Store

Use React Query for current user:

- `useMeQuery`

Use Zustand only for derived UI state:

- selected role route
- profile menu state

### Concern Store

Use React Query for:

- concern lists
- concern detail
- concern history
- allowed transitions

Use local component state for:

- filters
- selected concern
- dialog open/closed

Do not store concern lists in Zustand.

### Appointment Store

Use React Query for:

- availability
- appointment list
- appointment detail

Use local state for:

- selected date
- selected office
- selected slot

### Notification Store

Future:

- React Query for notification list.
- Zustand for unread count if WebSockets are added.

### What belongs in React Query

- Server-owned records.
- Lists and details.
- Mutations and invalidation.

Examples:

- concerns
- appointments
- offices
- staff
- current user
- notifications
- feedback
- dashboard metrics

### What belongs in local state

- form state
- modal state
- selected tab
- selected filters before submit
- sidebar collapse
- selected calendar slot

---

## 13. API Integration Strategy

### API Client

Create:

```text
src/services/api/client.ts
```

Responsibilities:

- Axios instance.
- `baseURL = /api/v1`.
- Attach Bearer token.
- Handle `401`.
- Attempt refresh.
- Normalize errors.

### Authentication Flow

Login:

```text
POST /auth/login
-> store tokens
-> fetch /auth/me or use returned user
-> redirect by role
```

Refresh:

```text
POST /auth/refresh
-> update access token
-> retry original request
```

Logout:

```text
POST /auth/logout
-> clear tokens
-> redirect /login
```

### Protected Routes

`ProtectedRoute` should:

- require access token
- optionally fetch current user
- redirect unauthenticated users

`RoleRoute` should:

- check user role
- route to `/unauthorized` if invalid

### Page to Endpoint Relationships

| Page | Endpoint |
| --- | --- |
| Login | `POST /api/v1/auth/login` |
| Register | `POST /api/v1/auth/register` |
| Current User | `GET /api/v1/auth/me` |
| Tenant My Concerns | `GET /api/v1/concerns` |
| Public Concerns | `GET /api/v1/concerns?visibility=PUBLIC` |
| Create Concern | `POST /api/v1/concerns` |
| Concern Detail | `GET /api/v1/concerns/:id` |
| Concern History | `GET /api/v1/concerns/:id/history` |
| Concern Actions | `PATCH /api/v1/concerns/:id/*` |
| Office Management | `/api/v1/offices` |
| Staff Management | `/api/v1/staff` |
| Appointment Calendar | `GET /api/v1/appointments/availability` |
| Create Appointment | `POST /api/v1/appointments` |
| Appointment Management | `PATCH /api/v1/appointments/:id/*` |
| Dashboard | planned `/api/v1/dashboard/*` |
| Feedback | planned `/api/v1/feedbacks` |
| Notifications | planned `/api/v1/notifications` |

### Token Handling

Rules:

- Never include password in frontend state.
- Store only token and user summary.
- Clear tokens on refresh failure.
- Handle `403` separately from `401`.

### Refresh Logic

Response interceptor should:

1. Detect `401`.
2. If request has not retried, call refresh endpoint.
3. Store new access token.
4. Retry original request.
5. If refresh fails, logout.

### Role-Based Routes

Role map:

```ts
ADMIN -> /admin/dashboard
STAFF -> /staff/dashboard
TENANT -> /tenant/dashboard
```

Frontend should not rely on hidden UI alone for security. Backend still rejects unauthorized requests.

---

## 14. Folder Structure

Recommended React structure:

```text
src/
  app/
    App.tsx
    providers.tsx
    router.tsx
  routes/
    ProtectedRoute.tsx
    RoleRoute.tsx
    routeConfig.ts
  layouts/
    PublicLayout.tsx
    TenantLayout.tsx
    StaffLayout.tsx
    AdminLayout.tsx
  pages/
    public/
    tenant/
    staff/
    admin/
  components/
    ui/
    common/
    forms/
    tables/
    feedback/
  features/
    auth/
    concerns/
    appointments/
    offices/
    staff/
    users/
    notifications/
    dashboard/
    feedbacks/
  services/
    api/
      client.ts
      endpoints.ts
    auth.service.ts
    concern.service.ts
    appointment.service.ts
    office.service.ts
    staff.service.ts
  hooks/
    useAuth.ts
    useCurrentUser.ts
    useRoleRedirect.ts
  store/
    auth.store.ts
    ui.store.ts
  types/
    api.ts
    auth.ts
    concern.ts
    appointment.ts
    office.ts
    staff.ts
  utils/
    formatDate.ts
    formatStatus.ts
    errors.ts
    permissions.ts
  styles/
    globals.css
```

### src/app/

Application bootstrap, providers, and router setup.

### src/routes/

Route guards and route definitions.

### src/layouts/

Role-specific layout shells.

### src/pages/

Route-level page components grouped by user type.

### src/components/

Reusable generic UI components.

### src/features/

Domain-specific components, hooks, and logic.

Examples:

- `features/concerns/components/ConcernCard.tsx`
- `features/appointments/components/AvailabilityGrid.tsx`

### src/services/

API client and endpoint-specific service functions.

### src/hooks/

Reusable hooks that compose services, stores, and router behavior.

### src/store/

Zustand stores for client-owned state.

### src/types/

Frontend TypeScript types and enums aligned with backend.

### src/utils/

Pure helpers for formatting, errors, and permission checks.

---

## 15. Future Frontend Features

### Real-time notifications

Add WebSocket or Server-Sent Events support when backend notification events exist.

Frontend changes:

- live notification badge
- toast on new events
- query invalidation on relevant events

### WebSockets

Potential channels:

- user notifications
- office concern queue updates
- appointment approval updates
- admin dashboard metrics

### Live dashboard updates

Use polling first, then WebSockets if needed.

Recommended initial approach:

- React Query refetch intervals for dashboard metrics.

### Announcement system

Future module for condo-wide announcements.

UI:

- admin announcement composer
- tenant/staff announcement feed
- pinned notices

### Mobile responsiveness

Must support:

- mobile tenant flows
- responsive sidebars
- compact tables as cards
- touch-friendly calendar slots

Staff/admin desktop density should remain strong, but mobile should still be usable.

### PWA support

Future support:

- installable tenant portal
- offline shell
- cached static assets
- push notifications if backend supports them

### Accessibility

Design targets:

- keyboard navigation
- focus states
- ARIA labels on icon buttons
- sufficient color contrast
- readable status labels beyond color alone

### Testing strategy

Frontend should eventually include:

- unit tests for utility functions
- component tests for forms and badges
- route guard tests
- API mock tests
- end-to-end tests for:
  - login
  - create concern
  - process concern workflow
  - book appointment
  - admin office/staff management

