"use client";

import Link from "next/link";
import { useCallback, useState, useTransition } from "react";
import {
  togglePostBookmarkAction,
  togglePostLikeAction,
} from "@/app/posts/[slug]/actions";
import { formatCount } from "@/lib/posts/format";
import type { PostEngagement } from "@/lib/posts/engagement";

type PostActionsProps = {
  postId: string;
  slug: string;
  title: string;
  shareUrl: string;
  engagement: PostEngagement;
  isAuthenticated: boolean;
  layout?: "horizontal" | "vertical";
};

type ActionButtonProps = {
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

function ActionButton({
  label,
  onClick,
  active = false,
  disabled = false,
  children,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex flex-col items-center gap-1.5 text-devlog-muted transition hover:text-devlog-text disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={label}
      aria-pressed={active}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full border bg-devlog-card transition group-hover:border-devlog-muted ${
          active ? "border-devlog-accent text-devlog-accent" : "border-devlog-border"
        }`}
      >
        {children}
      </span>
      <span className="text-xs">{label}</span>
    </button>
  );
}

export function PostActions({
  postId,
  slug,
  title,
  shareUrl,
  engagement,
  isAuthenticated,
  layout = "vertical",
}: PostActionsProps) {
  const [likeCount, setLikeCount] = useState(engagement.likeCount);
  const [isLiked, setIsLiked] = useState(engagement.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(engagement.isBookmarked);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleShare = useCallback(async () => {
    setFeedback(null);

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url: shareUrl });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setFeedback("링크가 복사되었습니다");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setFeedback("공유에 실패했습니다");
    }
  }, [shareUrl, title]);

  const requireAuth = useCallback(() => {
    setFeedback("로그인이 필요합니다");
  }, []);

  const handleLike = useCallback(() => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    startTransition(async () => {
      setFeedback(null);
      const result = await togglePostLikeAction(postId, slug);

      if (!result.ok) {
        setFeedback(result.error);
        return;
      }

      setIsLiked((current) => {
        setLikeCount((count) => (current ? count - 1 : count + 1));
        return !current;
      });
    });
  }, [isAuthenticated, postId, requireAuth, slug]);

  const handleBookmark = useCallback(() => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    startTransition(async () => {
      setFeedback(null);
      const result = await togglePostBookmarkAction(postId, slug);

      if (!result.ok) {
        setFeedback(result.error);
        return;
      }

      setIsBookmarked((current) => !current);
    });
  }, [isAuthenticated, postId, requireAuth, slug]);

  const containerClass =
    layout === "vertical"
      ? "flex flex-col items-center gap-6"
      : "flex items-center gap-6";

  return (
    <div className={containerClass} role="group" aria-label="게시글 상호작용">
      <ActionButton
        label={formatCount(likeCount)}
        onClick={handleLike}
        active={isLiked}
        disabled={isPending}
      >
        <svg
          className="h-4 w-4"
          fill={isLiked ? "currentColor" : "none"}
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
      </ActionButton>

      <ActionButton label="공유" onClick={handleShare}>
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </ActionButton>

      <ActionButton
        label="저장"
        onClick={handleBookmark}
        active={isBookmarked}
        disabled={isPending}
      >
        <svg
          className="h-4 w-4"
          fill={isBookmarked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </ActionButton>

      {feedback && (
        <p
          className={`text-center text-xs text-devlog-accent ${
            layout === "vertical" ? "max-w-[88px]" : ""
          }`}
          role="status"
        >
          {feedback === "로그인이 필요합니다" ? (
            <>
              <Link href="/login" className="underline hover:text-sky-300">
                로그인
              </Link>
              이 필요합니다
            </>
          ) : (
            feedback
          )}
        </p>
      )}
    </div>
  );
}
