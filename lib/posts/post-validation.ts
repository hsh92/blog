const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 120;
const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 50_000;
const MAX_EXCERPT_LENGTH = 200;

export type PostDraftValidationResult =
  | { valid: true; title: string; content: string }
  | { valid: false; message: string };

export function validatePostDraft(
  title: string,
  content: string,
): PostDraftValidationResult {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) {
    return { valid: false, message: "게시글 제목을 입력해 주세요." };
  }

  if (trimmedTitle.length < MIN_TITLE_LENGTH) {
    return {
      valid: false,
      message: `제목은 ${MIN_TITLE_LENGTH}자 이상 입력해 주세요.`,
    };
  }

  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    return {
      valid: false,
      message: `제목은 ${MAX_TITLE_LENGTH}자 이내로 입력해 주세요.`,
    };
  }

  if (!trimmedContent) {
    return { valid: false, message: "본문을 입력해 주세요." };
  }

  if (trimmedContent.length < MIN_CONTENT_LENGTH) {
    return {
      valid: false,
      message: `본문은 ${MIN_CONTENT_LENGTH}자 이상 입력해 주세요.`,
    };
  }

  if (trimmedContent.length > MAX_CONTENT_LENGTH) {
    return {
      valid: false,
      message: `본문은 ${MAX_CONTENT_LENGTH.toLocaleString()}자 이내로 입력해 주세요.`,
    };
  }

  return { valid: true, title: trimmedTitle, content: trimmedContent };
}

export function createExcerptFromMarkdown(
  content: string,
  maxLength = MAX_EXCERPT_LENGTH,
): string {
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("```")) {
      continue;
    }

    const plain = trimmed
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`>#-]/g, "")
      .trim();

    if (!plain) {
      continue;
    }

    if (plain.length <= maxLength) {
      return plain;
    }

    return `${plain.slice(0, maxLength - 1)}…`;
  }

  const fallback = content.replace(/\s+/g, " ").trim();

  if (fallback.length <= maxLength) {
    return fallback;
  }

  return `${fallback.slice(0, maxLength - 1)}…`;
}
