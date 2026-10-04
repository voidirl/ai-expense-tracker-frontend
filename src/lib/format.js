const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currencyCompact = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const plain = new Intl.NumberFormat('en-IN');

export const formatMoney = (value) => currency.format(Number(value) || 0);
export const formatMoneyCompact = (value) => currencyCompact.format(Number(value) || 0);
export const formatCount = (value) => plain.format(Number(value) || 0);

/**
 * The backend stores `LocalDate`, which serialises as "YYYY-MM-DD".
 * `new Date("2026-03-12")` parses that as UTC midnight, which renders as the
 * 11th for anyone west of UTC. Build a local date instead.
 */
export function parseDate(value) {
  if (value instanceof Date) return value;
  if (typeof value !== 'string') return new Date(NaN);
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month) return new Date(NaN);
  return new Date(year, month - 1, day ?? 1);
}

export function formatDate(value) {
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** "Mar 2026" — used as the x-axis key for monthly rollups. */
export function formatMonthKey(value) {
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

export function formatToday() {
  return new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Today as YYYY-MM-DD, for <input type="date" max={today}>. */
export function todayISODate() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function isSameMonth(value, reference = new Date()) {
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return false;
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
}