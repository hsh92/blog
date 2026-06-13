import { describe, expect, it } from "vitest";
import {
  createExcerptFromMarkdown,
  validatePostDraft,
} from "@/lib/posts/post-validation";
import { appendSlugSuffix, createPostSlug, normalizePostSlug } from "@/lib/posts/slug";

describe("createPostSlug", () => {
  it("영문 제목을 slug로 변환한다", () => {
    expect(createPostSlug("Hello Rust Guide")).toBe("hello-rust-guide");
  });

  it("한글만 있는 제목은 ascii fallback slug를 사용한다", () => {
    expect(createPostSlug("테스트 글쓰기")).toMatch(/^post-\d+$/);
  });

  it("짧은 제목은 timestamp slug를 사용한다", () => {
    expect(createPostSlug("ab")).toMatch(/^post-\d+$/);
  });
});

describe("appendSlugSuffix", () => {
  it("중복 slug에 suffix를 붙인다", () => {
    expect(appendSlugSuffix("rust-guide", 2)).toBe("rust-guide-2");
  });
});

describe("normalizePostSlug", () => {
  it("percent-encoded slug를 디코딩한다", () => {
    expect(normalizePostSlug("%ED%85%8C%EC%8A%A4%ED%8A%B8-%EA%B8%80%EC%93%B0%EA%B8%B0")).toBe(
      "테스트-글쓰기",
    );
  });

  it("이미 디코딩된 slug는 그대로 반환한다", () => {
    expect(normalizePostSlug("hello-world")).toBe("hello-world");
  });
});

describe("validatePostDraft", () => {
  it("제목과 본문이 없으면 실패한다", () => {
    expect(validatePostDraft("", "")).toEqual({
      valid: false,
      message: "게시글 제목을 입력해 주세요.",
    });
  });

  it("유효한 초안을 반환한다", () => {
    expect(
      validatePostDraft("Rust 시작하기", "# Hello\n\n본문 내용입니다."),
    ).toEqual({
      valid: true,
      title: "Rust 시작하기",
      content: "# Hello\n\n본문 내용입니다.",
    });
  });
});

describe("createExcerptFromMarkdown", () => {
  it("첫 번째 본문 문장에서 excerpt를 생성한다", () => {
    expect(
      createExcerptFromMarkdown("# Title\n\nRust는 시스템 프로그래밍 언어입니다."),
    ).toBe("Rust는 시스템 프로그래밍 언어입니다.");
  });
});
