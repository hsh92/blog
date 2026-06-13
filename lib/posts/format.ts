const koreanDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const WORDS_PER_MINUTE = 200;

export function formatPublishedDate(isoDate: string | null): string {
  if (!isoDate) {
    return "";
  }
  return koreanDateFormatter.format(new Date(isoDate));
}

export function estimateReadingTimeMinutes(
  content: string | null,
  excerpt?: string,
): number {
  const text = [content, excerpt].filter(Boolean).join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes}분 읽기`;
}

export function formatCount(count: number): string {
  if (count >= 1_000_000) {
    return `${trimTrailingZero(count / 1_000_000)}M`;
  }

  if (count >= 1_000) {
    return `${trimTrailingZero(count / 1_000)}k`;
  }

  return String(count);
}

function trimTrailingZero(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat("ko", {
  numeric: "auto",
});

const RELATIVE_TIME_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

export function formatRelativeTime(isoDate: string): string {
  const target = new Date(isoDate).getTime();
  const diffSeconds = Math.round((target - Date.now()) / 1000);
  const absDiff = Math.abs(diffSeconds);

  for (const [unit, secondsInUnit] of RELATIVE_TIME_UNITS) {
    if (absDiff >= secondsInUnit || unit === "second") {
      const value = Math.round(diffSeconds / secondsInUnit);
      return relativeTimeFormatter.format(value, unit);
    }
  }

  return relativeTimeFormatter.format(0, "second");
}
