import type { PostEngagement } from "@/lib/posts/engagement";
import { createClient } from "@/lib/supabase/server";
import type { Comment } from "@/lib/posts/engagement";

export async function getPostEngagement(
  postId: string,
  userId: string | null,
): Promise<PostEngagement> {
  const supabase = await createClient();

  const { count: likeCount } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  let isLiked = false;
  let isBookmarked = false;

  if (userId) {
    const [{ data: likeRow }, { data: bookmarkRow }] = await Promise.all([
      supabase
        .from("post_likes")
        .select("post_id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("post_bookmarks")
        .select("post_id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

    isLiked = Boolean(likeRow);
    isBookmarked = Boolean(bookmarkRow);
  }

  return {
    likeCount: likeCount ?? 0,
    isLiked,
    isBookmarked,
  };
}

export async function getPostComments(postId: string): Promise<Comment[]> {
  const supabase = await createClient();

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  return comments ?? [];
}
