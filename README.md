# TravelEase - Premium Travel Booking & AI Itinerary Platform

TravelEase is a modern, full-stack travel reservation and AI planning ecosystem built with Next.js, Prisma, and PostgreSQL. It features multi-role portals for travelers and accommodation partners, coupled with state-of-the-art AI tooling.

---

## 🚀 Currently Working Features

### 1. Multi-Role Authentication & Portals
- **Secure Access**: JWT-token based security and role-routing saved securely in LocalStorage.
- **Dedicated Dashboards**: Customizable portals for **Travelers** and **Hotel Partners**.

### 2. Hotel Partner Dashboard & Inventory Management
- **Property Registry**: Property managers can select and manage their specific hotels.
- **Interactive Room Management**: 
  - Add new rooms with details (room number, floor, price, capacity).
  - Edit room details (nightly rates, capacity, floor).
  - Manually update room status (`Available`, `Occupied`, `Maintenance`, `Blocked`) and current occupancy percentage.
  - Changes instantly update the Postgres database via dedicated API routes.

### 3. Traveler Hotel Booking & Search
- **Live Search Engine**: Query hotels by name, location, or category.
- **Dummy Filter**: Filters out legacy dummy hotels (e.g. Leela Goa, Taj Lake Palace with 0 rooms) and displays only active properties containing bookable room inventory.

### 4. AI Travel Planner
- **Detailed Trip Parameters**: Input place, budget, days, traveler headcount, interest tags (e.g., Adventure, Relaxing, Cultural), trip pace (Relaxed, Balanced, Fast-paced), accommodation preferences, and dietary requirements.
- **AI Core**: Integrates with the Gemini 2.5 Flash model to draft custom day-by-day itineraries.
- **Persistence & Cloud Saving**: Save generated itineraries directly to the PostgreSQL database under the user's account.
- **Instant Retrieval**: View previously saved itineraries from a dashboard sidebar.
- **Markdown Export**: One-click download of generated plans as `.md` files.

### 5. AI Customer Support Agent
- **Interactive Chat Console**: Live support interface with quick-prompt chips.
- **Support Persona**: Driven by Gemini 2.5 Flash, responding to cancellation guidelines (100% refund up to 24h prior), booking queries, and transit details.
- **History Control**: Quick chat clearing and state preservation.

### 6. Clean Traveler Portal Gates
- Branded "Coming Soon" states for Flights, Packages, Activities, Visa, and Insurance services, keeping the UI clean and ready for third-party API integrations.

---

## 🛠️ Technology Stack
- **Frontend & Routing**: Next.js 16.2 (App Router), React, Tailwind CSS / Vanilla CSS, Framer Motion, Lucide Icons.
- **Database ORM**: Prisma Client.
- **Database**: PostgreSQL (hosted on Supabase).
- **AI Integration**: Google Gemini API (using Gemini 2.5 Flash).

---

## 🏁 Getting Started

### 1. Prerequisites
Ensure you have a `.env` file in the root directory containing the database credentials and AI API keys:
```env
DATABASE_URL="postgresql://user:pass@host:port/db"
GEMINI_API_KEY="AIzaSy..."
```

### 2. Running Locally
Run the development server:
```bash
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
