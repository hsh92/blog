import { describe, expect, it } from "vitest";
import {
  validateEmail,
  validateLoginInput,
  validatePassword,
  validatePasswordConfirmation,
  validateSignupInput,
} from "@/lib/auth/validation";

describe("validateEmail", () => {
  it("빈 이메일을 거부한다", () => {
    const result = validateEmail("");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.field).toBe("email");
    }
  });

  it("올바른 이메일을 허용한다", () => {
    expect(validateEmail("user@example.com").valid).toBe(true);
  });

  it("잘못된 이메일 형식을 거부한다", () => {
    const result = validateEmail("invalid-email");
    expect(result.valid).toBe(false);
  });
});

describe("validatePassword", () => {
  it("8자 미만 비밀번호를 거부한다", () => {
    const result = validatePassword("short");
    expect(result.valid).toBe(false);
  });

  it("8자 이상 비밀번호를 허용한다", () => {
    expect(validatePassword("password123").valid).toBe(true);
  });
});

describe("validatePasswordConfirmation", () => {
  it("비밀번호 불일치를 거부한다", () => {
    const result = validatePasswordConfirmation("password123", "different");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.field).toBe("confirmPassword");
    }
  });
});

describe("validateLoginInput", () => {
  it("유효한 로그인 입력을 허용한다", () => {
    expect(validateLoginInput("user@example.com", "password123").valid).toBe(true);
  });
});

describe("validateSignupInput", () => {
  it("회원가입 입력 전체를 검증한다", () => {
    const result = validateSignupInput(
      "user@example.com",
      "password123",
      "password123",
    );
    expect(result.valid).toBe(true);
  });
});
