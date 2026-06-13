"use server";

import { revalidatePath } from "next/cache";
import { validateCommentBody } from "@/lib/posts/comment-validation";
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

export async function togglePostLikeAction(postId: string, slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "로그인이 필요합니다." };
  }

  const { data: existingLike } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingLike) {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);

    if (error) {
      return { ok: false as const, error: "좋아요 취소에 실패했습니다." };
    }
  } else {
    const { error } = await supabase.from("post_likes").insert({
      post_id: postId,
      user_id: user.id,
    });

    if (error) {
      return { ok: false as const, error: "좋아요에 실패했습니다." };
    }
  }

  revalidatePath(`/posts/${slug}`);
  return { ok: true as const };
}

export async function togglePostBookmarkAction(postId: string, slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "로그인이 필요합니다." };
  }

  const { data: existingBookmark } = await supabase
    .from("post_bookmarks")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingBookmark) {
    const { error } = await supabase
      .from("post_bookmarks")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);

    if (error) {
      return { ok: false as const, error: "저장 취소에 실패했습니다." };
    }
  } else {
    const { error } = await supabase.from("post_bookmarks").insert({
      post_id: postId,
      user_id: user.id,
    });

    if (error) {
      return { ok: false as const, error: "저장에 실패했습니다." };
    }
  }

  revalidatePath(`/posts/${slug}`);
  return { ok: true as const };
}

export async function createCommentAction(
  postId: string,
  slug: string,
  formData: FormData,
) {
  const body = String(formData.get("body") ?? "");
  const validation = validateCommentBody(body);

  if (!validation.valid) {
    return { ok: false as const, error: validation.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "로그인 후 댓글을 작성할 수 있습니다." };
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    author_name: getAuthorDisplayName(user.email, user.id),
    author_avatar_url: getAuthorAvatarUrl(user.id),
    body: validation.body,
  });

  if (error) {
    return { ok: false as const, error: "댓글 게시에 실패했습니다." };
  }

  revalidatePath(`/posts/${slug}`);
  return { ok: true as const };
}
