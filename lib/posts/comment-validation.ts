const MAX_COMMENT_LENGTH = 2000;

export type CommentValidationResult =
  | { valid: true; body: string }
  | { valid: false; message: string };

export function validateCommentBody(body: string): CommentValidationResult {
  const trimmed = body.trim();

  if (!trimmed) {
    return { valid: false, message: "댓글 내용을 입력해 주세요." };
  }

  if (trimmed.length > MAX_COMMENT_LENGTH) {
    return {
      valid: false,
      message: `댓글은 ${MAX_COMMENT_LENGTH}자 이내로 작성해 주세요.`,
    };
  }

  return { valid: true, body: trimmed };
}

export { MAX_COMMENT_LENGTH };
