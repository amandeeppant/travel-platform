import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { trainCache } from '@/lib/trainCache';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

const scheduleCandidates = [
  path.join(process.cwd(), 'schedules_pretty.json'),
  path.join(process.cwd(), '..', 'schedules_pretty.json'),
];

function isGitLfsPointer(content: string): boolean {
  return /version https:\/\/git-lfs\.github\.com\/spec\/v1/.test(content) && /oid sha256:/.test(content);
}

function safePreview(content: string): string {
  return content.slice(0, 100);
}

function diagnosticsForPath(candidatePath: string) {
  const absolutePath = path.resolve(candidatePath);
  const exists = fs.existsSync(absolutePath);
  const record: {
    absolutePath: string;
    exists: boolean;
    fileSizeBytes: number | null;
    preview: string | null;
    isGitLfsPointer: boolean | null;
    jsonParseSuccess: boolean | null;
    error?: string;
  } = {
    absolutePath,
    exists,
    fileSizeBytes: null,
    preview: null,
    isGitLfsPointer: null,
    jsonParseSuccess: null,
  };

  if (!exists) {
    return record;
  }

  try {
    const stats = fs.statSync(absolutePath);
    record.fileSizeBytes = stats.size;

    const content = fs.readFileSync(absolutePath, 'utf-8');
    record.preview = safePreview(content);
    record.isGitLfsPointer = isGitLfsPointer(content);

    try {
      JSON.parse(content);
      record.jsonParseSuccess = true;
    } catch (parseError: any) {
      record.jsonParseSuccess = false;
      record.error = parseError?.message || String(parseError);
    }
  } catch (error: any) {
    record.error = error?.message || String(error);
  }

  return record;
}

export async function GET(request: NextRequest) {
  const diagnostics: Record<string, any> = {
    cwd: process.cwd(),
    candidates: scheduleCandidates.map(diagnosticsForPath),
    cacheStatus: null,
    cacheInitialized: false,
    stationsLoaded: null,
    trainsLoaded: null,
    stopRecordsLoaded: null,
    postgresReachable: false,
    postgresStationCount: null,
    oldDelhiInPostgres: false,
    oldDelhiInCache: false,
    errors: [] as Array<{ message: string; stack?: string }> ,
  };

  try {
    await trainCache.initialize();
    const status = trainCache.getStatus();
    diagnostics.cacheStatus = status;
    diagnostics.cacheInitialized = status.isLoaded === true;
    diagnostics.stationsLoaded = status.stationCount;
    diagnostics.trainsLoaded = status.trainCount;
    diagnostics.stopRecordsLoaded = status.trainStopsCount;
    diagnostics.oldDelhiInCache = Boolean(trainCache.getStation('OLD DELHI'));
  } catch (error: any) {
    diagnostics.errors.push({ message: 'Cache initialization failed', stack: error?.stack || String(error) });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    diagnostics.postgresReachable = true;
    diagnostics.postgresStationCount = await prisma.station.count();

    const oldDelhi = await prisma.station.findFirst({
      where: {
        OR: [
          { code: 'OLD DELHI' },
          { name: 'OLD DELHI' },
          { name: { contains: 'OLD DELHI', mode: 'insensitive' } },
        ],
      },
    });
    diagnostics.oldDelhiInPostgres = Boolean(oldDelhi);
  } catch (error: any) {
    diagnostics.errors.push({ message: 'PostgreSQL diagnostics failed', stack: error?.stack || String(error) });
  }

  logger.info('Train runtime diagnostics requested', {
    cwd: diagnostics.cwd,
    datasetCandidates: diagnostics.candidates.map((candidate: any) => ({ absolutePath: candidate.absolutePath, exists: candidate.exists, fileSizeBytes: candidate.fileSizeBytes })),
    cacheInitialized: diagnostics.cacheInitialized,
    stationsLoaded: diagnostics.stationsLoaded,
    trainsLoaded: diagnostics.trainsLoaded,
    postgresReachable: diagnostics.postgresReachable,
  });

  return NextResponse.json(diagnostics);
}
