import { describe, expect, it } from "vitest";
import {
  estimateReadingTimeMinutes,
  formatCount,
  formatPublishedDate,
  formatReadingTime,
  formatRelativeTime,
} from "@/lib/posts/format";

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

describe("estimateReadingTimeMinutes", () => {
  it("본문 길이에 따라 읽기 시간을 계산한다", () => {
    const words = Array.from({ length: 400 }, (_, index) => `word${index}`).join(
      " ",
    );
    expect(estimateReadingTimeMinutes(words)).toBe(2);
  });

  it("내용이 없으면 excerpt를 사용한다", () => {
    expect(estimateReadingTimeMinutes(null, "짧은 요약")).toBe(1);
  });

  it("최소 1분을 반환한다", () => {
    expect(estimateReadingTimeMinutes("")).toBe(1);
  });
});

describe("formatReadingTime", () => {
  it("분 단위 라벨을 반환한다", () => {
    expect(formatReadingTime(12)).toBe("12분 읽기");
  });
});

describe("formatCount", () => {
  it("1000 미만은 그대로 표시한다", () => {
    expect(formatCount(42)).toBe("42");
  });

  it("1000 이상은 k 단위로 표시한다", () => {
    expect(formatCount(1200)).toBe("1.2k");
    expect(formatCount(1000)).toBe("1k");
  });
});

describe("formatRelativeTime", () => {
  it("상대 시간 문자열을 반환한다", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toContain("시간");
  });
});
