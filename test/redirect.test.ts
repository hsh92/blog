import { describe, expect, it } from "vitest";
import { getSafeRedirectPath } from "@/lib/auth/redirect";

describe("getSafeRedirectPath", () => {
  it("내부 경로를 허용한다", () => {
    expect(getSafeRedirectPath("/write")).toBe("/write");
  });

  it("외부 URL은 홈으로 fallback한다", () => {
    expect(getSafeRedirectPath("https://evil.com")).toBe("/");
    expect(getSafeRedirectPath("//evil.com")).toBe("/");
  });

  it("값이 없으면 홈으로 이동한다", () => {
    expect(getSafeRedirectPath()).toBe("/");
    expect(getSafeRedirectPath(null)).toBe("/");
  });
});
