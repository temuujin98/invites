const WEEKDAY_SHORT = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"] as const;
const WEEKDAY_LONG = [
  "Ням",
  "Даваа",
  "Мягмар",
  "Лхагва",
  "Пүрэв",
  "Баасан",
  "Бямба",
] as const;

function toDate(d: Date | string): Date {
  return typeof d === "string" ? new Date(d) : d;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatDate(d: Date | string): string {
  const date = toDate(d);
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

export function formatDateTime(d: Date | string): string {
  const date = toDate(d);
  return `${formatDate(date)} · ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatWeekdayShort(d: Date | string): string {
  return WEEKDAY_SHORT[toDate(d).getDay()];
}

export function formatWeekdayLong(d: Date | string): string {
  return WEEKDAY_LONG[toDate(d).getDay()];
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return raw;
}
