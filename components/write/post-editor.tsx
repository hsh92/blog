"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishPostAction } from "@/app/write/actions";
import { PostContent } from "@/components/post/post-content";
import { buildPostPath } from "@/lib/posts/slug";
import { EditorHeader } from "@/components/write/editor-header";

const DEFAULT_MARKDOWN = `# Rust 시작하기

Rust는 시스템 프로그래밍을 위한 언어입니다. C/C++ 수준의 성능을 제공하면서도 메모리 안전성을 컴파일 타임에 보장합니다.

## 왜 Rust인가요?

- **메모리 안전성:** 소유권 시스템으로 런타임 오류를 줄입니다.
- **제로 코스트 추상화:** 고수준 API를 써도 성능 손실이 적습니다.
- **동시성:** Fearless concurrency로 데이터 레이스를 방지합니다.

### 예제 코드

\`\`\`rust
fn main() {
    println!("Hello, Rust!");
}
\`\`\`
`;

export function PostEditor() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(DEFAULT_MARKDOWN);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const lineNumbers = useMemo(() => {
    const lineCount = Math.max(content.split("\n").length, 1);
    return Array.from({ length: lineCount }, (_, index) => index + 1);
  }, [content]);

  const handlePublish = () => {
    setError(null);

    startTransition(async () => {
      const result = await publishPostAction({ title, content });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push(buildPostPath(result.slug));
    });
  };

  const handleEditorScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-devlog-bg text-devlog-text">
      <EditorHeader onPublish={handlePublish} isPublishing={isPending} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <div className="border-b border-devlog-border px-4 py-6 sm:px-6 lg:px-8">
          <label htmlFor="post-title" className="sr-only">
            게시글 제목
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="게시글 제목..."
            disabled={isPending}
            className="w-full bg-transparent text-3xl font-bold tracking-tight text-devlog-text placeholder:text-devlog-muted/70 focus:outline-none disabled:opacity-60 sm:text-4xl"
          />
          {error && (
            <p className="mt-3 text-sm text-red-300" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="grid min-h-[calc(100vh-9rem)] flex-1 grid-cols-1 lg:grid-cols-2">
          <section
            aria-label="마크다운 에디터"
            className="flex min-h-[320px] border-b border-devlog-border lg:min-h-0 lg:border-b-0 lg:border-r"
          >
            <div
              ref={gutterRef}
              aria-hidden
              className="hidden w-12 shrink-0 select-none overflow-hidden border-r border-devlog-border bg-devlog-bg py-4 text-right font-mono text-xs leading-6 text-devlog-muted/70 sm:block"
            >
              {lineNumbers.map((lineNumber) => (
                <div key={lineNumber} className="pr-3">
                  {lineNumber}
                </div>
              ))}
            </div>

            <label htmlFor="post-content" className="sr-only">
              마크다운 본문
            </label>
            <textarea
              ref={textareaRef}
              id="post-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              onScroll={handleEditorScroll}
              disabled={isPending}
              spellCheck={false}
              className="min-h-[320px] w-full flex-1 resize-none bg-devlog-input px-4 py-4 font-mono text-sm leading-6 text-devlog-text placeholder:text-devlog-muted focus:outline-none disabled:opacity-60 sm:px-6"
            />
          </section>

          <section
            aria-label="미리보기"
            className="min-h-[320px] overflow-y-auto px-4 py-4 sm:px-6 lg:min-h-0 lg:py-6"
          >
            {content.trim() ? (
              <PostContent content={content} />
            ) : (
              <p className="text-sm text-devlog-muted">
                마크다운을 입력하면 미리보기가 표시됩니다.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
