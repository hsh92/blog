import { describe, expect, it } from "vitest";
import { formatPublishedDate } from "@/lib/posts/format";

describe("formatPublishedDate", () => {
  it("한국어 날짜 형식으로 포맷한다", () => {
    const formatted = formatPublishedDate("2024-10-12T10:00:00.000Z");
    expect(formatted).toContain("2024");
    expect(formatted).toContain("10");
    expect(formatted).toContain("12");
  });

  it("null이면 빈 문자열을 반환한다", () => {
    expect(formatPublishedDate(null)).toBe("");
  });
});
