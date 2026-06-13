export type Comment = {
  id: string;
  post_id: string;
  user_id: string | null;
  author_name: string;
  author_avatar_url: string | null;
  body: string;
  created_at: string;
};

export type PostEngagement = {
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
};
