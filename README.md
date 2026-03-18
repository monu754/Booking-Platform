# StagePass: Premium Show Booking Platform

A professional, high-end show booking ecosystem designed for elite performance venues.

## Discover the StagePass Transformation

StagePass has been completely redesigned to deliver a premium, aesthetic, and professional experience. The platform seamlessly guides users from show discovery to secure seat reservations with a focus on visual excellence and operational security.

### Key Experience Features

- **Redesigned Identity**: A sophisticated Midnight & Royal visual theme using modern typography and glassmorphism.
- **Fluid Discovery**: High-impact show cards and detailed performance timing matrices.
- **Interactive Reservation**: Immersive seat selection maps with real-time feedback.
- **Synchronized Checkout**: Professional receipt generation and simulated payment success/failure traces.
- **HQ Control Room**: A data-centric administrative dashboard for system throughput and commercial visibility.
- **Identity Control**: Robust user profile management and booking synchronization.

- Real-time seat synchronization with WebSockets
- Richer admin analytics and user management UI

## Monorepo Structure

```text
show-booking-platform/
├── apps/
│   ├── frontend/        React + Vite app
│   └── backend/         Spring Boot app
├── packages/
│   ├── ui/              Shared UI package
│   ├── utils/           Shared helper functions
│   └── types/           Shared request/response types
├── infra/
│   ├── database/        SQL schema and seed files
│   └── docker/          Reserved for container setup
├── docs/                Project docs and implementation notes
├── pnpm-workspace.yaml
└── package.json
```

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios

### Backend

- Spring Boot 3
- Spring Security
- Spring Data JPA
- JWT via `jjwt`
- WebSocket/STOMP configuration scaffold
- H2 for local development
- MySQL for persistent deployment

### Shared

- PNPM workspace
- Shared TypeScript packages in `packages/*`

## RBAC Permission Table

| Feature | USER | ADMIN | ORGANIZER | STAFF |
|---|---:|---:|---:|---:|
| Browse shows | Yes | Yes | Yes | Yes |
| View show details and seat map | Yes | Yes | Yes | Yes |
| Register / login | Yes | Yes | Yes | Yes |
| Create bookings | Yes | No | No | No |
| Simulate payment | Yes | No | No | No |
| View own bookings | Yes | No | No | No |
| Create / update shows | No | Yes | Yes | No |
| Access admin area | No | Yes | Yes | No |
| Manage users | Planned | Planned | No | No |

## Demo Accounts

These accounts are seeded automatically in the local profile:

| Role | Email | Password |
|---|---|---|
| USER | `user@stagepass.local` | `password123` |
| ADMIN | `admin@stagepass.local` | `admin123` |
| ORGANIZER | `organizer@stagepass.local` | `organizer123` |

## Backend Profiles

### MySQL Profile

Use the `mysql` profile when you want persistent data in MySQL.

File:

- `apps/backend/src/main/resources/application-mysql.yml`

Default MySQL settings:

- Host: `localhost`
- Port: `3306`
- Database: `show_booking_platform`
- Username: `root`
- Password: `root`

Supported environment variables:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`

Behavior:

- Uses MySQL as the primary persistent database
- Automatically creates the database if it does not exist
- Keeps your users, shows, bookings, seats, and payments across restarts
- Seeds the demo login accounts if they are missing
- Seeds the demo venue/show data only when the MySQL database is still empty

### Local Profile

The backend now defaults to the `local` profile so `mvn spring-boot:run` works without MySQL setup.

Behavior:

- Uses in-memory H2 database
- Seeds roles, demo users, seats, shows, and timings
- Lets you run the project immediately without MySQL

Files:

- `apps/backend/src/main/resources/application.yml`
- `apps/backend/src/main/resources/application-local.yml`

You can still override the MySQL settings with environment variables.

## Installation

### Prerequisites

- Node.js 20+ recommended
- npm
- pnpm 10+
- Java 17
- Maven 3.9+

### Install Frontend Dependencies

From the repository root:

```powershell
pnpm install
```

If `pnpm` is not installed:

```powershell
npm install -g pnpm
```

## Running The Project

### Option 1: Run With MySQL

Use this when you want persistent data.

1. Start the backend:

```powershell
cd apps/backend
$env:DB_USERNAME="root"
$env:DB_PASSWORD="Monu24"
mvn spring-boot:run "-Dspring-boot.run.profiles=mysql"
```

The backend starts on:

- `http://localhost:8080`

Demo accounts in MySQL mode:

- `user@stagepass.local` / `password123`
- `admin@stagepass.local` / `admin123`
- `organizer@stagepass.local` / `organizer123`

2. Start the frontend from the repository root:

```powershell
pnpm --filter frontend dev --host 0.0.0.0
```

The frontend starts on:

- `http://localhost:5173`

### Option 2: Local Development With H2

This is the default mode and needs no MySQL connection:

```powershell
cd apps/backend
mvn spring-boot:run
```

Then start the frontend:

```powershell
pnpm --filter frontend dev --host 0.0.0.0
```

## Build Commands

### Frontend Production Build

```powershell
pnpm --filter frontend build
```

### Backend Compile Check

```powershell
cd apps/backend
mvn -DskipTests compile
```

## Core URLs

### Frontend

- `/`
- `/login`
- `/register`
- `/shows`
- `/shows/:showId`
- `/shows/:showId/seats?timingId=:id`
- `/checkout`
- `/bookings`
- `/profile`
- `/admin`

### Backend API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/shows`
- `GET /api/shows/{id}`
- `POST /api/shows`
- `PUT /api/shows/{id}`
- `GET /api/seats?showTimingId={id}`
- `POST /api/bookings`
- `GET /api/bookings/user`
- `POST /api/payments/simulate`

## Current Booking Flow

1. User opens `/shows`
2. User opens a show details page
3. User selects a timing
4. User selects seats
5. Selected seats are stored in the frontend booking draft store
6. Checkout creates a booking
7. Checkout simulates payment success or failure
8. Booking history reflects payment status and transaction ID

## Security And Hardening Notes

The following protections are currently implemented:

- JWT-based authentication
- Role-based endpoint protection with Spring Security method security
- Public and protected route separation in the frontend
- Password hashing with BCrypt
- Duplicate email registration blocked
- Duplicate seat booking blocked
- Repeat successful payment blocked
- Cross-user payment attempts blocked
- Seat-to-show-timing screen mismatch blocked
- Validation error responses returned as JSON
- Error route exposure fixed so public failures do not appear as false authorization failures

## Issues Found And Fixed During Local Verification

During local hardening and test execution, the following issues were found and fixed:

- Backend could not run locally without MySQL
  - Fixed by adding an H2-backed `local` profile
- Seed runner order caused startup failure
  - Fixed with explicit runner ordering
- Public show browsing returned `403`
  - Root cause was a lazy-loading exception during show timing mapping
  - Fixed with transactional read methods and public `/error`
- Booking flow had no checkout state handoff
  - Fixed with a dedicated frontend booking draft store
- Payment flow was incomplete
  - Fixed by adding backend payment simulation endpoint and frontend checkout integration
- Booking history lacked payment metadata
  - Fixed by enriching the booking response contract

## Validation And Verification Performed

The following checks were executed successfully in the local environment:

- Frontend production build
- Backend compile
- Public `GET /api/shows`
- Unauthorized access rejection for `GET /api/bookings/user`
- User blocked from admin-only show creation
- Admin allowed to create shows
- Invalid seat booking rejected
- Double booking rejected
- Failed payment handled
- Successful payment handled
- Repeat successful payment rejected
- Cross-user payment attempt rejected
- Chrome opened in guest mode against the running frontend for manual sanity checking

## Local API Behavior Summary

Expected examples:

- Anonymous `GET /api/shows` returns `200`
- Anonymous `GET /api/bookings/user` returns `403`
- Duplicate registration returns `400`
- Invalid auth payload returns `400` with validation details
- USER token cannot `POST /api/shows`
- ADMIN token can `POST /api/shows`
- Duplicate seat booking returns `400`
- Payment on already confirmed booking returns `400`

## Important Files

Frontend:

- `apps/frontend/src/router.tsx`
- `apps/frontend/src/layouts/AppLayout.tsx`
- `apps/frontend/src/pages/ShowListingPage.tsx`
- `apps/frontend/src/pages/ShowDetailsPage.tsx`
- `apps/frontend/src/pages/SeatSelectionPage.tsx`
- `apps/frontend/src/pages/CheckoutPage.tsx`
- `apps/frontend/src/pages/MyBookingsPage.tsx`
- `apps/frontend/src/store/sessionStore.ts`
- `apps/frontend/src/store/bookingStore.ts`

Backend:

- `apps/backend/src/main/java/com/showbooking/backend/config/SecurityConfig.java`
- `apps/backend/src/main/java/com/showbooking/backend/config/DataInitializer.java`
- `apps/backend/src/main/java/com/showbooking/backend/service/AuthService.java`
- `apps/backend/src/main/java/com/showbooking/backend/service/ShowService.java`
- `apps/backend/src/main/java/com/showbooking/backend/service/BookingService.java`
- `apps/backend/src/main/java/com/showbooking/backend/service/PaymentService.java`
- `apps/backend/src/main/java/com/showbooking/backend/controller/PaymentController.java`

Database:

- `infra/database/schema.sql`
- `infra/database/seed.sql`

## Known Gaps

These are not yet fully implemented:

- Real-time seat locking and release with WebSockets
- Complete admin analytics APIs and UI
- Manage-users backend and frontend flows
- Toast notifications
- Skeleton loaders
- Automated backend and frontend tests
- Payment gateway integration beyond simulation

## Recommended Next Steps

1. Implement WebSocket seat-lock events to reduce double booking race windows.
2. Add admin analytics endpoints for revenue, bookings, and active shows.
3. Add tests for auth, booking conflict, and payment edge cases.
4. Add user management APIs and admin UI.
5. Add toast notifications and skeleton states for richer UX polish.
