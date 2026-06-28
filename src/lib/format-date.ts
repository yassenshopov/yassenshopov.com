const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function formatDate(date: string | Date): string {
  return formatter.format(typeof date === 'string' ? new Date(date) : date);
}

export function toRFC822(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toUTCString();
}
