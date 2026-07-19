/**
 * Train Repository Layer
 * Handles data access with dual support: Database and In-Memory Cache
 */

import { prisma } from './prisma';
import { trainCache } from './trainCache';
import { Station, Train, TrainStop } from '@/types/train';
import { logger } from './logger';
import { DatabaseError } from './trainErrors';

interface DatabaseConfig {
  useDatabase: boolean;
  fallbackToCache: boolean;
}

class TrainRepository {
  private dbConfig: DatabaseConfig = {
    useDatabase: true,
    fallbackToCache: true,
  };

  /**
   * Initialize repository and check database connectivity
   */
  async initialize(): Promise<void> {
    if (!this.dbConfig.useDatabase) {
      await trainCache.initialize();
      return;
    }

    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
      logger.info('Database connected successfully');
      this.dbConfig.useDatabase = true;
    } catch (error) {
      logger.warn('Database connection failed, falling back to cache', { error });
      this.dbConfig.useDatabase = false;
      await trainCache.initialize();
    }
  }

  /**
   * Find station by code or name
   */
  async findStation(codeOrName: string): Promise<Station | null> {
    if (!this.dbConfig.useDatabase) {
      return trainCache.getStation(codeOrName);
    }

    try {
      // Try code first
      // Exact code match (case-sensitive first)
      let station = await prisma.station.findUnique({
        where: { code: codeOrName },
      });

      if (station) return station;

      // Exact name match
      station = await prisma.station.findUnique({
        where: { name: codeOrName },
      });

      if (station) return station;

      // Try case-insensitive or partial matches using findFirst
      station = await prisma.station.findFirst({
        where: {
          OR: [
            { code: { equals: codeOrName, mode: 'insensitive' } },
            { name: { equals: codeOrName, mode: 'insensitive' } },
            { name: { contains: codeOrName, mode: 'insensitive' } },
          ],
        },
      });

      return station;
    } catch (error) {
      logger.warn('Database query failed, falling back to cache', { error });
      this.dbConfig.useDatabase = false;
      await trainCache.initialize();
      return trainCache.getStation(codeOrName);
    }
  }

  /**
   * Find stations by partial match
   */
  async findStations(query: string): Promise<Station[]> {
    if (!this.dbConfig.useDatabase) {
      return trainCache.findStations(query);
    }

    try {
      const stations = await prisma.station.findMany({
        where: {
          OR: [
            { code: { contains: query, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      });

      return stations;
    } catch (error) {
      logger.warn('Database query failed, falling back to cache', { error });
      this.dbConfig.useDatabase = false;
      await trainCache.initialize();
      return trainCache.findStations(query);
    }
  }

  /**
   * Get trains between two stations
   */
  async getTrainsBetween(
    fromStationCode: string,
    toStationCode: string
  ): Promise<TrainStop[]> {
    if (!this.dbConfig.useDatabase) {
      const cachedStops = trainCache.getTrainsBetweenStations(fromStationCode, toStationCode);
      return cachedStops.flat();
    }

    try {
      // Find all trains that have both stations
      const stopsWithBothStations = await prisma.trainStop.findMany({
        where: {
          stationCode: fromStationCode,
        },
        include: {
          train: {
            include: {
              trainStops: {
                orderBy: { stopSequence: 'asc' },
              },
            },
          },
        },
      });

      // Filter to only include stops where both stations exist in the train and from comes before to
      const result: TrainStop[] = [];
      for (const stop of stopsWithBothStations) {
        const train = stop.train;
        if (!train) continue;

        const fromStopInTrain = train.trainStops?.find((s) => s.stationCode === fromStationCode);
        const toStopInTrain = train.trainStops?.find((s) => s.stationCode === toStationCode);

        if (fromStopInTrain && toStopInTrain && fromStopInTrain.stopSequence < toStopInTrain.stopSequence) {
          result.push(stop);
        }
      }

      return result;
    } catch (error) {
      logger.warn('Database query failed, falling back to cache', { error });
      this.dbConfig.useDatabase = false;
      await trainCache.initialize();
      const cachedStops = trainCache.getTrainsBetweenStations(fromStationCode, toStationCode);
      return cachedStops.flat();
    }
  }

  /**
   * Get all stops for a train
   */
  async getTrainStops(trainNumber: string): Promise<TrainStop[]> {
    if (!this.dbConfig.useDatabase) {
      const stops = trainCache.getTrainStops(trainNumber);
      return stops || [];
    }

    try {
      const stops = await prisma.trainStop.findMany({
        where: { trainNumber },
        orderBy: { stopSequence: 'asc' },
      });

      return stops;
    } catch (error) {
      logger.warn('Database query failed, falling back to cache', { error });
      this.dbConfig.useDatabase = false;
      await trainCache.initialize();
      const stops = trainCache.getTrainStops(trainNumber);
      return stops || [];
    }
  }

  /**
   * Get train details
   */
  async getTrain(trainNumber: string): Promise<Train | null> {
    if (!this.dbConfig.useDatabase) {
      return trainCache.getTrain(trainNumber);
    }

    try {
      const train = await prisma.train.findUnique({
        where: { trainNumber },
      });

      return train;
    } catch (error) {
      logger.warn('Database query failed, falling back to cache', { error });
      this.dbConfig.useDatabase = false;
      await trainCache.initialize();
      return trainCache.getTrain(trainNumber);
    }
  }

  /**
   * Get data source status
   */
  async getStatus() {
    const source = this.dbConfig.useDatabase ? 'PostgreSQL' : 'In-Memory Cache';
    const cacheStatus = trainCache.getStatus();

    if (this.dbConfig.useDatabase) {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return {
          source,
          database: 'Connected',
          cache: cacheStatus,
        };
      } catch (error) {
        return {
          source,
          database: 'Failed',
          cache: cacheStatus,
        };
      }
    }

    return {
      source,
      cache: cacheStatus,
    };
  }
}

export const trainRepository = new TrainRepository();
