# Production Station Search Investigation

## Summary

The deployed Vercel failure for `OLD DELHI` appears to be caused by missing train station data in the production runtime environment. Local behavior is successful because the dataset file `travel-platform/schedules_pretty.json` exists locally and is being loaded by the fallback cache layer.

## Evidence

1. `src/app/api/trains/search/route.ts` calls `trainService.searchTrains`.
2. `src/lib/trainService.ts` resolves station names via `trainRepository.findStation(request.from)` and `findStation(request.to)`.
3. `src/lib/trainRepository.ts` uses a DB-first strategy with fallback to `trainCache` if the database lookup returns no results or if the DB connection fails.
4. `src/lib/trainCache.ts` loads `schedules_pretty.json` at runtime from:
   - `path.join(process.cwd(), 'schedules_pretty.json')`
   - `path.join(process.cwd(), '..', 'schedules_pretty.json')`
5. Local debug evidence from `.next/dev/logs/next-development.log` shows successful JSON loading from `C:\Users\deepa\OneDrive\Desktop\travel-booking\travel-platform\schedules_pretty.json`.
6. `travel-platform/schedules_pretty.json` is a real JSON dataset and is currently tracked with Git LFS (`travel-platform/.gitattributes`).

## Relevant Code Path

- `src/app/api/trains/search/route.ts` → `trainService.searchTrains`
- `src/lib/trainService.ts` → `trainRepository.findStation`
- `src/lib/trainRepository.ts`:
  - Query PostgreSQL via Prisma
  - If station not found, load `trainCache` and attempt `getStation`
- `src/lib/trainCache.ts`:
  - Reads schedule JSON file from filesystem
  - Builds in-memory station and stop caches

## Likely Root Cause

The code is designed correctly for a DB-first + JSON fallback model, but it depends on the runtime availability of `schedules_pretty.json`.

Two failure modes are most plausible in Vercel production:

1. The production database exists but is empty or missing station records for `OLD DELHI`.
2. The JSON dataset file is not available to the deployed server runtime, so the fallback cache cannot be built.

If both are true, the search will fail with `Station not found: OLD DELHI`.

## Why This Is the Most Likely Cause

- The search failure is a station lookup failure, not a build failure.
- `trainRepository.findStation` already falls back to cache when the DB query returns no row.
- Local verification shows the cache works when the JSON file exists.
- The file is large and is tracked by Git LFS, which introduces deployment risk because Vercel may not retrieve or include the object in every deployment the same way it handles normal Git files.

## Deployment Risk Factors

- `schedules_pretty.json` is read at runtime rather than bundled by the build system.
- The fallback cache depends on the filesystem path and the presence of the JSON file at deployment time.
- There is no existing production health endpoint or log message that exposes whether the cache file was found or failed to load in deployed Vercel.

## Validation Checklist

- [x] Local dataset file exists at `travel-platform/schedules_pretty.json`
- [x] Local dataset file is parseable as JSON
- [x] Local dev logs confirm cache load from `schedules_pretty.json`
- [x] Deployment code path uses `process.cwd()` plus relative paths to locate the JSON file
- [x] DB-first fallback logic is implemented in `src/lib/trainRepository.ts`

## Recommended Next Steps

1. Confirm the deployed Vercel environment actually includes `travel-platform/schedules_pretty.json` and not an LFS pointer or missing file.
2. Verify the deployed database contents for the `station` table, especially whether `OLD DELHI` exists.
3. Add a runtime status endpoint or log statement that reports:
   - whether `schedules_pretty.json` was found
   - whether cache initialization succeeded
   - whether database health is available
4. If the dataset file cannot be reliably deployed via Git LFS, move the fallback data into a supported storage layer (e.g. a seeded PostgreSQL table, remote object storage, or a smaller packaged JSON asset).
5. Optionally, add explicit production telemetry for the cache fallback path so future failures are diagnosable without source changes.

## Conclusion

The current production failure is most likely not due to the train search code itself, but due to missing or unavailable runtime data in Vercel. The key actionable investigation is to verify the deployed `schedules_pretty.json` file and the production PostgreSQL seed state.
