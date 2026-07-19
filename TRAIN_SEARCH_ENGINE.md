# Train Search Engine - Complete Implementation Guide

## Overview

This is a **production-grade Train Search Engine** for the AI-powered Travel & Hospitality Platform. It provides fast, reliable train search with dual-mode architecture (PostgreSQL + in-memory cache fallback).

## Architecture

### Technology Stack
- **Frontend**: Next.js 16.2.9, React 19.2.4, TypeScript 5.x, Tailwind CSS
- **Backend**: Node.js + Express (implicit), TypeScript, Prisma ORM 5.8.0
- **Database**: PostgreSQL (primary), In-memory JSON cache (fallback)
- **Data**: Railway schedules from `schedules_pretty.json` (millions of records)

### Layered Architecture
```
Routes (API endpoints)
  ↓
Controllers (HTTP handlers)
  ↓
Services (Business logic)
  ↓
Repositories (Data access with dual DB/cache support)
  ↓
Database Layer (Prisma ORM + In-Memory Cache)
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
# Create PostgreSQL database connection
# Add DATABASE_URL to .env file

# Run migrations
npm run prisma:db:push:postgres

# Or for SQLite (development only)
npm run prisma:db:push
```

### 3. Import Train Schedules

This is a **one-time operation** that imports railway data from `schedules_pretty.json` to the database.

```bash
npm run trains:import
```

**What it does:**
- Reads `schedules_pretty.json` from workspace root
- Groups records by `train_number`
- Sorts each train by `id` (ascending)
- Assigns `stop_sequence` (1-indexed)
- Extracts source/destination as first/last stations
- Loads data into PostgreSQL atomically
- Falls back to in-memory cache if DB unavailable

**Expected output:**
```
🚂 Starting train schedules import...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Import completed successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Statistics:
  • Total records read:    4,234,567
  • Unique trains:         12,345
  • Unique stations:       987
  • Trains inserted:       12,345
  • Train stops inserted:  4,234,567
  • Duration:              45,230ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Start Development Server
```bash
npm run dev
```

Server runs at: `http://localhost:3000`

## API Endpoints

### 1. Search Trains

**Endpoint:** `POST /api/trains/search`

**Request:**
```json
{
  "from": "New Delhi",
  "to": "Mumbai",
  "departureDate": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "trainNumber": "12001",
      "trainName": "Rajdhani Express",
      "boardingStation": "New Delhi",
      "boardingStationCode": "NDLS",
      "destinationStation": "Mumbai Central",
      "destinationStationCode": "MMCT",
      "departureTime": "16:00",
      "arrivalTime": "08:00",
      "journeyDuration": "16:00",
      "totalStopsBetween": 3,
      "day": 1,
      "boardingStopSequence": 1,
      "destinationStopSequence": 5
    }
  ],
  "total": 24
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "STATION_NOT_FOUND",
    "message": "Station not found: InvalidCity",
    "statusCode": 404,
    "details": { "station": "InvalidCity" }
  }
}
```

### 2. Get Train Route (All Stops)

**Endpoint:** `GET /api/trains/{trainNumber}/route`

**Response:**
```json
{
  "success": true,
  "data": {
    "trainNumber": "12001",
    "trainName": "Rajdhani Express",
    "sourceStation": "New Delhi",
    "destinationStation": "Mumbai Central",
    "totalStops": 5,
    "stops": [
      {
        "stopSequence": 1,
        "stationName": "New Delhi",
        "stationCode": "NDLS",
        "arrival": "--:--",
        "departure": "16:00",
        "day": 1
      },
      {
        "stopSequence": 2,
        "stationName": "Gwalior Junction",
        "stationCode": "GWL",
        "arrival": "21:30",
        "departure": "21:45",
        "day": 1
      },
      {
        "stopSequence": 5,
        "stationName": "Mumbai Central",
        "stationCode": "MMCT",
        "arrival": "08:00",
        "departure": "--:--",
        "day": 2
      }
    ]
  }
}
```

### 3. Station Autocomplete

**Endpoint:** `GET /api/trains/stations/search?q={query}`

**Parameters:**
- `q`: Query string (minimum 2 characters)

**Response:**
```json
{
  "success": true,
  "data": [
    { "code": "NDLS", "name": "New Delhi" },
    { "code": "NDSA", "name": "New Delhi Airport" }
  ],
  "total": 2
}
```

## Frontend Components

### 1. TrainSearch Component
**File:** `src/components/search/TrainSearch.tsx`

Features:
- From/To station input with icons
- Swap button (reverse stations)
- Date picker with quick buttons (Tomorrow, Day After)
- Loading state with disabled inputs
- Navigates to `/trains` page with search parameters

**Usage:**
```tsx
import TrainSearch from "@/components/search/TrainSearch";

export default function SearchPage() {
  return <TrainSearch />;
}
```

### 2. TrainResultCard Component
**File:** `src/components/TrainResultCard.tsx`

Features:
- Displays train details (name, number, times)
- Shows journey duration and stops between
- "View All Stops" button (opens modal)
- "Book Now" button (placeholder)
- Hover effects with smooth animations

### 3. ViewStopsModal Component
**File:** `src/components/ViewStopsModal.tsx`

Features:
- Modal displaying all stops on the train's route
- Timeline visualization with connected dots
- Highlights boarding and destination stations
- Shows arrival/departure times for each stop
- Handles multi-day journeys (shows day number)

### 4. Trains Page
**File:** `src/app/trains/page.tsx`

Features:
- Dynamic rendering with `useSearchParams`
- Loading state with spinner
- Error state with user-friendly messages
- Empty state if no trains found
- Results grid with train cards
- Station statistics (count of available trains)

## File Structure

```
src/
├── types/
│   └── train.ts                 # All type definitions
├── lib/
│   ├── trainErrors.ts           # Error classes with HTTP status codes
│   ├── trainCache.ts            # In-memory JSON cache (fallback)
│   ├── trainRepository.ts       # Data access layer (dual mode)
│   ├── trainImportPipeline.ts   # Import service with processing logic
│   ├── trainService.ts          # Business logic layer
│   └── logger.ts                # Logging utility
├── app/
│   ├── trains/
│   │   └── page.tsx             # Search results page
│   └── api/
│       └── trains/
│           ├── search/
│           │   └── route.ts     # POST /api/trains/search
│           ├── [trainNumber]/
│           │   └── route.ts     # GET /api/trains/[trainNumber]/route
│           └── stations/
│               └── search/
│                   └── route.ts # GET /api/trains/stations/search
└── components/
    ├── search/
    │   └── TrainSearch.tsx      # Search form component
    ├── TrainResultCard.tsx      # Train result card
    └── ViewStopsModal.tsx       # Route details modal

scripts/
└── importTrains.ts              # CLI script for data import
```

## Data Flow

### Search Request Flow
```
User enters search → TrainSearch component → POST /api/trains/search
                                              ↓
                                      trainService.searchTrains()
                                      ↓
                                      trainRepository.findStation() [From]
                                      trainRepository.findStation() [To]
                                      trainRepository.getTrainsBetween()
                                      ↓ (for each train)
                                      trainRepository.getTrainStops()
                                      trainRepository.getTrain()
                                      ↓
                                      Returns TrainSearchResult[]
                                      ↓
                                      /trains page displays results
```

### Database Query Flow
```
trainRepository.getTrainsBetween()
├─ IF using cache → trainCache.getTrainsBetweenStations()
└─ IF using DB → Prisma query
   ├─ Find all TrainStops with fromStationCode
   ├─ Include related train and all its trainStops
   ├─ Filter where toStationCode exists in train
   ├─ Verify fromStop.sequence < toStop.sequence
   └─ Return filtered TrainStop[] array
```

## Key Implementation Details

### 1. Data Import Logic

**Critical: Dataset Structure**
- Records are NOT globally sorted by stop sequence
- Each train's records are scattered throughout the file
- Solution: Group by `train_number`, then sort by `id` (ascending)

**Import Process:**
```typescript
1. Read schedules_pretty.json line by line
2. Group records by train_number
3. For each train:
   - Sort stops by id (ascending)
   - Assign stop_sequence = 1, 2, 3, ...
   - Extract source = first stop's station
   - Extract destination = last stop's station
4. Insert into database atomically
5. Convert "None" to null for times
```

### 2. Dual-Mode Architecture

**Database Mode (Primary):**
- Uses PostgreSQL via Prisma
- Fast queries with indexes
- Supports large datasets

**Cache Mode (Fallback):**
- Triggered when DB connection fails
- Loads all data into memory
- Same API interface as DB mode
- Stays in cache mode for session lifetime

**Transparent Switching:**
```typescript
try {
  // Try database query
  return await prisma.trainStop.findMany(...)
} catch (error) {
  // Fall back to cache
  this.dbConfig.useDatabase = false;
  return trainCache.getTrainsBetweenStations(...);
}
```

### 3. Journey Duration Calculation

Handles multi-day journeys correctly:
```typescript
// Calculate total minutes
totalMinutes = arrivalMinutes - departureMinutes
            + (destinationDay - boardingDay) * 24 * 60

// Handle overnight journeys
if (totalMinutes < 0) {
  totalMinutes += 24 * 60;  // Add 24 hours
}

// Format as HH:MM
hours = Math.floor(totalMinutes / 60);
minutes = totalMinutes % 60;
```

### 4. Error Handling

**Custom Error Classes:**
- `StationNotFoundError` → 404
- `NoTrainsFoundError` → 404
- `InvalidSearchError` → 400
- `InvalidDateError` → 400
- `DatabaseError` → 500
- `ImportError` → 500

**Error Response Format:**
```json
{
  "code": "ERROR_CODE",
  "message": "User-friendly message",
  "statusCode": 400,
  "details": { "extra": "context" }
}
```

## Performance Characteristics

### Database Indexes (Pre-configured in Prisma)
- `Station.code` → Unique index
- `Train.trainNumber` → Unique index
- `TrainStop.trainNumber_stopSequence` → Composite unique index
- `TrainStop.stationCode` → For search queries

### Query Performance
- Station lookup: O(1) via index
- Train search: O(log n) binary search + O(m) result collection
- Route details: O(1) train lookup + O(k) stops iteration
- Cache fallback: O(n) linear scan + in-memory filtering

### Memory Usage
- Full cache: ~500MB for 4M+ records
- Lazy loading: Only loaded on DB failure
- Session-scoped: Garbage collected with session

## Testing

### Manual Testing

**Test 1: Search with valid stations**
```bash
curl -X POST http://localhost:3000/api/trains/search \
  -H "Content-Type: application/json" \
  -d '{"from":"New Delhi","to":"Mumbai","departureDate":"2024-01-15"}'
```

**Test 2: View route details**
```bash
curl http://localhost:3000/api/trains/12001/route
```

**Test 3: Station autocomplete**
```bash
curl "http://localhost:3000/api/trains/stations/search?q=Delhi"
```

**Test 4: Invalid station (should return 404)**
```bash
curl -X POST http://localhost:3000/api/trains/search \
  -H "Content-Type: application/json" \
  -d '{"from":"InvalidCity","to":"Mumbai","departureDate":"2024-01-15"}'
```

**Test 5: Same station (should return 400)**
```bash
curl -X POST http://localhost:3000/api/trains/search \
  -H "Content-Type: application/json" \
  -d '{"from":"New Delhi","to":"New Delhi","departureDate":"2024-01-15"}'
```

### End-to-End Workflow

1. Start dev server: `npm run dev`
2. Import data (first time only): `npm run trains:import`
3. Visit `http://localhost:3000`
4. Enter search criteria on home page
5. Click "Search Trains" button
6. View results on `/trains` page
7. Click "View All Stops" on any train
8. See detailed route information in modal

## Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:** The system will automatically fall back to in-memory cache. No action needed.

### Issue: "Station not found"
**Cause:** Station name/code not in database
**Solution:** Check station list via autocomplete endpoint or ensure data was imported

### Issue: "No trains found"
**Cause:** No trains available between stations on that date
**Solution:** Try different stations or dates

### Issue: Duration shows "--:--"
**Cause:** Missing arrival or departure time in data
**Solution:** This is expected for terminus stations; data accuracy depends on import

## Production Deployment

### Environment Variables
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NODE_ENV=production
```

### Pre-deployment Checklist
- [ ] Run `npm run build` successfully
- [ ] Run data import: `npm run trains:import`
- [ ] Test all API endpoints
- [ ] Verify station search works
- [ ] Test error handling (invalid inputs)
- [ ] Check response times (should be <200ms)

### Scaling Considerations
- Implement Redis caching for repeated queries
- Add rate limiting (e.g., 100 requests/minute per IP)
- Monitor database query performance
- Set up alerting for import failures
- Consider pagination for large result sets

## Future Enhancements

1. **Station Autocomplete UI** - Real-time suggestions as user types
2. **Saved Searches** - Store favorite routes
3. **Price Integration** - Show ticket prices
4. **Availability Status** - Real-time seat availability
5. **Multi-leg Journeys** - Search with intermediate stops
6. **Booking Integration** - Direct booking from results
7. **Analytics** - Track popular routes and search patterns
8. **Internationalization** - Multi-language station names

## Support & Troubleshooting

For questions or issues:
1. Check the API response error codes and messages
2. Review type definitions in `src/types/train.ts`
3. Check server logs for import or query errors
4. Verify database connection and data import
5. Test API endpoints with curl before debugging frontend

## License

Part of the Travel Booking Platform project.
