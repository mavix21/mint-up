export interface EventTimes {
  startTime: string;
  endTime: string;
}

/**
 * Calculate one hour after a given time
 * @param time - Time string in HH:mm format
 * @returns Time string one hour after the input time
 */
export function calculateOneHourAfter(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const endHour = (hours + 1) % 24;
  return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Calculate the closest 30-minute interval to the current time
 * @returns EventTimes object with start and end times in HH:mm format
 */
export function calculateDefaultEventTimes(): EventTimes {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Round to nearest 30-minute interval
  const roundedMinute = Math.round(currentMinute / 30) * 30;
  const adjustedHour = roundedMinute === 60 ? currentHour + 1 : currentHour;
  const finalMinute = roundedMinute === 60 ? 0 : roundedMinute;

  // Format start time (HH:mm)
  const startTime = `${adjustedHour.toString().padStart(2, '0')}:${finalMinute
    .toString()
    .padStart(2, '0')}`;

  // End time is 1 hour after start time
  const endTime = calculateOneHourAfter(startTime);

  return { startTime, endTime };
}

/**
 * Get today's date in YYYY-MM-DD format for HTML date inputs
 * @returns Today's date as a string
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a time string to HH:mm format
 * @param hours - Hours (0-23)
 * @param minutes - Minutes (0-59)
 * @returns Formatted time string
 */
export function formatTime(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
