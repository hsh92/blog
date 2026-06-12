import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { formatPublishedDate } from "@/lib/posts/format";
import { createClient } from "@/lib/supabase/server";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post } = await supabase
    .from("posts")
    .select("*, categories(id, name, slug)")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-devlog-bg text-devlog-text">
      <SiteHeader userEmail={user?.email} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex text-sm text-devlog-muted transition hover:text-devlog-text"
        >
          ← 글 목록으로
        </Link>
        <article>
          <header className="mb-8">
            {post.categories && (
              <span className="text-xs text-devlog-accent">
                {post.categories.name}
              </span>
            )}
            <h1 className="mt-2 text-3xl font-bold leading-tight">{post.title}</h1>
            <p className="mt-4 text-sm text-devlog-muted">
              {post.author_name} · {formatPublishedDate(post.published_at)}
            </p>
          </header>
          <p className="leading-relaxed text-devlog-muted">{post.excerpt}</p>
          {post.content && (
            <div className="prose prose-invert mt-8 whitespace-pre-wrap leading-relaxed text-devlog-text">
              {post.content}
            </div>
          )}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
