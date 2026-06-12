const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  email_not_confirmed: "이메일 인증을 완료한 후 로그인해 주세요.",
  user_already_registered: "이미 가입된 이메일입니다. 로그인해 주세요.",
  weak_password: "비밀번호가 너무 약합니다. 8자 이상으로 설정해 주세요.",
  over_email_send_rate_limit: "이메일 전송 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.",
  auth_callback_error: "인증 처리 중 오류가 발생했습니다. 다시 시도해 주세요.",
};

export function translateAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return AUTH_ERROR_MESSAGES.invalid_credentials;
  }

  if (normalized.includes("email not confirmed")) {
    return AUTH_ERROR_MESSAGES.email_not_confirmed;
  }

  if (normalized.includes("user already registered")) {
    return AUTH_ERROR_MESSAGES.user_already_registered;
  }

  if (normalized.includes("password")) {
    return AUTH_ERROR_MESSAGES.weak_password;
  }

  if (normalized.includes("rate limit")) {
    return AUTH_ERROR_MESSAGES.over_email_send_rate_limit;
  }

  return message;
}

export function getAuthStatusMessage(code: string | undefined): string | null {
  switch (code) {
    case "confirm_email":
      return "회원가입이 완료되었습니다. 이메일로 전송된 인증 링크를 확인해 주세요.";
    case "reset_email_sent":
      return "비밀번호 재설정 링크를 이메일로 보냈습니다.";
    case "password_updated":
      return "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.";
    case "auth_callback_error":
      return AUTH_ERROR_MESSAGES.auth_callback_error;
    default:
      return null;
  }
}
