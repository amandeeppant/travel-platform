/**
 * Train Utilities - Time and Duration Calculations
 * Production-grade utility functions for train schedules
 */

import { TimeRange } from './types/train';

/**
 * Convert time string to minutes since midnight
 * @param timeStr HH:MM:SS or "None"
 * @returns minutes or null
 */
export function timeToMinutes(timeStr: string | null): number | null {
  if (!timeStr || timeStr === 'None' || timeStr === 'null') {
    return null;
  }

  try {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return hours * 60 + minutes;
  } catch {
    return null;
  }
}

/**
 * Convert minutes to HH:MM format
 * @param minutes total minutes since midnight
 * @returns HH:MM formatted string
 */
export function minutesToTimeFormat(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Calculate duration between two times on potentially different days
 * @param startTimeStr start time HH:MM:SS
 * @param endTimeStr end time HH:MM:SS
 * @param startDay day number for start
 * @param endDay day number for end
 * @returns TimeRange with duration in minutes
 */
export function calculateDuration(
  startTimeStr: string | null,
  endTimeStr: string | null,
  startDay: number = 1,
  endDay: number = 1
): TimeRange | null {
  const startMinutes = timeToMinutes(startTimeStr);
  const endMinutes = timeToMinutes(endTimeStr);

  if (startMinutes === null || endMinutes === null) {
    return null;
  }

  const startTotal = (startDay - 1) * 1440 + startMinutes; // 1440 minutes per day
  const endTotal = (endDay - 1) * 1440 + endMinutes;

  const durationMinutes = endTotal - startTotal;

  if (durationMinutes < 0) {
    return null;
  }

  return {
    startTime: startTimeStr!,
    endTime: endTimeStr!,
    minutes: durationMinutes,
  };
}

/**
 * Format duration in minutes to readable string
 * @param minutes duration in minutes
 * @returns formatted string like "2h 30m"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 0) return '0m';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Check if a time value is valid
 * @param timeStr HH:MM:SS or "None"
 * @returns true if valid time
 */
export function isValidTime(timeStr: string | null): boolean {
  if (!timeStr || timeStr === 'None' || timeStr === 'null') {
    return false;
  }

  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  return regex.test(timeStr);
}

/**
 * Normalize time string to HH:MM:SS format
 * @param timeStr input time
 * @returns normalized HH:MM:SS or null
 */
export function normalizeTime(timeStr: string | null): string | null {
  if (!timeStr || timeStr === 'None' || timeStr === 'null') {
    return null;
  }

  try {
    const parts = timeStr.split(':');
    if (parts.length < 2) return null;

    const hours = String(Number(parts[0])).padStart(2, '0');
    const minutes = String(Number(parts[1])).padStart(2, '0');
    const seconds = parts[2] ? String(Number(parts[2])).padStart(2, '0') : '00';

    return `${hours}:${minutes}:${seconds}`;
  } catch {
    return null;
  }
}
