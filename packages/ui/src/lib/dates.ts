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
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const year = dateObj.getFullYear();

  return `${weekday}, ${month} ${day}, ${year}`;
}
