const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const FILE_DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatDisplayDate(date = new Date()) {
  return DISPLAY_DATE_FORMATTER.format(date);
}

export function formatFileDate(date = new Date()) {
  return FILE_DATE_FORMATTER.format(date).replaceAll('/', '-');
}

export function toCalendarDateKey(date = new Date()) {
  return formatFileDate(date);
}

export function fromUnixSeconds(seconds) {
  return new Date(Number(seconds) * 1000);
}
