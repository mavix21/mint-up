/**
 * Check if an event is currently live
 * @param startDate - Event start timestamp
 * @param endDate - Optional event end timestamp
 * @returns boolean indicating if event is currently live
 */
export const isEventLive = (startDate: number, endDate?: number): boolean => {
  const now = Date.now();

  // If endDate exists, use it; otherwise, assume 24 hours duration
  const endTime = endDate || startDate + 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  return now >= startDate && now <= endTime;
};
