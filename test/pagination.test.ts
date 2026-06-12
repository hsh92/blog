import { describe, expect, it } from "vitest";
import {
  clampPage,
  getPageRange,
  getTotalPages,
} from "@/lib/posts/pagination";

describe("getTotalPages", () => {
  it("총 개수와 페이지 크기로 페이지 수를 계산한다", () => {
    expect(getTotalPages(0, 9)).toBe(1);
    expect(getTotalPages(9, 9)).toBe(1);
    expect(getTotalPages(10, 9)).toBe(2);
    expect(getTotalPages(27, 9)).toBe(3);
  });
});

describe("getPageRange", () => {
  it("현재 페이지 주변 번호 목록을 반환한다", () => {
    expect(getPageRange(1, 12)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageRange(6, 12)).toEqual([4, 5, 6, 7, 8]);
    expect(getPageRange(12, 12)).toEqual([8, 9, 10, 11, 12]);
  });
});

describe("clampPage", () => {
  it("페이지 번호를 유효 범위로 제한한다", () => {
    expect(clampPage(0, 5)).toBe(1);
    expect(clampPage(3, 5)).toBe(3);
    expect(clampPage(99, 5)).toBe(5);
  });
});
