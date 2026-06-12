"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category, Post, PostSortOrder } from "@/lib/posts/types";
import { POSTS_PER_PAGE } from "@/lib/posts/types";

type UsePostsOptions = {
  categorySlug: string | null;
  sortOrder: PostSortOrder;
  page: number;
  excludeFeatured?: boolean;
};

type UsePostsResult = {
  posts: Post[];
  totalCount: number;
  loading: boolean;
  error: string | null;
};

export function usePosts({
  categorySlug,
  sortOrder,
  page,
  excludeFeatured = false,
}: UsePostsOptions): UsePostsResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const from = (page - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    const selectShape = categorySlug
      ? "*, categories!inner(id, name, slug)"
      : "*, categories(id, name, slug)";

    let query = supabase
      .from("posts")
      .select(selectShape, { count: "exact" })
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString());

    if (excludeFeatured) {
      query = query.eq("is_featured", false);
    }

    if (categorySlug) {
      query = query.eq("categories.slug", categorySlug);
    }

    query =
      sortOrder === "latest"
        ? query.order("published_at", { ascending: false })
        : query.order("published_at", { ascending: true });

    const { data, error: fetchError, count } = await query.range(from, to);

    if (fetchError) {
      setError(fetchError.message);
      setPosts([]);
      setTotalCount(0);
    } else {
      setPosts((data as Post[]) ?? []);
      setTotalCount(count ?? 0);
    }

    setLoading(false);
  }, [categorySlug, sortOrder, page, excludeFeatured]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  return { posts, totalCount, loading, error };
}

export function useFeaturedPost(): {
  post: Post | null;
  loading: boolean;
  error: string | null;
} {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from("posts")
        .select("*, categories(id, name, slug)")
        .eq("is_featured", true)
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
        setPost(null);
      } else {
        setPost((data as Post | null) ?? null);
      }
      setLoading(false);
    }

    void fetchFeatured();
  }, []);

  return { post, loading, error };
}

export function useCategories(): {
  categories: Category[];
  loading: boolean;
  error: string | null;
} {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
        setCategories([]);
      } else {
        setCategories((data as Category[]) ?? []);
      }
      setLoading(false);
    }

    void fetchCategories();
  }, []);

  return { categories, loading, error };
}
