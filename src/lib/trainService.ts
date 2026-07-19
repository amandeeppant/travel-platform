/**
 * Train Service Layer
 * Core business logic for train operations
 */

import { trainRepository } from './trainRepository';
import { SearchTrainRequest, TrainSearchResult, ViewRouteResponse, StopDetail } from '@/types/train';
import { StationNotFoundError, NoTrainsFoundError, InvalidSearchError, InvalidDateError } from './trainErrors';
import { logger } from './logger';

class TrainService {
  /**
   * Initialize service and ensure data is ready
   */
  async initialize(): Promise<void> {
    await trainRepository.initialize();
  }

  /**
   * Search trains between two stations
   */
  async searchTrains(request: SearchTrainRequest): Promise<TrainSearchResult[]> {
    // Validate input
    if (!request.from || !request.to) {
      throw new InvalidSearchError('From and To stations are required');
    }

    if (!request.departureDate) {
      throw new InvalidSearchError('Departure date is required');
    }

    // Validate date format
    if (!this._isValidDate(request.departureDate)) {
      throw new InvalidDateError(request.departureDate);
    }

    logger.info('Searching trains', { from: request.from, to: request.to, date: request.departureDate });

    // Find source station
    const fromStation = await trainRepository.findStation(request.from);
    if (!fromStation) {
      throw new StationNotFoundError(request.from);
    }

    // Find destination station
    const toStation = await trainRepository.findStation(request.to);
    if (!toStation) {
      throw new StationNotFoundError(request.to);
    }

    // Verify different stations
    if (fromStation.code === toStation.code) {
      throw new InvalidSearchError('Source and destination stations must be different');
    }

    // Get trains between stations
    const trainStops = await trainRepository.getTrainsBetween(fromStation.code, toStation.code);

    if (trainStops.length === 0) {
      throw new NoTrainsFoundError(fromStation.name, toStation.name);
    }

    // Build search results
    const results: TrainSearchResult[] = [];
    const processedTrains = new Set<string>();

    for (const stop of trainStops) {
      const trainKey = `${stop.trainNumber}-${fromStation.code}-${toStation.code}`; 

      if (processedTrains.has(trainKey)) continue;
      processedTrains.add(trainKey);

      // Get all stops for this train
      const allStops = await trainRepository.getTrainStops(stop.trainNumber);
      const fromIndex = allStops.findIndex((s) => s.stationCode === fromStation.code);
      const toIndex = allStops.findIndex((s) => s.stationCode === toStation.code);

      if (fromIndex === -1 || toIndex === -1) continue;

      const fromStop = allStops[fromIndex];
      const toStop = allStops[toIndex];

      // Get train details
      const train = await trainRepository.getTrain(stop.trainNumber);
      if (!train) continue;

      // Calculate journey duration
      const duration = this._calculateDuration(
        fromStop.departure,
        toStop.arrival,
        fromStop.day,
        toStop.day
      );

      // Count stops between
      const stopsBetween = toIndex - fromIndex - 1;

      results.push({
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        boardingStation: fromStation.name,
        boardingStationCode: fromStation.code,
        destinationStation: toStation.name,
        destinationStationCode: toStation.code,
        departureTime: fromStop.departure || '--:--',
        arrivalTime: toStop.arrival || '--:--',
        journeyDuration: duration,
        totalStopsBetween: stopsBetween,
        day: fromStop.day,
        boardingStopSequence: fromStop.stopSequence,
        destinationStopSequence: toStop.stopSequence,
      });
    }

    logger.info(`Found ${results.length} trains`);
    return results;
  }

  /**
   * Get all stops for a train (for viewing detailed route)
   */
  async getTrainRoute(trainNumber: string): Promise<ViewRouteResponse> {
    // Get train details
    const train = await trainRepository.getTrain(trainNumber);
    if (!train) {
      throw new StationNotFoundError(trainNumber);
    }

    // Get all stops
    const stops = await trainRepository.getTrainStops(trainNumber);
    if (stops.length === 0) {
      throw new InvalidSearchError(`No stops found for train ${trainNumber}`);
    }

    // Build stop details
    const stopDetails: StopDetail[] = stops.map((stop) => ({
      stopSequence: stop.stopSequence,
      stationName: '', // Will be filled below
      stationCode: stop.stationCode,
      arrival: stop.arrival || '--:--',
      departure: stop.departure || '--:--',
      day: stop.day,
    }));

    // Get source and destination station names
    const sourceStation = await trainRepository.findStation(train.sourceStationCode);
    const destStation = await trainRepository.findStation(train.destinationStationCode);

    // Fill in station names
    for (const stopDetail of stopDetails) {
      if (stopDetail.stationCode === train.sourceStationCode) {
        stopDetail.stationName = sourceStation?.name || stopDetail.stationCode;
      } else if (stopDetail.stationCode === train.destinationStationCode) {
        stopDetail.stationName = destStation?.name || stopDetail.stationCode;
      } else {
        // Try to find station by code
        const station = await trainRepository.findStation(stopDetail.stationCode);
        stopDetail.stationName = station?.name || stopDetail.stationCode;
      }
    }

    return {
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      sourceStation: sourceStation?.name || train.sourceStationCode,
      destinationStation: destStation?.name || train.destinationStationCode,
      totalStops: train.totalStops,
      stops: stopDetails,
    };
  }

  /**
   * Search stations by partial match
   */
  async searchStations(query: string) {
    if (!query || query.length < 2) {
      throw new InvalidSearchError('Station query must be at least 2 characters');
    }

    const stations = await trainRepository.findStations(query);
    return stations.map((s) => ({
      code: s.code,
      name: s.name,
    }));
  }

  /**
   * Get service status
   */
  async getStatus() {
    return trainRepository.getStatus();
  }

  /**
   * Helper: Validate date format YYYY-MM-DD
   */
  private _isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Helper: Calculate journey duration in HH:MM format
   */
  private _calculateDuration(departure: string | null, arrival: string | null, dayFrom: number, dayTo: number): string {
    if (!departure || !arrival || departure === '--:--' || arrival === '--:--') {
      return '--:--';
    }

    try {
      const [depH, depM] = departure.split(':').map(Number);
      const [arrH, arrM] = arrival.split(':').map(Number);

      let totalMinutes = arrH * 60 + arrM - (depH * 60 + depM);

      // Add 24 hours for each day difference
      totalMinutes += (dayTo - dayFrom) * 24 * 60;

      if (totalMinutes < 0) {
        // Handle overnight journey
        totalMinutes += 24 * 60;
      }

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    } catch (error) {
      return '--:--';
    }
  }
}

export const trainService = new TrainService();
