/**
 * Date utility functions for formatting and manipulating dates
 * These are pure functions that can be used across different screens
 */

/**
 * Formats a date to show "Today", "Tomorrow", or the date
 * @param dateInput - Date string, timestamp, or Date object
 * @returns Formatted date string
 */
export const formatRelativeDate = (dateInput: string | number | Date): string => {
  const date = new Date(dateInput);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
};

/**
 * Gets the day of the week from a date
 * @param dateInput - Date string, timestamp, or Date object
 * @returns Day of the week (e.g., "Monday")
 */
export const getDayOfWeek = (dateInput: string | number | Date): string => {
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

/**
 * Formats time from a date
 * @param dateInput - Date string, timestamp, or Date object
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export const formatTime = (dateInput: string | number | Date): string => {
  const date = new Date(dateInput);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Groups items by date and sorts them
 * @param items - Array of items with a date property
 * @param dateKey - Function to extract date key from item
 * @param sortDirection - 'asc' for ascending, 'desc' for descending
 * @returns Array of [dateKey, items[]] tuples
 */
export const groupByDate = <T>(
  items: T[],
  dateKey: (item: T) => string,
  sortDirection: 'asc' | 'desc' = 'asc'
): [string, T[]][] => {
  const grouped = items.reduce((acc, item) => {
    const key = dateKey(item);
    acc[key] ??= [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);

  return Object.entries(grouped).sort(([a], [b]) =>
    sortDirection === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
  );
};
