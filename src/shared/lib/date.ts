/**
 * Azərbaycanca tarix formatlaması.
 *
 * `toLocaleDateString('az-AZ')` brauzerdən asılıdır — Chrome-da
 * "2026 M08 31, Mon" kimi yararsız nəticə verir, çünki az-AZ üçün tam
 * lokal məlumatı olmaya bilər. Ona görə adları özümüz saxlayırıq:
 * nəticə hər brauzerdə eyni olur.
 */

const MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
  'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
] as const;

const MONTHS_SHORT = [
  'Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn',
  'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek',
] as const;

/** getDay(): 0 = Bazar */
const WEEKDAYS = [
  'Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə',
  'Cümə axşamı', 'Cümə', 'Şənbə',
] as const;

const WEEKDAYS_SHORT = [
  'B.', 'B.e.', 'Ç.a.', 'Ç.', 'C.a.', 'C.', 'Ş.',
] as const;

function toDate(value: Date | string): Date {
  return typeof value === 'string' ? new Date(value) : value;
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

/** "14:30" */
export function formatTime(value: Date | string): string {
  const date = toDate(value);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** "31 Avqust 2026" */
export function formatDate(value: Date | string): string {
  const date = toDate(value);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** "31 Avqust 2026, Bazar ertəsi" */
export function formatDateWithWeekday(value: Date | string): string {
  const date = toDate(value);
  return `${formatDate(date)}, ${WEEKDAYS[date.getDay()]}`;
}

/** "31 Avq, 14:30" */
export function formatShortDateTime(value: Date | string): string {
  const date = toDate(value);
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}, ${formatTime(date)}`;
}

/** "31 Avqust, B.e." */
export function formatDayLabel(value: Date | string): string {
  const date = toDate(value);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${WEEKDAYS_SHORT[date.getDay()]}`;
}

/** "14:30–15:00" */
export function formatTimeRange(
  start: Date | string,
  end: Date | string,
): string {
  return `${formatTime(start)}–${formatTime(end)}`;
}
