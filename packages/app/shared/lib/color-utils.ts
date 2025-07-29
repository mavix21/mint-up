/**
 * Color utility functions for determining UI colors based on state
 * These are pure functions that can be used across different screens
 */

/**
 * Determines color based on description state
 * @param description - The description text
 * @returns Color token string
 */
export const getDescriptionColor = (description: string): string => {
  if (!description || description.trim() === '') {
    return '$color9';
  }
  return '$color10';
};

/**
 * Determines color based on ticket state
 * @param tickets - Array of tickets
 * @returns Color token string
 */
export const getTicketColor = (tickets: any[]): string => {
  if (tickets.length === 0) {
    return '$color11';
  }
  return '$color12';
};

/**
 * Determines color based on location state
 * @param location - Location object or string
 * @param getType - Function to extract type from location
 * @param getAddress - Function to extract address from location
 * @param getUrl - Function to extract URL from location
 * @returns Color token string
 */
export const getLocationColor = <T>(
  location: T | undefined,
  getType: (location: T) => string,
  getAddress: (location: T) => string,
  getUrl: (location: T) => string
): string => {
  if (!location) {
    return '$color9';
  }

  if (getType(location) === 'in-person' && getAddress(location)) {
    return '$color12';
  }

  if (getType(location) === 'virtual' && getUrl(location)) {
    return '$color12';
  }

  return '$color9';
};
