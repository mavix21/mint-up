/**
 * Text utility functions for formatting and processing text
 * These are pure functions that can be used across different screens
 */

/**
 * Truncates text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @param ellipsis - The ellipsis string to append (default: "...")
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number, ellipsis: string = '...'): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}${ellipsis}`;
};

/**
 * Formats description text for display
 * @param description - The description text
 * @param maxLength - Maximum length before truncation (default: 50)
 * @returns Formatted description text
 */
export const formatDescriptionText = (description: string, maxLength: number = 50): string => {
  if (!description || description.trim() === '') {
    return 'Add Description';
  }

  const preview = description.trim();
  return preview.length > maxLength ? truncateText(preview, maxLength) : preview;
};

/**
 * Formats ticket pricing text based on ticket types
 * @param tickets - Array of ticket objects
 * @param getPrice - Function to extract price from ticket
 * @param getType - Function to extract type from ticket
 * @returns Formatted ticket text
 */
export const formatTicketText = <T>(
  tickets: T[],
  getPrice: (ticket: T) => number,
  getType: (ticket: T) => string
): string => {
  if (tickets.length === 0) {
    return 'Free';
  }

  const freeTickets = tickets.filter((t) => getType(t) === 'free');
  const paidTickets = tickets.filter((t) => getType(t) === 'paid');

  if (freeTickets.length > 0 && paidTickets.length === 0) {
    return 'Free';
  }

  if (freeTickets.length === 0 && paidTickets.length > 0) {
    const minPrice = Math.min(...paidTickets.map((t) => getPrice(t) || 0));
    return `From $${minPrice.toFixed(2)}`;
  }

  return 'Free & Paid';
};

/**
 * Formats location text for display
 * @param location - Location object or string
 * @param getType - Function to extract type from location
 * @param getAddress - Function to extract address from location
 * @param getUrl - Function to extract URL from location
 * @returns Formatted location text
 */
export const formatLocationText = <T>(
  location: T | undefined,
  getType: (location: T) => string,
  getAddress: (location: T) => string,
  getUrl: (location: T) => string
): string => {
  if (!location) {
    return 'Offline location or virtual link';
  }

  if (getType(location) === 'in-person') {
    return getAddress(location) || 'Add address';
  } else {
    return getUrl(location) || 'Add meeting URL';
  }
};

/**
 * Gets ticket count text
 * @param tickets - Array of tickets
 * @returns Ticket count text
 */
export const getTicketCountText = (tickets: any[]): string => {
  if (tickets.length === 0) {
    return '';
  }
  return ` (${tickets.length})`;
};
