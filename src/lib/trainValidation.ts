/**
 * Train Search Validation
 * Input validation and data sanitization
 */

import { TrainSearchRequest } from './types/train';
import { ValidationError } from './trainErrors';

/**
 * Validate train search request
 */
export function validateTrainSearchRequest(data: any): TrainSearchRequest {
  if (!data) {
    throw new ValidationError('Request body is required');
  }

  const { from, to, departureDate } = data;

  // Validate from
  if (!from || typeof from !== 'string') {
    throw new ValidationError('From station is required and must be a string');
  }

  if (from.trim().length === 0) {
    throw new ValidationError('From station cannot be empty');
  }

  if (from.length > 100) {
    throw new ValidationError('From station is too long (max 100 characters)');
  }

  // Validate to
  if (!to || typeof to !== 'string') {
    throw new ValidationError('To station is required and must be a string');
  }

  if (to.trim().length === 0) {
    throw new ValidationError('To station cannot be empty');
  }

  if (to.length > 100) {
    throw new ValidationError('To station is too long (max 100 characters)');
  }

  // Check same station
  if (from.toLowerCase().trim() === to.toLowerCase().trim()) {
    throw new ValidationError('From and To stations cannot be the same');
  }

  // Validate departure date
  if (!departureDate || typeof departureDate !== 'string') {
    throw new ValidationError('Departure date is required and must be a string');
  }

  if (!isValidDate(departureDate)) {
    throw new ValidationError('Departure date must be in YYYY-MM-DD format');
  }

  // Check if date is not in the past
  const depDate = new Date(departureDate + 'T00:00:00Z');
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (depDate < today) {
    throw new ValidationError('Departure date cannot be in the past');
  }

  return {
    from: from.trim(),
    to: to.trim(),
    departureDate: departureDate.trim(),
  };
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    return false;
  }

  const date = new Date(dateStr + 'T00:00:00Z');
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Sanitize station name for database query
 */
export function sanitizeStationQuery(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s\-]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Validate train number format
 */
export function isValidTrainNumber(trainNumber: string): boolean {
  return /^[0-9]{1,6}$/.test(trainNumber);
}

/**
 * Validate station code format
 */
export function isValidStationCode(code: string): boolean {
  return /^[A-Z]{1,6}$/.test(code);
}

/**
 * Check if pagination parameters are valid
 */
export function validatePagination(limit?: number, offset?: number) {
  if (limit !== undefined) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be an integer between 1 and 100');
    }
  }

  if (offset !== undefined) {
    if (!Number.isInteger(offset) || offset < 0) {
      throw new ValidationError('Offset must be a non-negative integer');
    }
  }
}
