/**
 * Train Import Pipeline
 * Imports railway schedule data from JSON file into database
 * Handles grouping, sorting, and deduplication
 */

import * as fs from 'fs';
import * as path from 'path';
import { prisma } from './prisma';
import { logger } from './logger';
import { RawScheduleRecord, ProcessedTrain, ProcessedStop, ImportStatistics } from '@/types/train';
import { ImportError } from './trainErrors';

class TrainImportService {
  /**
   * Execute the complete import pipeline
   */
  async importTrainSchedules(): Promise<ImportStatistics> {
    const startTime = Date.now();
    const stats: ImportStatistics = {
      totalRecordsRead: 0,
      uniqueTrains: 0,
      uniqueStations: 0,
      trainsInserted: 0,
      stationsInserted: 0,
      stopsInserted: 0,
      duration: 0,
      success: false,
    };

    try {
      logger.info('Starting train schedule import...');

      // Read and process raw data
      const records = await this._readScheduleFile();
      stats.totalRecordsRead = records.length;
      logger.info(`Read ${records.length} raw records`);

      // Process records (group, sort, deduplicate)
      const processedTrains = this._processRecords(records);
      stats.uniqueTrains = processedTrains.size;
      logger.info(`Processed into ${processedTrains.size} unique trains`);

      // Count unique stations
      const stationSet = new Set<string>();
      for (const train of processedTrains.values()) {
        for (const stop of train.stops) {
          stationSet.add(stop.stationCode);
        }
      }
      stats.uniqueStations = stationSet.size;
      logger.info(`Found ${stationSet.size} unique stations`);

      // Insert into database with transactions
      try {
        await prisma.$transaction(async (tx) => {
          // Clear existing data
          logger.info('Clearing existing train data...');
          await tx.trainStop.deleteMany({});
          await tx.train.deleteMany({});
          await tx.station.deleteMany({});

          // Insert stations
          logger.info('Inserting stations...');
          const stationMap = new Map<string, { code: string; name: string }>();
          for (const train of processedTrains.values()) {
            for (const stop of train.stops) {
              if (!stationMap.has(stop.stationCode)) {
                stationMap.set(stop.stationCode, {
                  code: stop.stationCode,
                  name: stop.stationName,
                });
              }
            }
          }

          for (const stationData of stationMap.values()) {
            await tx.station.upsert({
              where: { code: stationData.code },
              create: { code: stationData.code, name: stationData.name },
              update: { name: stationData.name },
            });
          }
          stats.stationsInserted = stationMap.size;
          logger.info(`Inserted ${stationMap.size} stations`);

          // Insert trains and stops
          logger.info('Inserting trains and stops...');
          let trainInsertCount = 0;
          let stopInsertCount = 0;

          for (const [trainNumber, train] of processedTrains.entries()) {
            // Insert train
            await tx.train.upsert({
              where: { trainNumber },
              create: {
                trainNumber,
                trainName: train.trainName,
                sourceStationCode: train.sourceStationCode,
                destinationStationCode: train.destinationStationCode,
                totalStops: train.totalStops,
              },
              update: {
                trainName: train.trainName,
                sourceStationCode: train.sourceStationCode,
                destinationStationCode: train.destinationStationCode,
                totalStops: train.totalStops,
              },
            });
            trainInsertCount++;

            // Insert stops
            for (const stop of train.stops) {
              await tx.trainStop.upsert({
                where: {
                  trainNumber_stopSequence: {
                    trainNumber,
                    stopSequence: stop.stopSequence,
                  },
                },
                create: {
                  trainNumber,
                  stationCode: stop.stationCode,
                  stopSequence: stop.stopSequence,
                  arrival: stop.arrival === 'None' ? null : stop.arrival,
                  departure: stop.departure === 'None' ? null : stop.departure,
                  day: stop.day,
                },
                update: {
                  arrival: stop.arrival === 'None' ? null : stop.arrival,
                  departure: stop.departure === 'None' ? null : stop.departure,
                  day: stop.day,
                },
              });
              stopInsertCount++;
            }

            // Progress logging
            if (trainInsertCount % 100 === 0) {
              logger.info(`Inserted ${trainInsertCount} trains and ${stopInsertCount} stops...`);
            }
          }

          stats.trainsInserted = trainInsertCount;
          stats.stopsInserted = stopInsertCount;
        });

        const duration = Date.now() - startTime;
        stats.duration = duration;
        stats.success = true;

        logger.info('Import completed successfully', {
          trains: stats.trainsInserted,
          stations: stats.stationsInserted,
          stops: stats.stopsInserted,
          duration: `${duration}ms`,
        });

        return stats;
      } catch (dbError) {
        throw new ImportError('Database transaction failed', dbError);
      }
    } catch (error) {
      stats.duration = Date.now() - startTime;
      stats.success = false;
      stats.error = error instanceof Error ? error.message : 'Unknown error';

      logger.error('Import failed', { error, stats });
      throw error;
    }
  }

  /**
   * Read schedule JSON file
   */
  private async _readScheduleFile(): Promise<RawScheduleRecord[]> {
    try {
      const scheduleFilePath = path.join(process.cwd(), 'schedules_pretty.json');

      if (!fs.existsSync(scheduleFilePath)) {
        throw new ImportError(`Schedule file not found at ${scheduleFilePath}`);
      }

      const fileContent = fs.readFileSync(scheduleFilePath, 'utf-8');
      const records: RawScheduleRecord[] = fileContent
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line));

      return records;
    } catch (error) {
      if (error instanceof ImportError) throw error;
      throw new ImportError('Failed to read schedule file', error);
    }
  }

  /**
   * Process raw records into normalized trains
   * Groups by train_number, sorts by id, assigns stop_sequence
   */
  private _processRecords(records: RawScheduleRecord[]): Map<string, ProcessedTrain> {
    // Group by train_number
    const trainMap = new Map<string, RawScheduleRecord[]>();

    for (const record of records) {
      if (!trainMap.has(record.train_number)) {
        trainMap.set(record.train_number, []);
      }
      trainMap.get(record.train_number)!.push(record);
    }

    const processedTrains = new Map<string, ProcessedTrain>();

    // Process each train
    for (const [trainNumber, stops] of trainMap.entries()) {
      // CRITICAL: Sort by id to get correct sequence
      stops.sort((a, b) => a.id - b.id);

      if (stops.length === 0) continue;

      // Build processed stops with stop_sequence
      const processedStops: ProcessedStop[] = stops.map((stop, index) => ({
        stationCode: stop.station_code,
        stationName: stop.station_name,
        stopSequence: index + 1, // Generated sequence
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
   * Get import statistics
   */
  async getStats() {
    try {
      const [stationCount, trainCount, stopCount] = await Promise.all([
        prisma.station.count(),
        prisma.train.count(),
        prisma.trainStop.count(),
      ]);

      return {
        stations: stationCount,
        trains: trainCount,
        stops: stopCount,
      };
    } catch (error) {
      logger.error('Failed to get import stats', { error });
      return null;
    }
  }
}

export const trainImportService = new TrainImportService();
