const koreanDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatPublishedDate(isoDate: string | null): string {
  if (!isoDate) {
    return "";
  }
  return koreanDateFormatter.format(new Date(isoDate));
}
