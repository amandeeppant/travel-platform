import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Lightweight local train route API
 * Reads schedules_pretty.json directly and returns route data for a train number.
 * This avoids DB/prisma imports and serves as a reliable fallback in dev.
 */
export async function GET(
  request: Request,
  { params }: { params: { trainNumber: string } }
) {
  try {
    const { trainNumber } = params;

    if (!trainNumber) {
      return NextResponse.json({ success: false, error: { message: 'Train number required' } }, { status: 400 });
    }

    const candidates = [
      path.join(process.cwd(), 'schedules_pretty.json'),
      path.join(process.cwd(), '..', 'schedules_pretty.json'),
    ];

    const scheduleFilePath = candidates.find((p) => fs.existsSync(p));
    if (!scheduleFilePath) {
      return NextResponse.json({ success: false, error: { message: 'schedules_pretty.json not found' } }, { status: 500 });
    }

    const fileContent = fs.readFileSync(scheduleFilePath, 'utf-8');
    const records = JSON.parse(fileContent);

    // Filter records for the train and sort by id
    const stops = records
      .filter((r: any) => String(r.train_number) === String(trainNumber))
      .sort((a: any, b: any) => a.id - b.id)
      .map((s: any, idx: number) => ({
        stopSequence: idx + 1,
        stationCode: s.station_code,
        stationName: s.station_name,
        arrival: s.arrival || null,
        departure: s.departure || null,
        day: s.day,
      }));

    if (stops.length === 0) {
      return NextResponse.json({ success: false, error: { message: 'Train not found in local data' } }, { status: 404 });
    }

    const first = stops[0];
    const last = stops[stops.length - 1];

    const data = {
      trainNumber,
      trainName: records.find((r: any) => String(r.train_number) === String(trainNumber))?.train_name || '',
      sourceStation: first.stationName,
      destinationStation: last.stationName,
      totalStops: stops.length,
      stops,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: { message: 'Failed to read local schedules', details: String(error) } }, { status: 500 });
  }
}
