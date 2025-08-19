export function formatRelativeDate(fromMilliseconds: number) {
  const fromDate = new Date(fromMilliseconds);
  return fromDate.toISOString();
}

export function formatDate(date: string) {
  // Convert to Date object if it's a string
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }

  // Get weekday, day, and year
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const year = dateObj.getFullYear();

  return `${weekday}, ${month} ${day}, ${year}`;
}

export function formatDateWithLogicYear(date: string) {
  // Convert to Date object if it's a string
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }

  // Get weekday, day, and year
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const year = dateObj.getFullYear();

  const isSameYear = year === new Date().getFullYear();

  return isSameYear ? `${weekday}, ${month} ${day}` : `${weekday}, ${month} ${day}, ${year}`;
}

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
