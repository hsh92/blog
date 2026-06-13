import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostDetail } from "@/components/post/post-detail";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPostComments, getPostEngagement } from "@/lib/posts/get-engagement";
import { getPostBySlug } from "@/lib/posts/get-post";
import { buildPostPath, normalizePostSlug } from "@/lib/posts/slug";
import { createClient } from "@/lib/supabase/server";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "게시글을 찾을 수 없습니다" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const canonicalSlug = normalizePostSlug(post.slug);
  const shareUrl = `${getSiteUrl()}${buildPostPath(canonicalSlug)}`;

  const [engagement, comments] = await Promise.all([
    getPostEngagement(post.id, user?.id ?? null),
    getPostComments(post.id),
  ]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-devlog-bg text-devlog-text">
      <SiteHeader userEmail={user?.email} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
        <PostDetail
          post={post}
          shareUrl={shareUrl}
          engagement={engagement}
          comments={comments}
          isAuthenticated={Boolean(user)}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
