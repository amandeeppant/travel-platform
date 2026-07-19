/**
 * Train Search Module - Type Definitions
 */

// ============================================
// Raw Data Types (from schedules_pretty.json)
// ============================================

export interface RawScheduleRecord {
  arrival: string;
  day: number;
  train_name: string;
  station_name: string;
  station_code: string;
  id: number;
  train_number: string;
  departure: string;
}

// ============================================
// Database Models
// ============================================

export interface Station {
  code: string;
  name: string;
  createdAt: Date;
}

export interface Train {
  trainNumber: string;
  trainName: string;
  sourceStationCode: string;
  destinationStationCode: string;
  totalStops: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainStop {
  id: string;
  trainNumber: string;
  stationCode: string;
  stopSequence: number;
  arrival: string | null;
  departure: string | null;
  day: number;
  createdAt: Date;
}

// ============================================
// Search Request/Response DTOs
// ============================================

export interface SearchTrainRequest {
  from: string; // Station name or code
  to: string; // Station name or code
  departureDate: string; // YYYY-MM-DD
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
  day: number;
  boardingStopSequence: number;
  destinationStopSequence: number;
}

export interface ViewRouteResponse {
  trainNumber: string;
  trainName: string;
  sourceStation: string;
  destinationStation: string;
  totalStops: number;
  stops: StopDetail[];
}

export interface StopDetail {
  stopSequence: number;
  stationName: string;
  stationCode: string;
  arrival: string;
  departure: string;
  day: number;
}

// ============================================
// Import Pipeline Types
// ============================================

export interface ProcessedTrain {
  trainNumber: string;
  trainName: string;
  sourceStationCode: string;
  sourceStationName: string;
  destinationStationCode: string;
  destinationStationName: string;
  totalStops: number;
  stops: ProcessedStop[];
}

export interface ProcessedStop {
  stationCode: string;
  stationName: string;
  stopSequence: number;
  arrival: string;
  departure: string;
  day: number;
}

export interface ImportStatistics {
  totalRecordsRead: number;
  uniqueTrains: number;
  uniqueStations: number;
  trainsInserted: number;
  stationsInserted: number;
  stopsInserted: number;
  duration: number; // milliseconds
  success: boolean;
  error?: string;
}

// ============================================
// In-Memory Cache Types
// ============================================

export interface CachedData {
  stations: Map<string, Station>;
  trains: Map<string, Train>;
  trainStops: Map<string, TrainStop[]>;
  stationsByName: Map<string, Station>;
  lastLoadTime: Date | null;
  isLoaded: boolean;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiListResponse<T> {
  success: boolean;
  data?: T[];
  total?: number;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
