"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { createCommentAction } from "@/app/posts/[slug]/actions";
import type { Comment } from "@/lib/posts/engagement";
import { formatRelativeTime } from "@/lib/posts/format";

type PostCommentsProps = {
  postId: string;
  slug: string;
  initialComments: Comment[];
  isAuthenticated: boolean;
};

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <article className="flex gap-3 border-b border-devlog-border py-5 last:border-b-0">
      {comment.author_avatar_url ? (
        <Image
          src={comment.author_avatar_url}
          alt=""
          width={36}
          height={36}
          className="shrink-0 rounded-full bg-devlog-card"
          unoptimized
        />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-devlog-card text-xs text-devlog-muted">
          {comment.author_name.charAt(0)}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-medium text-devlog-text">
            {comment.author_name}
          </span>
          <time
            dateTime={comment.created_at}
            className="text-xs text-devlog-muted"
          >
            {formatRelativeTime(comment.created_at)}
          </time>
        </div>
        <p className="text-sm leading-7 text-devlog-muted">{comment.body}</p>
        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-devlog-muted transition hover:text-devlog-text"
            disabled
            title="준비 중"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            좋아요
          </button>
          <button
            type="button"
            className="text-xs text-devlog-muted transition hover:text-devlog-text"
            disabled
            title="준비 중"
          >
            답글
          </button>
        </div>
      </div>
    </article>
  );
}

export function PostComments({
  postId,
  slug,
  initialComments,
  isAuthenticated,
}: PostCommentsProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);

    startTransition(async () => {
      const result = await createCommentAction(postId, slug, formData);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      formRef.current?.reset();
      router.refresh();
    });
  };

  return (
    <section className="mt-16 border-t border-devlog-border pt-10">
      <h2 className="mb-6 text-lg font-bold text-devlog-text">
        댓글 ({initialComments.length})
      </h2>

      {isAuthenticated ? (
        <form ref={formRef} action={handleSubmit} className="mb-8">
          <label htmlFor="comment-body" className="sr-only">
            댓글 입력
          </label>
          <textarea
            id="comment-body"
            name="body"
            rows={4}
            placeholder="댓글을 입력하세요..."
            disabled={isPending}
            className="w-full resize-y rounded-xl border border-devlog-border bg-devlog-input px-4 py-3 text-sm text-devlog-text placeholder:text-devlog-muted focus:border-devlog-accent focus:outline-none focus:ring-1 focus:ring-devlog-accent disabled:opacity-60"
          />
          <div className="mt-3 flex items-center justify-end gap-3">
            {error && (
              <p className="mr-auto text-sm text-red-300" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-devlog-accent px-4 py-2 text-sm font-medium text-devlog-bg transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "게시 중…" : "댓글 게시"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-xl border border-devlog-border bg-devlog-card px-4 py-5 text-sm text-devlog-muted">
          댓글을 작성하려면{" "}
          <Link href="/login" className="text-devlog-accent hover:underline">
            로그인
          </Link>
          이 필요합니다.
        </div>
      )}

      {initialComments.length > 0 ? (
        <div>
          {initialComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-devlog-muted">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
        </p>
      )}
    </section>
  );
}
