"use client";

import { useEffect, useState } from "react";
import {
  FeaturedPost,
  FeaturedPostPlaceholder,
  FeaturedPostSkeleton,
} from "@/components/home/featured-post";
import {
  PaginationControls,
  getTotalPages,
} from "@/components/home/pagination-controls";
import { PostCard, PostCardSkeleton } from "@/components/home/post-card";
import type { PostSortOrder } from "@/lib/posts/types";
import { POSTS_PER_PAGE } from "@/lib/posts/types";
import {
  useCategories,
  useFeaturedPost,
  usePosts,
} from "@/lib/posts/use-posts";

export function HomeContent() {
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<PostSortOrder>("latest");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const { categories, loading: categoriesLoading } = useCategories();
  const { post: featuredPost, loading: featuredLoading } = useFeaturedPost();
  const { posts, totalCount, loading, error } = usePosts({
    categorySlug,
    sortOrder,
    page,
    excludeFeatured: true,
  });

  const totalPages = getTotalPages(totalCount, POSTS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [categorySlug, sortOrder]);

  const selectedCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <>
      {featuredLoading ? (
        <FeaturedPostSkeleton />
      ) : featuredPost ? (
        <FeaturedPost post={featuredPost} />
      ) : (
        <FeaturedPostPlaceholder />
      )}

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-devlog-text">최신 인사이트</h2>
            <p className="mt-1 text-sm text-devlog-muted">
              개발자 커뮤니티의 새로운 시각을 확인해보세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-lg border border-devlog-border bg-devlog-card px-3 py-2 text-sm text-devlog-text transition hover:border-devlog-muted"
                aria-expanded={filterOpen}
                aria-haspopup="listbox"
              >
                <svg className="h-4 w-4 text-devlog-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
                </svg>
                필터
                {selectedCategory && (
                  <span className="rounded bg-devlog-bg px-1.5 py-0.5 text-xs text-devlog-accent">
                    {selectedCategory.name}
                  </span>
                )}
              </button>

              {filterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    aria-hidden
                    onClick={() => setFilterOpen(false)}
                  />
                  <ul
                    role="listbox"
                    className="absolute right-0 z-20 mt-2 min-w-[180px] overflow-hidden rounded-lg border border-devlog-border bg-devlog-card py-1 shadow-lg"
                  >
                    <li>
                      <button
                        type="button"
                        role="option"
                        aria-selected={categorySlug === null}
                        onClick={() => {
                          setCategorySlug(null);
                          setFilterOpen(false);
                        }}
                        className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-devlog-bg ${
                          categorySlug === null
                            ? "text-devlog-accent"
                            : "text-devlog-text"
                        }`}
                      >
                        전체
                      </button>
                    </li>
                    {categoriesLoading ? (
                      <li className="px-4 py-2 text-sm text-devlog-muted">
                        불러오는 중…
                      </li>
                    ) : (
                      categories.map((category) => (
                        <li key={category.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={categorySlug === category.slug}
                            onClick={() => {
                              setCategorySlug(category.slug);
                              setFilterOpen(false);
                            }}
                            className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-devlog-bg ${
                              categorySlug === category.slug
                                ? "text-devlog-accent"
                                : "text-devlog-text"
                            }`}
                          >
                            {category.name}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setSortOrder((current) =>
                  current === "latest" ? "oldest" : "latest",
                )
              }
              className="inline-flex items-center gap-2 rounded-lg border border-devlog-border bg-devlog-card px-3 py-2 text-sm text-devlog-text transition hover:border-devlog-muted"
            >
              <svg className="h-4 w-4 text-devlog-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              {sortOrder === "latest" ? "최신순" : "오래된순"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            게시글을 불러오지 못했습니다: {error}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
                <PostCardSkeleton key={index} />
              ))
            : posts.length > 0
              ? posts.map((post) => <PostCard key={post.id} post={post} />)
              : (
                <div className="col-span-full rounded-xl border border-dashed border-devlog-border py-16 text-center text-sm text-devlog-muted">
                  {categorySlug
                    ? "선택한 카테고리에 게시글이 없습니다."
                    : "표시할 게시글이 없습니다."}
                </div>
              )}
        </div>

        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>
    </>
  );
}
