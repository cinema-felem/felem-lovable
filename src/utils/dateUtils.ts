
import { format } from "date-fns";

/**
 * Converts a date to start of day unix timestamp
 */
export function dateToStartOfDayUnix(date: Date): number {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return Math.floor(startOfDay.getTime() / 1000);
}

/**
 * Converts a date to end of day unix timestamp
 */
export function dateToEndOfDayUnix(date: Date): number {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return Math.floor(endOfDay.getTime() / 1000);
}

/**
 * Gets unique dates from an array of unix timestamps
 */
export function getUniqueDatesFromUnixTimestamps(unixTimestamps: number[]): Date[] {
  // Convert unix timestamps to Date objects (just the date part)
  const dates = unixTimestamps.map(timestamp => {
    const date = new Date(timestamp * 1000);
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
 * Format a unix timestamp to a formatted time string
 */
export function formatUnixTime(unixTime: number, formatString: string = 'h:mm a'): string {
  return format(new Date(unixTime * 1000), formatString);
}
