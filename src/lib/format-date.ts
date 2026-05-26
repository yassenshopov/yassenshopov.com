const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatDate(date: string | Date): string {
  return formatter.format(typeof date === "string" ? new Date(date) : date);
}

const rfc822Formatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "UTC",
  hour12: false,
});

export function toRFC822(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toUTCString();
}
