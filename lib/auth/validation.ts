const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export type ValidationResult =
  | { valid: true }
  | { valid: false; field: "email" | "password" | "confirmPassword"; message: string };

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (!trimmed) {
    return { valid: false, field: "email", message: "이메일 주소를 입력해 주세요." };
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return { valid: false, field: "email", message: "올바른 이메일 형식이 아닙니다." };
  }

  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, field: "password", message: "비밀번호를 입력해 주세요." };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      field: "password",
      message: `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`,
    };
  }

  return { valid: true };
}

export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string,
): ValidationResult {
  const passwordResult = validatePassword(password);
  if (!passwordResult.valid) {
    return passwordResult;
  }

  if (password !== confirmPassword) {
    return {
      valid: false,
      field: "confirmPassword",
      message: "비밀번호가 일치하지 않습니다.",
    };
  }

  return { valid: true };
}

export function validateLoginInput(email: string, password: string): ValidationResult {
  const emailResult = validateEmail(email);
  if (!emailResult.valid) {
    return emailResult;
  }

  return validatePassword(password);
}

export function validateSignupInput(
  email: string,
  password: string,
  confirmPassword: string,
): ValidationResult {
  const emailResult = validateEmail(email);
  if (!emailResult.valid) {
    return emailResult;
  }

  return validatePasswordConfirmation(password, confirmPassword);
}
