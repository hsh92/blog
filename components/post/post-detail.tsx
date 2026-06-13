import Image from "next/image";
import {
  estimateReadingTimeMinutes,
  formatPublishedDate,
  formatReadingTime,
} from "@/lib/posts/format";
import type { Comment, PostEngagement } from "@/lib/posts/engagement";
import type { Post } from "@/lib/posts/types";
import { PostActions } from "@/components/post/post-actions";
import { PostComments } from "@/components/post/post-comments";
import { PostContent } from "@/components/post/post-content";

type PostDetailProps = {
  post: Post;
  shareUrl: string;
  engagement: PostEngagement;
  comments: Comment[];
  isAuthenticated: boolean;
};

function PostTags({ post }: { post: Post }) {
  const tags =
    post.tags.length > 0
      ? post.tags
      : post.categories
        ? [post.categories.name]
        : [];

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md border border-devlog-border bg-devlog-card px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-devlog-muted"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function PostAuthor({ post, readingMinutes }: { post: Post; readingMinutes: number }) {
  return (
    <div className="flex items-center gap-3">
      {post.author_avatar_url ? (
        <Image
          src={post.author_avatar_url}
          alt=""
          width={40}
          height={40}
          className="rounded-full bg-devlog-card"
          unoptimized
        />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-devlog-card text-sm font-medium text-devlog-muted">
          {post.author_name.charAt(0)}
        </span>
      )}
      <div>
        <p className="text-sm font-medium text-devlog-text">{post.author_name}</p>
        <p className="text-sm text-devlog-muted">
          {formatPublishedDate(post.published_at)}
          <span aria-hidden className="mx-2">
            ·
          </span>
          {formatReadingTime(readingMinutes)}
        </p>
      </div>
    </div>
  );
}

function PostThumbnail({ post }: { post: Post }) {
  if (!post.featured_image_url) {
    return null;
  }

  return (
    <figure className="my-10">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-devlog-border bg-devlog-card">
        <Image
          src={post.featured_image_url}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>
      {post.excerpt && !post.content && (
        <figcaption className="mt-3 text-center text-xs text-devlog-muted">
          {post.excerpt}
        </figcaption>
      )}
    </figure>
  );
}

export function PostDetail({
  post,
  shareUrl,
  engagement,
  comments,
  isAuthenticated,
}: PostDetailProps) {
  const readingMinutes = estimateReadingTimeMinutes(post.content, post.excerpt);

  return (
    <article>
      <header className="mb-8 border-b border-devlog-border pb-8">
        <PostTags post={post} />
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-devlog-text sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <PostAuthor post={post} readingMinutes={readingMinutes} />
          <div className="lg:hidden">
            <PostActions
              postId={post.id}
              slug={post.slug}
              title={post.title}
              shareUrl={shareUrl}
              engagement={engagement}
              isAuthenticated={isAuthenticated}
              layout="horizontal"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[72px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <PostActions
              postId={post.id}
              slug={post.slug}
              title={post.title}
              shareUrl={shareUrl}
              engagement={engagement}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </aside>

        <div className="min-w-0">
          <PostThumbnail post={post} />
          {post.content ? (
            <PostContent content={post.content} />
          ) : (
            <p className="text-base leading-8 text-devlog-muted">{post.excerpt}</p>
          )}

          <PostComments
            postId={post.id}
            slug={post.slug}
            initialComments={comments}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </article>
  );
}
