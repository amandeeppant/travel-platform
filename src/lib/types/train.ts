/**
 * Train Search Engine - Type Definitions
 * Production-grade types for train scheduling system
 */

// ============================================
// API DTOs
// ============================================

export interface TrainSearchRequest {
  from: string; // Station name or code
  to: string; // Station name or code
  departureDate: string; // YYYY-MM-DD format
}

export interface TrainStopInfo {
  stationCode: string;
  stationName: string;
  arrival: string | null;
  departure: string | null;
  stopSequence: number;
  day: number;
}

export interface TrainSearchResult {
  trainNumber: string;
  trainName: string;
  boardingStation: string;
  boardingStationCode: string;
  destinationStation: string;
  destinationStationCode: string;
  departureTime: string;
  arrivalTime: string;
  journeyDuration: string;
  totalStopsBetween: number;
  sourceStation: string;
  sourceStationCode: string;
  destinationStationSelected: string;
  departureTimeFromBoardingStation: string;
  arrivalTimeAtDestinationStation: string;
  day: number;
}

export interface TrainSearchResponse {
  success: boolean;
  data?: TrainSearchResult[];
  error?: string;
  meta?: {
    totalResults: number;
    timestamp: string;
  };
}

// ============================================
// Database Models
// ============================================

export interface StationRecord {
  code: string;
  name: string;
}

export interface TrainRecord {
  trainNumber: string;
  trainName: string;
  sourceStationCode: string;
  destinationStationCode: string;
  totalStops: number;
}

export interface TrainStopRecord {
  trainNumber: string;
  stationCode: string;
  stopSequence: number;
  arrival: string | null;
  departure: string | null;
  day: number;
}

// ============================================
// Import Pipeline
// ============================================

export interface RawScheduleRecord {
  id: number;
  train_number: string;
  train_name: string;
  station_code: string;
  station_name: string;
  arrival: string;
  departure: string;
  day: number;
}

export interface GroupedTrainData {
  trainNumber: string;
  trainName: string;
  stops: RawScheduleRecord[];
}

export interface ImportStats {
  totalRecords: number;
  uniqueStations: number;
  uniqueTrains: number;
  totalStops: number;
  duration: number;
  success: boolean;
  error?: string;
}

// ============================================
// Time Utilities
// ============================================

export interface TimeRange {
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
  minutes: number;
}
