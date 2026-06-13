import { describe, expect, it } from "vitest";
import { validateCommentBody } from "@/lib/posts/comment-validation";

describe("validateCommentBody", () => {
  it("공백만 있으면 실패한다", () => {
    expect(validateCommentBody("   ")).toEqual({
      valid: false,
      message: "댓글 내용을 입력해 주세요.",
    });
  });

  it("유효한 댓글을 trim하여 반환한다", () => {
    expect(validateCommentBody("  좋은 글입니다  ")).toEqual({
      valid: true,
      body: "좋은 글입니다",
    });
  });

  it("최대 길이를 초과하면 실패한다", () => {
    const result = validateCommentBody("a".repeat(2001));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.message).toContain("2000");
    }
  });
});
