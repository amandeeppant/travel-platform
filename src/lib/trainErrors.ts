/**
 * Train Search Error Handling
 * Centralized error definitions and handlers
 */

export class TrainSearchError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'TrainSearchError';
  }
}

export class ValidationError extends TrainSearchError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class InvalidSearchError extends TrainSearchError {
  constructor(message: string, details?: any) {
    super('INVALID_SEARCH', message, 400, details);
    this.name = 'InvalidSearchError';
  }
}

export class StationNotFoundError extends TrainSearchError {
  constructor(station: string) {
    super('STATION_NOT_FOUND', `Station not found: ${station}`, 404, { station });
    this.name = 'StationNotFoundError';
  }
}

export class NoTrainsFoundError extends TrainSearchError {
  constructor(from: string, to: string) {
    super(
      'NO_TRAINS_FOUND',
      `No trains found from ${from} to ${to}`,
      404,
      { from, to }
    );
    this.name = 'NoTrainsFoundError';
  }
}

export class DatabaseError extends TrainSearchError {
  constructor(message: string, details?: any) {
    super('DATABASE_ERROR', message, 500, details);
    this.name = 'DatabaseError';
  }
}

export class TrainNotFoundError extends TrainSearchError {
  constructor(trainNumber: string) {
    super('TRAIN_NOT_FOUND', `Train not found: ${trainNumber}`, 404, { trainNumber });
    this.name = 'TrainNotFoundError';
  }
}

export class ImportError extends TrainSearchError {
  constructor(message: string, details?: any) {
    super('IMPORT_ERROR', message, 500, details);
    this.name = 'ImportError';
  }
}

export class InvalidDateError extends TrainSearchError {
  constructor(date: string) {
    super('INVALID_DATE', `Invalid date format: ${date}. Expected YYYY-MM-DD`, 400, { date });
    this.name = 'InvalidDateError';
  }
}

export function handleTrainError(error: unknown): { code: string; message: string; statusCode: number; details?: unknown } {
  if (error instanceof TrainSearchError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'INTERNAL_ERROR',
      message: error.message,
      statusCode: 500,
    };
  }

  return {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500,
  };
}

/**
 * Error response formatter
 */
export function formatErrorResponse(error: any) {
  if (error instanceof TrainSearchError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.details,
      statusCode: error.statusCode,
    };
  }

  return {
    success: false,
    error: error?.message || 'An unexpected error occurred',
  };
}
