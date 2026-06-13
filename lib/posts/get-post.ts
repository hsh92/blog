import type { Post } from "@/lib/posts/types";
import { normalizePostSlug } from "@/lib/posts/slug";
import { createClient } from "@/lib/supabase/server";

export async function getPostBySlug(rawSlug: string): Promise<Post | null> {
  const supabase = await createClient();
  const slug = normalizePostSlug(rawSlug);

  const { data: post } = await supabase
    .from("posts")
    .select("*, categories(id, name, slug)")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  return (post as Post | null) ?? null;
}
