export function formatRelativeDate(fromMilliseconds: number) {
  const fromDate = new Date(fromMilliseconds);
  return fromDate.toISOString();
}
