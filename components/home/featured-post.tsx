import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/posts/types";

type FeaturedPostProps = {
  post: Post;
};

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-medium uppercase tracking-wider text-devlog-muted">
            추천 게시글
          </span>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-devlog-text sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-devlog-muted">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/posts/${post.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-devlog-accent px-5 py-2.5 text-sm font-medium text-devlog-bg transition hover:bg-sky-300"
            >
              전체 읽기
              <span aria-hidden>→</span>
            </Link>
            <button
              type="button"
              className="rounded-lg border border-devlog-border bg-transparent px-5 py-2.5 text-sm font-medium text-devlog-text transition hover:border-devlog-muted"
              disabled
              title="준비 중"
            >
              나중에 읽기
            </button>
          </div>
        </div>

        {post.featured_image_url && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-devlog-border bg-devlog-card">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}

export function FeaturedPostSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid animate-pulse items-center gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 rounded bg-devlog-card" />
          <div className="h-12 w-full max-w-lg rounded bg-devlog-card" />
          <div className="h-20 w-full max-w-xl rounded bg-devlog-card" />
          <div className="flex gap-3">
            <div className="h-10 w-28 rounded-lg bg-devlog-card" />
            <div className="h-10 w-28 rounded-lg bg-devlog-card" />
          </div>
        </div>
        <div className="aspect-[4/3] rounded-2xl bg-devlog-card" />
      </div>
    </section>
  );
}

export function FeaturedPostPlaceholder() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-dashed border-devlog-border bg-devlog-card/40 px-6 py-16 text-center">
        <p className="text-sm text-devlog-muted">
          아직 추천 게시글이 없습니다. Supabase 마이그레이션과 시드 데이터를
          적용해 주세요.
        </p>
      </div>
    </section>
  );
}
