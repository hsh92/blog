import { describe, expect, it } from "vitest";
import { getAuthStatusMessage, translateAuthError } from "@/lib/auth/messages";

describe("translateAuthError", () => {
  it("Invalid login credentials를 한국어로 변환한다", () => {
    expect(translateAuthError("Invalid login credentials")).toBe(
      "이메일 또는 비밀번호가 올바르지 않습니다.",
    );
  });

  it("이메일 미인증 메시지를 한국어로 변환한다", () => {
    expect(translateAuthError("Email not confirmed")).toBe(
      "이메일 인증을 완료한 후 로그인해 주세요.",
    );
  });
});

describe("getAuthStatusMessage", () => {
  it("회원가입 확인 메시지를 반환한다", () => {
    expect(getAuthStatusMessage("confirm_email")).toContain("이메일");
  });

  it("알 수 없는 코드는 null을 반환한다", () => {
    expect(getAuthStatusMessage("unknown")).toBeNull();
  });
});
