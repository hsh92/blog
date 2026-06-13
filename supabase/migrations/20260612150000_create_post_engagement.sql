-- 게시글 좋아요·저장·댓글

CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id UUID NOT NULL REFERENCES public.posts (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS post_likes_post_id_idx ON public.post_likes (post_id);

CREATE TABLE IF NOT EXISTS public.post_bookmarks (
  post_id UUID NOT NULL REFERENCES public.posts (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS post_bookmarks_user_id_idx ON public.post_bookmarks (user_id);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts (id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar_url TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_post_id_created_at_idx
  ON public.comments (post_id, created_at DESC);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- post_likes
DROP POLICY IF EXISTS "post_likes_select_public" ON public.post_likes;
CREATE POLICY "post_likes_select_public"
  ON public.post_likes
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "post_likes_insert_own" ON public.post_likes;
CREATE POLICY "post_likes_insert_own"
  ON public.post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "post_likes_delete_own" ON public.post_likes;
CREATE POLICY "post_likes_delete_own"
  ON public.post_likes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- post_bookmarks
DROP POLICY IF EXISTS "post_bookmarks_select_own" ON public.post_bookmarks;
CREATE POLICY "post_bookmarks_select_own"
  ON public.post_bookmarks
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "post_bookmarks_insert_own" ON public.post_bookmarks;
CREATE POLICY "post_bookmarks_insert_own"
  ON public.post_bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "post_bookmarks_delete_own" ON public.post_bookmarks;
CREATE POLICY "post_bookmarks_delete_own"
  ON public.post_bookmarks
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- comments: 발행된 글의 댓글만 공개
DROP POLICY IF EXISTS "comments_select_published" ON public.comments;
CREATE POLICY "comments_select_published"
  ON public.comments
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.posts
      WHERE posts.id = comments.post_id
        AND posts.published_at IS NOT NULL
        AND posts.published_at <= now()
    )
  );

DROP POLICY IF EXISTS "comments_insert_authenticated" ON public.comments;
CREATE POLICY "comments_insert_authenticated"
  ON public.comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.posts
      WHERE posts.id = comments.post_id
        AND posts.published_at IS NOT NULL
        AND posts.published_at <= now()
    )
  );

DROP POLICY IF EXISTS "comments_delete_own" ON public.comments;
CREATE POLICY "comments_delete_own"
  ON public.comments
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 데모 댓글 (시드)
INSERT INTO public.comments (id, post_id, user_id, author_name, author_avatar_url, body, created_at)
SELECT
  'c1000000-0000-4000-8000-000000000001',
  p.id,
  NULL,
  'Sarah Chen',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
  '동시성 렌더링 도입 후 Suspense 경계 설계가 훨씬 중요해졌다는 점에 공감합니다. 팀 내 가이드 문서 공유 부탁드려요!',
  now() - interval '2 hours'
FROM public.posts p
WHERE p.slug = 'react-19-concurrent-rendering'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.comments (id, post_id, user_id, author_name, author_avatar_url, body, created_at)
SELECT
  'c1000000-0000-4000-8000-000000000002',
  p.id,
  NULL,
  'Marcus Thorne',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
  'Server Component 예제가 바로 적용 가능해서 좋네요. Actions API와 함께 쓰면 폼 처리도 깔끔해질 것 같습니다.',
  now() - interval '5 hours'
FROM public.posts p
WHERE p.slug = 'react-19-concurrent-rendering'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.comments (id, post_id, user_id, author_name, author_avatar_url, body, created_at)
SELECT
  'c1000000-0000-4000-8000-000000000003',
  p.id,
  NULL,
  'Kim Minji',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=minji',
  '마이그레이션은 점진적으로 진행하는 게 맞는 것 같아요. 우리 팀도 Client 경계부터 정리 중입니다.',
  now() - interval '1 day'
FROM public.posts p
WHERE p.slug = 'react-19-concurrent-rendering'
ON CONFLICT (id) DO NOTHING;
