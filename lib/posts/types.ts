export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  featured_image_url: string | null;
  author_name: string;
  author_avatar_url: string | null;
  author_id: string | null;
  category_id: string | null;
  tags: string[];
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories: Pick<Category, "id" | "name" | "slug"> | null;
};

export type PostSortOrder = "latest" | "oldest";

export const POSTS_PER_PAGE = 9;
