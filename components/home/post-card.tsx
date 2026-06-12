import Image from "next/image";
import Link from "next/link";
import { formatPublishedDate } from "@/lib/posts/format";
import type { Post } from "@/lib/posts/types";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const displayTags =
    post.tags.length > 0
      ? post.tags
      : post.categories
        ? [post.categories.slug]
        : [];

  return (
    <article className="group flex flex-col rounded-xl border border-devlog-border bg-devlog-card p-5 transition hover:border-devlog-muted/60">
      <div className="mb-4 flex flex-wrap gap-2">
        {displayTags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-devlog-bg px-2 py-0.5 text-xs text-devlog-muted"
          >
            #{tag}
          </span>
        ))}
      </div>

      <Link href={`/posts/${post.slug}`} className="flex flex-1 flex-col">
        <h3 className="mb-3 text-base font-semibold leading-snug text-devlog-text transition group-hover:text-devlog-accent">
          {post.title}
        </h3>
        <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-devlog-muted">
          {post.excerpt}
        </p>
      </Link>

      <footer className="flex items-center justify-between gap-3 border-t border-devlog-border pt-4">
        <div className="flex min-w-0 items-center gap-2">
          {post.author_avatar_url ? (
            <Image
              src={post.author_avatar_url}
              alt=""
              width={28}
              height={28}
              className="rounded-full bg-devlog-bg"
              unoptimized
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-devlog-bg text-xs text-devlog-muted">
              {post.author_name.charAt(0)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-devlog-text">
              {post.author_name}
            </p>
            <time
              dateTime={post.published_at ?? undefined}
              className="text-xs text-devlog-muted"
            >
              {formatPublishedDate(post.published_at)}
            </time>
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 text-devlog-muted transition hover:text-devlog-accent"
          aria-label="북마크"
          disabled
          title="준비 중"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </footer>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-devlog-border bg-devlog-card p-5">
      <div className="mb-4 flex gap-2">
        <div className="h-5 w-14 rounded bg-devlog-bg" />
        <div className="h-5 w-20 rounded bg-devlog-bg" />
      </div>
      <div className="mb-3 h-5 w-3/4 rounded bg-devlog-bg" />
      <div className="mb-2 h-4 w-full rounded bg-devlog-bg" />
      <div className="mb-6 h-4 w-5/6 rounded bg-devlog-bg" />
      <div className="flex items-center gap-2 border-t border-devlog-border pt-4">
        <div className="h-7 w-7 rounded-full bg-devlog-bg" />
        <div className="space-y-1">
          <div className="h-3 w-20 rounded bg-devlog-bg" />
          <div className="h-3 w-24 rounded bg-devlog-bg" />
        </div>
      </div>
    </div>
  );
}
