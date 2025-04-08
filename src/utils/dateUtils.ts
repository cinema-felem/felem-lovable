
import { format } from "date-fns";

/**
 * Converts a date to start of day unix timestamp (in milliseconds)
 */
export function dateToStartOfDayUnix(date: Date): number {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay.getTime();
}

/**
 * Converts a date to end of day unix timestamp (in milliseconds)
 */
export function dateToEndOfDayUnix(date: Date): number {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.getTime();
}

/**
 * Gets unique dates from an array of unix timestamps (in milliseconds)
 */
export function getUniqueDatesFromUnixTimestamps(unixTimestamps: number[]): Date[] {
  // Convert unix timestamps to Date objects (just the date part)
  const dates = unixTimestamps.map(timestamp => {
    const date = new Date(timestamp);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });
  
  // Use a Set to get unique dates (by their time)
  const uniqueDatesSet = new Set(dates.map(date => date.getTime()));
  
  // Convert back to Date objects and sort
  return Array.from(uniqueDatesSet)
    .map(time => new Date(time))
    .sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Format a unix timestamp (in milliseconds) to a formatted time string
 */
export function formatUnixTime(unixTime: number, formatString: string = 'h:mm a'): string {
  return format(new Date(unixTime), formatString);
}
