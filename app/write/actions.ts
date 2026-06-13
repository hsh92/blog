"use server";

import { revalidatePath } from "next/cache";
import {
  createExcerptFromMarkdown,
  validatePostDraft,
} from "@/lib/posts/post-validation";
import { appendSlugSuffix, createPostSlug } from "@/lib/posts/slug";
import { createClient } from "@/lib/supabase/server";

function getAuthorDisplayName(email: string | undefined, userId: string) {
  if (email) {
    return email.split("@")[0] ?? "User";
  }

  return `User-${userId.slice(0, 8)}`;
}

function getAuthorAvatarUrl(userId: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userId)}`;
}

async function ensureUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  baseSlug: string,
) {
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const { data } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) {
      return slug;
    }

    slug = appendSlugSuffix(baseSlug, suffix);
    suffix += 1;
  }
}

export type PublishPostResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

export async function publishPostAction(input: {
  title: string;
  content: string;
}): Promise<PublishPostResult> {
  const validation = validatePostDraft(input.title, input.content);

  if (!validation.valid) {
    return { ok: false, error: validation.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "로그인 후 게시글을 발행할 수 있습니다." };
  }

  const baseSlug = createPostSlug(validation.title);
  const slug = await ensureUniqueSlug(supabase, baseSlug);
  const excerpt = createExcerptFromMarkdown(validation.content);

  const { error } = await supabase.from("posts").insert({
    title: validation.title,
    slug,
    excerpt,
    content: validation.content,
    author_id: user.id,
    author_name: getAuthorDisplayName(user.email, user.id),
    author_avatar_url: getAuthorAvatarUrl(user.id),
    tags: [],
    is_featured: false,
    published_at: new Date().toISOString(),
  });

  if (error) {
    return { ok: false, error: "게시글 발행에 실패했습니다. 다시 시도해 주세요." };
  }

  revalidatePath("/");
  revalidatePath(`/posts/${slug}`);

  return { ok: true as const, slug };
}
