/**
 * In-Memory Cache Service for Train Data
 * Fallback when PostgreSQL is unavailable
 * Loads data from JSON file on first use
 */

import { RawScheduleRecord, Station, Train, TrainStop, CachedData, ProcessedTrain, ProcessedStop } from '@/types/train';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';

class TrainCacheService {
  private cache: CachedData = {
    stations: new Map(),
    trains: new Map(),
    trainStops: new Map(),
    stationsByName: new Map(),
    lastLoadTime: null,
    isLoaded: false,
  };

  private loadingPromise: Promise<void> | null = null;
  private datasetPathUsed: string | null = null;
  private datasetFileSize: number | null = null;
  private parseDurationMs: number | null = null;
  private recordsLoaded: number | null = null;

  /**
   * Initialize cache from JSON file
   */
  async initialize(): Promise<void> {
    // Prevent multiple concurrent loads
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    if (this.cache.isLoaded) {
      return;
    }

    this.loadingPromise = this._loadFromJson();
    await this.loadingPromise;
    this.loadingPromise = null;
  }

  private async _loadFromJson(): Promise<void> {
    try {
      // Try current working directory then parent directory for schedules_pretty.json
      const candidates = [
        path.join(process.cwd(), 'schedules_pretty.json'),
        path.join(process.cwd(), '..', 'schedules_pretty.json'),
      ];

      const scheduleFilePath = candidates.find((p) => fs.existsSync(p));

      if (!scheduleFilePath) {
        logger.warn(`Schedule file not found in ${candidates.join(', ')}, cache will be empty`);
        this.cache.isLoaded = true;
        return;
      }

      logger.info(`Loading train schedules from JSON (${scheduleFilePath})...`);
      logger.info('Schedule file resolved', { path: scheduleFilePath, exists: fs.existsSync(scheduleFilePath) });
      const startTime = Date.now();

      // Read file and parse as JSON array
      const fileContent = fs.readFileSync(scheduleFilePath, 'utf-8');
      const records: RawScheduleRecord[] = JSON.parse(fileContent);

      logger.info(`Read ${records.length} raw schedule records`);

      // Process records
      const processedTrains = this._processRecords(records);
      this._populateCache(processedTrains);

      const duration = Date.now() - startTime;
      this.parseDurationMs = duration;
      this.recordsLoaded = records.length;
      this.datasetPathUsed = scheduleFilePath;
      this.datasetFileSize = fs.statSync(scheduleFilePath).size;

      // Debug: log station count and sample
      try {
        const stationCount = this.cache.stations.size;
        const sample = Array.from(this.cache.stations.values()).slice(0, 5).map((s) => s.name);
        logger.info('Cache loaded successfully', {
          datasetPath: scheduleFilePath,
          datasetSizeBytes: this.datasetFileSize,
          parseDurationMs: duration,
          recordsLoaded: records.length,
          stationCount,
          trainCount: this.cache.trains.size,
          sample,
        });
      } catch (e) {
        logger.warn('Failed to produce cache debug info', { error: e });
      }

      this.cache.lastLoadTime = new Date();
      this.cache.isLoaded = true;
    } catch (error) {
      logger.error('Failed to load train schedules from JSON', { error });
      this.cache.isLoaded = true; // Mark as loaded to prevent retry loop
    }
  }

  /**
   * Process raw records into normalized trains and stops
   */
  private _processRecords(records: RawScheduleRecord[]): Map<string, ProcessedTrain> {
    const trainMap = new Map<string, RawScheduleRecord[]>();

    // Group by train_number
    for (const record of records) {
      if (!trainMap.has(record.train_number)) {
        trainMap.set(record.train_number, []);
      }
      trainMap.get(record.train_number)!.push(record);
    }

    const processedTrains = new Map<string, ProcessedTrain>();

    // Process each train
    for (const [trainNumber, stops] of trainMap.entries()) {
      // Sort by id to get correct sequence
      stops.sort((a, b) => a.id - b.id);

      if (stops.length === 0) continue;

      const processedStops: ProcessedStop[] = stops.map((stop, index) => ({
        stationCode: stop.station_code,
        stationName: stop.station_name,
        stopSequence: index + 1,
        arrival: stop.arrival || 'None',
        departure: stop.departure || 'None',
        day: stop.day,
      }));

      const firstStop = stops[0];
      const lastStop = stops[stops.length - 1];

      const processed: ProcessedTrain = {
        trainNumber,
        trainName: firstStop.train_name,
        sourceStationCode: firstStop.station_code,
        sourceStationName: firstStop.station_name,
        destinationStationCode: lastStop.station_code,
        destinationStationName: lastStop.station_name,
        totalStops: stops.length,
        stops: processedStops,
      };

      processedTrains.set(trainNumber, processed);
    }

    return processedTrains;
  }

  /**
   * Populate cache from processed trains
   */
  private _populateCache(processedTrains: Map<string, ProcessedTrain>): void {
    const stationSet = new Set<string>();

    // Add all stations and trains to cache
    for (const [trainNumber, train] of processedTrains.entries()) {
      // Add train
      const trainRecord: Train = {
        trainNumber,
        trainName: train.trainName,
        sourceStationCode: train.sourceStationCode,
        destinationStationCode: train.destinationStationCode,
        totalStops: train.totalStops,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.cache.trains.set(trainNumber, trainRecord);

      // Add stations
      for (const stop of train.stops) {
        stationSet.add(stop.stationCode);
      }

      // Add train stops
      const trainStopsArray: TrainStop[] = train.stops.map((stop) => ({
        id: `${trainNumber}-${stop.stopSequence}`,
        trainNumber,
        stationCode: stop.stationCode,
        stopSequence: stop.stopSequence,
        arrival: stop.arrival === 'None' ? null : stop.arrival,
        departure: stop.departure === 'None' ? null : stop.departure,
        day: stop.day,
        createdAt: new Date(),
      }));

      this.cache.trainStops.set(trainNumber, trainStopsArray);
    }

    // Create unique stations
    const stationMap = new Map<string, { name: string; code: string }>();

    for (const [trainNumber, train] of processedTrains.entries()) {
      for (const stop of train.stops) {
        if (!stationMap.has(stop.stationCode)) {
          stationMap.set(stop.stationCode, {
            code: stop.stationCode,
            name: stop.stationName,
          });
        }
      }
    }

    for (const [code, stationInfo] of stationMap.entries()) {
      const station: Station = {
        code,
        name: stationInfo.name,
        createdAt: new Date(),
      };
      this.cache.stations.set(code, station);
      this.cache.stationsByName.set(stationInfo.name.toLowerCase(), station);
    }
  }

  /**
   * Find station by code or name
   */
  getStation(codeOrName: string): Station | null {
    // Try exact code match first
    let station = this.cache.stations.get(codeOrName);
    if (station) return station;

    // Try case-insensitive name match
    station = this.cache.stationsByName.get(codeOrName.toLowerCase());
    if (station) return station;

    // Try partial name match
    for (const [_, s] of this.cache.stationsByName) {
      if (s.name.toLowerCase().includes(codeOrName.toLowerCase())) {
        return s;
      }
    }

    return null;
  }

  /**
   * Find all stations containing code or name
   */
  findStations(query: string): Station[] {
    const queryLower = query.toLowerCase();
    const results: Station[] = [];
    const seen = new Set<string>();

    for (const [_, station] of this.cache.stations) {
      if (!seen.has(station.code)) {
        if (
          station.code.toLowerCase().includes(queryLower) ||
          station.name.toLowerCase().includes(queryLower)
        ) {
          results.push(station);
          seen.add(station.code);
        }
      }
    }

    return results;
  }

  /**
   * Get all trains between two stations
   */
  getTrainsBetweenStations(fromCode: string, toCode: string): TrainStop[][] {
    const results: TrainStop[][] = [];

    for (const [trainNumber, stops] of this.cache.trainStops) {
      // Find indices of both stations
      const fromIndex = stops.findIndex((s) => s.stationCode === fromCode);
      const toIndex = stops.findIndex((s) => s.stationCode === toCode);

      // Both stations must exist and from must come before to
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        results.push(stops);
      }
    }

    return results;
  }

  /**
   * Get train stops for a specific train
   */
  getTrainStops(trainNumber: string): TrainStop[] | null {
    return this.cache.trainStops.get(trainNumber) || null;
  }

  /**
   * Get train details
   */
  getTrain(trainNumber: string): Train | null {
    return this.cache.trains.get(trainNumber) || null;
  }

  /**
   * Get cache status
   */
  getStatus() {
    return {
      isLoaded: this.cache.isLoaded,
      lastLoadTime: this.cache.lastLoadTime,
      stationCount: this.cache.stations.size,
      trainCount: this.cache.trains.size,
      trainStopsCount: Array.from(this.cache.trainStops.values()).reduce((sum, stops) => sum + stops.length, 0),
      datasetPathUsed: this.datasetPathUsed,
      datasetFileSize: this.datasetFileSize,
      parseDurationMs: this.parseDurationMs,
      recordsLoaded: this.recordsLoaded,
    };
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.stations.clear();
    this.cache.trains.clear();
    this.cache.trainStops.clear();
    this.cache.stationsByName.clear();
    this.cache.isLoaded = false;
    this.cache.lastLoadTime = null;
  }
}

// Export singleton instance
export const trainCache = new TrainCacheService();
