# TravelEase Project Review & Workflow Documentation

**Last Updated:** June 24, 2026  
**Project Status:** Authentication + Portal System Complete | Postgres DB Migration Complete

---

## 1. Project Overview

**TravelEase** is a full-stack travel booking platform enabling users to search and book trains, flights, hotels, packages, activities, and visa services. The platform includes:
- Public landing page with search functionality
- 6 user role-based portals (Traveler, Hotel Partner, Travel Agent, Corporate, Admin)
- Complete JWT-based authentication system
- PostgreSQL database backend with Prisma ORM
- Real-time Contact modal in navbar

---

## 2. Tech Stack

### **Frontend**
- **Framework:** Next.js 16.2.9 (App Router)
- **Runtime:** React 19.2.4 + React DOM 19.2.4
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + PostCSS 4
- **UI Components:** Radix UI (Dialog, Select, Tabs)
- **Animations:** Framer Motion 12.40.0
- **Icons:** Lucide React 1.21.0
- **Carousels:** Swiper 12.2.0
- **Utilities:** `clsx`, `class-variance-authority`, `tailwind-merge`

### **Backend**
- **Runtime:** Node.js (via Next.js API Routes)
- **ORM:** Prisma 5.8.0 (`@prisma/client`)
- **Authentication:** JWT (`jsonwebtoken` 9.0.0)
- **Password Hashing:** bcryptjs 2.4.3
- **Type Safety:** TypeScript 5

### **Database**
- **Primary:** PostgreSQL 18 (production)
- **Fallback:** SQLite (dev—deprecated)
- **Schema Provider:** Prisma 5.8.0
- **Migrations:** Prisma managed migrations in `prisma/migrations/`

### **Dev Tools**
- **Linting:** ESLint 9
- **Testing:** Vitest 1.5.8
- **Package Manager:** npm

---

## 3. Database Schema & Data Model

### **Core Tables**

```
User
├─ id (CUID)
├─ name
├─ email (UNIQUE)
├─ phone
├─ portal (Traveler | Hotel Partner | Travel Agent | Corporate | Admin)
├─ org (optional—for corporate/hotel partner)
├─ password (bcrypt hash)
├─ createdAt
└─ bookings (relation to Booking[])

Hotel
├─ id (CUID)
├─ name
├─ slug (UNIQUE)
├─ location
├─ description
├─ category
├─ rating
├─ nightlyRate (in INR)
├─ currency (default: INR)
├─ available (boolean)
└─ createdAt

Flight
├─ id (CUID)
├─ airline
├─ flightNumber
├─ origin
├─ destination
├─ departureTime
├─ arrivalTime
├─ duration
├─ price (in INR)
├─ currency (default: INR)
├─ available
└─ createdAt

Package
├─ id (CUID)
├─ name
├─ durationDays
├─ price
├─ currency
├─ perks
├─ available
└─ createdAt

Activity
├─ id (CUID)
├─ name
├─ location
├─ price
├─ currency
├─ duration
├─ available
└─ createdAt

Visa
├─ id (CUID)
├─ country
├─ type
├─ duration
├─ fee
├─ currency
├─ available
└─ createdAt

Booking
├─ id (CUID)
├─ user (relation to User)
├─ userId (FK)
├─ itemType (hotel | flight | package | activity | visa)
├─ itemId
├─ status (pending | confirmed | cancelled)
└─ createdAt
```

---

## 4. Frontend Architecture

### **Directory Structure**

```
src/
├─ app/
│  ├─ globals.css (Tailwind base)
│  ├─ layout.tsx (Root layout)
│  ├─ page.tsx (Landing page)
│  ├─ login/page.tsx (Login form)
│  ├─ register/page.tsx (Registration form)
│  ├─ trains/page.tsx (Train search page)
│  ├─ api/ (Backend routes)
│  │  ├─ login/route.ts
│  │  ├─ register/route.ts
│  │  ├─ bookings/route.ts
│  │  ├─ users/route.ts
│  │  ├─ visa/route.ts
│  │  └─ search/ (flights, hotels, trains, activities, packages)
│  └─ portal/ (6 role-based dashboards)
│     ├─ traveler/
│     │  ├─ page.tsx (Dashboard)
│     │  ├─ flights/
│     │  ├─ hotels/
│     │  ├─ packages/
│     │  ├─ activities/
│     │  ├─ visa/
│     │  ├─ insurance/
│     │  ├─ destinations/
│     │  ├─ ai-planner/
│     │  └─ ai-assistant/
│     ├─ hotel-partner/
│     ├─ travel-agent/
│     ├─ corporate/
│     └─ admin/
├─ components/
│  ├─ Navbar.tsx (Header + Contact Modal)
│  ├─ Footer.tsx (Footer + Contact Link)
│  ├─ Hero.tsx (Landing hero)
│  ├─ HotelCards.tsx (Hotel listing)
│  ├─ PopularDestinations.tsx (Destination cards)
│  ├─ QuickActions.tsx (Quick booking actions)
│  ├─ OffersSection.tsx (Promotional offers)
│  ├─ FeaturedBanner.tsx
│  ├─ MobileAppSection.tsx
│  ├─ TrainResults.tsx & TrainsResultsPage.tsx
│  ├─ search/
│  │  ├─ FlightSearch.tsx
│  │  ├─ HotelSearch.tsx
│  │  ├─ TrainSearch.tsx
│  │  └─ BusSearch.tsx
│  ├─ portal/
│  │  ├─ PortalShell.tsx (Main portal wrapper with sidebar + auth routing)
│  │  └─ DashboardWidgets.tsx (Reusable dashboard UI components)
│  └─ ui/ (Radix-based component library)
└─ lib/
   ├─ auth.ts (JWT sign/verify)
   ├─ authClient.ts (Client-side auth hooks: useAuthUser, useAuthDisplayName)
   ├─ backend.ts (DB helper functions)
   ├─ prisma.ts (Prisma singleton client)
   ├─ env.ts (Environment variable loading)
   ├─ utils.ts (Utility functions)
   ├─ irctc.ts (IRCTC API integration—trains)
   ├─ logger.ts
   ├─ validators.ts
   ├─ rateLimiter.ts
   ├─ apiError.ts
   └─ .env (Postgres credentials)
```

### **Key Frontend Components**

#### **Navbar.tsx**
- Fixed header with logo & TravelEase branding
- Desktop nav with Meal, E-Wallet, Alerts, Services (mega dropdown), Contact Us
- Mobile hamburger menu
- **New:** Contact modal that opens on "CONTACT US" click
  - Shows phone label: +91-8532068799
  - Email link (mailto): deepaman75655@gmail.com
- Login / Register button (top-right)

#### **PortalShell.tsx** (Portal System)
- Sidebar with collapsible navigation
- User authentication check in useEffect
  - If no user in localStorage → redirect to /login
  - Route validation (e.g., Traveler can only access /portal/traveler/*)
- Displays logged-in user name & role from `useAuthDisplayName()` hook
- Top bar with search, notifications, user profile
- Sign out functionality
- Supports all 6 portal roles

#### **Portal Pages (6 Dashboards)**
1. **Traveler Portal** (`/portal/traveler/*`)
   - Dashboard, Flights, Hotels, Packages, Activities, Visa, Insurance, Destinations, AI Planner, AI Assistant

2. **Hotel Partner Portal** (`/portal/hotel-partner/*`)
   - Register, Inventory, Pricing, Revenue, Bookings, Analytics

3. **Travel Agent Portal** (`/portal/travel-agent/*`)
   - Dashboard with agent-specific features

4. **Corporate Portal** (`/portal/corporate/*`)
   - Corporate travel management

5. **Admin Portal** (`/portal/admin/*`)
   - Analytics, system management

6. **Contact Modal**
   - Accessible from all portals via same navbar

---

## 5. Backend API Structure

### **API Routes (Next.js)**

#### **Authentication**
```
POST /api/register
├─ Input: { name, email, phone, password, portal, org? }
├─ Validation: Email format, password strength, phone format, portal enum
├─ Output: { user: { id, name, email, phone, portal, org } }
└─ Rate limit: 5 per IP per 15 min

POST /api/login
├─ Input: { email, password }
├─ Validation: Credentials format
├─ Output: { token, user: { id, name, email, portal } }
├─ Security: bcryptjs comparison, rate limit
└─ Rate limit: 10 per IP per 15 min
```

#### **Booking**
```
POST /api/bookings
├─ Auth required: Bearer token
├─ Input: { itemType, itemId, ... }
└─ Output: { bookingId, status, ... }

GET /api/bookings (user's bookings)
```

#### **Search**
```
GET /api/search/flights?origin=DEL&destination=BOM&date=2026-06-24
GET /api/search/hotels?location=Mumbai&checkIn=2026-06-24&checkOut=2026-06-25
GET /api/search/trains?from=DEL&to=BOM&date=2026-06-24
GET /api/search/activities?location=Mumbai
GET /api/search/packages?duration=7
```

#### **Users**
```
GET /api/users (profile—auth required)
```

#### **Visa**
```
GET /api/visa?country=US&type=tourist
```

---

## 6. Authentication Flow

### **Registration Flow**
```
User fills Register Form (src/app/register/page.tsx)
    ↓
Frontend validates email/password/phone locally
    ↓
POST /api/register { name, email, phone, password, portal, org? }
    ↓
Backend validates input
    ↓
Check if email already exists (Prisma query)
    ↓
Hash password with bcryptjs (salt rounds: 10)
    ↓
INSERT into User table via Prisma
    ↓
Return user object (without password)
    ↓
User redirected to login page
```

### **Login Flow**
```
User fills Login Form (src/app/login/page.tsx)
    ↓
Frontend validates email/password format
    ↓
POST /api/login { email, password }
    ↓
Backend queries User table by email
    ↓
bcryptjs.compare(password, storedHash)
    ↓
If match → signToken({ id, email, portal })
    ↓
Return { token, user }
    ↓
Frontend saves to localStorage with key "travelEaseAuth"
    ↓
Redirect to user's portal route (e.g., /portal/traveler)
```

### **Client-Side Auth Persistence**
```
useAuthUser() hook (src/lib/authClient.ts)
    ↓
useEffect → reads localStorage.getItem("travelEaseAuth")
    ↓
Parses JSON & extracts user object
    ↓
Returns AuthUser | null
    ↓
Used in PortalShell to:
    - Verify user is logged in
    - Redirect to /login if not
    - Display user name & role
```

### **Protected Routes**
```
PortalShell useEffect:
    ↓
const user = getAuthUser()
    ↓
If !user → router.replace("/login")
    ↓
If portal mismatch (e.g., Traveler accessing /portal/admin)
    → router.replace(expectedRoute)
```

---

## 7. Frontend-to-Database Interaction

### **Complete Request/Response Cycle Example: Book a Hotel**

```
User clicks "Book Now" on Hotel Card
    ↓
Portal/Traveler/Hotels page
    ↓
Frontend calls POST /api/bookings with { itemType: "hotel", itemId: "..." }
    ↓
Backend route (src/app/api/bookings/route.ts):
    1. Extract Authorization header (Bearer token)
    2. verifyToken() → decode JWT
    3. getUserFromRequest() → query Prisma for User
    4. Validate booking input
    ↓
Prisma ORM query:
    prisma.booking.create({
      data: {
        userId: user.id,
        itemType: "hotel",
        itemId,
        status: "pending"
      }
    })
    ↓
PostgreSQL INSERT into Booking table
    ↓
Return booking object { id, status, createdAt, ... }
    ↓
Frontend receives response
    ↓
Show success toast notification
    ↓
Update local state / redirect to booking confirmation
```

### **Data Flow: Display Traveler Hotels**

```
User navigates to /portal/traveler/hotels
    ↓
Frontend mounts HotelSearch component
    ↓
Optional: GET /api/search/hotels?location=...
    ↓
Backend queries Prisma:
    prisma.hotel.findMany({
      where: { available: true },
      take: 20
    })
    ↓
PostgreSQL SELECT * FROM Hotel WHERE available=true LIMIT 20
    ↓
Return hotel array
    ↓
Frontend renders HotelCards with map()
    ↓
User sees hotel list with price, rating, location
    ↓
Click card → navigates to hotel detail or triggers booking modal
```

---

## 8. Portal System (6 Role-Based Dashboards)

### **Portal Roles & Routes**

| Portal | Route | User Role | Access |
|--------|-------|-----------|--------|
| Traveler | `/portal/traveler` | Regular user booking travel | Search flights, hotels, activities, visa assistance |
| Hotel Partner | `/portal/hotel-partner` | Hotel owner/manager | Manage inventory, pricing, bookings, revenue, analytics |
| Travel Agent | `/portal/travel-agent` | Travel agency | Manage client bookings, commission tracking |
| Corporate | `/portal/corporate` | Corporate travel admin | Bulk booking, team travel management |
| Admin | `/portal/admin` | System administrator | Analytics, user management, system health |

### **Portal Shell Features**
- **Sidebar Navigation:** Collapsible with portal-specific routes
- **Top Bar:** Search, notifications (badge count), user profile, contact
- **User Detection:** Fetches from localStorage via `useAuthUser()`
- **Portal Styling:** Each portal has unique color scheme
  - Traveler: Blue (#1677FF)
  - Hotel Partner: Green (#059669)
  - Travel Agent: Amber (#D97706)
  - Corporate: Purple (#7C3AED)
  - Admin: Red (#DC2626)

---

## 9. Components Built

### **Public Pages**
- **Landing Page** (`src/app/page.tsx`): Hero, Quick Actions, Popular Destinations, Offers, Mobile App CTA
- **Login** (`src/app/login/page.tsx`): Email/password form with validation
- **Register** (`src/app/register/page.tsx`): Multi-field form (name, email, phone, password, portal selection)
- **Trains** (`src/app/trains/page.tsx`): Train search interface

### **Portal Components**
- **PortalShell:** Wrapper for all portal pages with sidebar, auth routing
- **DashboardWidgets:** Reusable `StatCard`, `SectionHeader`, `Card`, `Badge`, `PrimaryButton`
- **10+ Portal Pages:** Each role-specific dashboard with multiple sections

### **Global Components**
- **Navbar:** Header with mega dropdown (Services), Contact modal
- **Footer:** Link grid, social media, newsletter signup
- **Search Forms:** FlightSearch, HotelSearch, TrainSearch, BusSearch
- **Cards:** HotelCards, PopularDestinations, QuickActions
- **Sections:** Hero, OffersSection, FeaturedBanner, MobileAppSection

---

## 10. Key Features Implemented

### ✅ **Completed**
- [x] User registration with email uniqueness check
- [x] JWT-based login authentication
- [x] Password hashing (bcryptjs)
- [x] Client-side localStorage auth persistence
- [x] Protected portal routes with role-based access
- [x] 6 role-based portal dashboards
- [x] Portal Shell with collapsible sidebar
- [x] Dynamic user display name in portals
- [x] Database schema with 7 core tables
- [x] API routes for auth (login, register)
- [x] API routes for bookings, search, users
- [x] Navbar with Contact modal
- [x] Contact modal showing phone + email link
- [x] Footer with links

### 🔄 **In Progress / Planned**
- [ ] Full booking checkout flow
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] AI Travel Planner backend
- [ ] Analytics dashboard for Admin
- [ ] Hotel inventory management UI
- [ ] Rate limiting enforcement across all routes
- [ ] Comprehensive error handling
- [ ] Unit & integration tests

---

## 11. Database Setup & PostgreSQL Migration

### **Current Status**
- **Provider:** PostgreSQL 18 (production-ready)
- **Database Name:** `travel_booking`
- **Shadow DB:** `travel_booking_shadow` (for Prisma migrations)
- **Prisma Schema:** `prisma/schema.prisma` (provider: postgresql)
- **Migrations:** Located in `prisma/migrations/`
  - `20260624061228_init/` - Latest successful migration

### **Environment Configuration**
```
.env file contains:
DATABASE_URL="postgresql://postgres:0406@localhost:5432/travel_booking"
JWT_SECRET="your_jwt_secret_here"
JWT_EXPIRES="7d"
NEXT_PUBLIC_API_BASE="http://localhost:3000"
```

### **Migration Commands**
```bash
npm run prisma:db:push      # Push schema to DB without creating migrations
npm run prisma:migrate      # Create new migration
npm run prisma:generate     # Generate Prisma client
npm run prisma:seed         # Run seed script (prisma/seed.js)
```

### **Schema Provider History**
- ❌ SQLite (dev—deprecated in favor of Postgres)
- ✅ PostgreSQL (current—production-ready)

---

## 12. Frontend-to-Backend Communication

### **Request Headers**
```javascript
// Authenticated request (stored in localStorage)
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}

// Token payload
{
  "id": "user_cuid",
  "email": "user@example.com",
  "portal": "traveler",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### **Error Handling**
- **Rate Limiting:** 429 status + `Retry-After` header
- **Auth Errors:** 401 Unauthorized
- **Validation Errors:** 422 Unprocessable Entity
- **Duplicate Data:** 409 Conflict (e.g., email already registered)
- **Server Errors:** 500 Internal Server Error with logger

### **Logging**
- Logger utility (`src/lib/logger.ts`) tracks:
  - Successful logins/registrations
  - Failed attempts with IP address
  - Rate limit violations
  - API errors

---

## 13. Contact Us Feature

### **Implementation**
- **Navbar.tsx:** Added Contact button that opens modal
- **Modal Content:**
  - Phone: +91-8532068799 (label only, not clickable)
  - Email: deepaman75655@gmail.com (clickable `mailto:` link)
- **Desktop:** Click "CONTACT US" in header
- **Mobile:** Open menu → tap "Contact Us"
- **Footer:** "Contact Us" link also opens mail client

---

## 14. Current Known Issues & Blockers

### **Resolved ✅**
- ✅ PostgreSQL migration from SQLite
- ✅ Prisma client generation lock (killed Node processes)
- ✅ Hydration mismatch in portal pages (client-side auth hooks)
- ✅ Auth user display name (dynamic from localStorage)
- ✅ Contact Us functionality (modal + email/phone)

### **To Be Addressed**
- [ ] Run `npm run build` for production build validation
- [ ] Run `npm run test` to verify test suite
- [ ] Full browser testing of portal navigation
- [ ] Seed database with sample data (flights, hotels, etc.)

---

## 15. Development Workflow

### **Starting the Dev Server**
```bash
cd "c:\Users\deepa\OneDrive\Desktop\TRAVEL BOOKING\travel-booking"
npm run dev
# Opens http://localhost:3000
```

### **Making a Change**
1. Edit source file (React component or API route)
2. Next.js hot-reloads automatically
3. Test in browser at http://localhost:3000

### **Database Changes**
```bash
# After modifying prisma/schema.prisma:
npm run prisma:db:push      # Push to dev
npm run prisma:generate     # Regenerate client
npm run dev                 # Restart server
```

### **Testing & Validation**
```bash
npm run build               # Build for production
npm run lint                # Run ESLint
npm run test                # Run Vitest suite
npm run test:watch          # Watch mode
```

---

## 16. File Mapping Reference

### **Key Auth Files**
- `src/app/login/page.tsx` - Login UI
- `src/app/register/page.tsx` - Registration UI
- `src/app/api/login/route.ts` - Login endpoint
- `src/app/api/register/route.ts` - Registration endpoint
- `src/lib/auth.ts` - JWT sign/verify logic
- `src/lib/authClient.ts` - Client-side hooks (`useAuthUser`, `useAuthDisplayName`)
- `src/lib/backend.ts` - DB helpers (`registerUser`, `findUserByEmail`)

### **Portal Files**
- `src/components/portal/PortalShell.tsx` - Main portal wrapper
- `src/components/portal/DashboardWidgets.tsx` - Reusable UI components
- `src/app/portal/traveler/page.tsx` - Traveler dashboard
- `src/app/portal/hotel-partner/page.tsx` - Hotel Partner dashboard
- (Similar for other 4 portals)

### **Database Files**
- `prisma/schema.prisma` - Schema definition
- `prisma/migrations/` - Migration history
- `prisma/seed.js` - Seed script
- `.env` - Environment variables

---

## 17. Next Steps for Production Readiness

1. ✅ Set up PostgreSQL database locally
2. ✅ Run Prisma migrations to Postgres
3. ✅ Implement Contact modal with email/phone
4. 🔄 Seed database with sample travel data (flights, hotels, activities)
5. 🔄 Test all portal dashboards in browser
6. 🔄 Run full test suite (`npm run test`)
7. 🔄 Build for production (`npm run build`)
8. 🔄 Deploy to cloud (Azure, Vercel, etc.)
9. 🔄 Set up error monitoring & logging
10. 🔄 Implement payment processing for bookings

---

**Document Version:** 1.0  
**Generated:** 2026-06-24  
**Author:** Claude (AI Assistant)
