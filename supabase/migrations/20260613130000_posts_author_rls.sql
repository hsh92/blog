-- 게시글 작성자(author_id) 연결 및 글 생성 RLS 정책

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS posts_author_id_idx ON public.posts (author_id);

COMMENT ON COLUMN public.posts.author_id IS 'Supabase Auth 사용자 ID. 시드/레거시 글은 NULL일 수 있음.';

-- 기존 posts RLS 정책 교체
DROP POLICY IF EXISTS "posts_select_published" ON public.posts;
DROP POLICY IF EXISTS "posts_insert_authenticated" ON public.posts;
DROP POLICY IF EXISTS "posts_update_authenticated" ON public.posts;
DROP POLICY IF EXISTS "posts_delete_authenticated" ON public.posts;

-- anon: 발행된 글만 조회
DROP POLICY IF EXISTS "posts_select_published_anon" ON public.posts;
CREATE POLICY "posts_select_published_anon"
  ON public.posts
  FOR SELECT
  TO anon
  USING (published_at IS NOT NULL AND published_at <= now());

-- authenticated: 발행된 글 + 본인 작성 글(초안 포함) 조회
DROP POLICY IF EXISTS "posts_select_published_or_own" ON public.posts;
CREATE POLICY "posts_select_published_or_own"
  ON public.posts
  FOR SELECT
  TO authenticated
  USING (
    (published_at IS NOT NULL AND published_at <= now())
    OR author_id = auth.uid()
  );

-- authenticated: 로그인 사용자 본인 계정으로만 글 생성
DROP POLICY IF EXISTS "posts_insert_own" ON public.posts;
CREATE POLICY "posts_insert_own"
  ON public.posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND is_featured = false
    AND char_length(trim(title)) >= 1
    AND char_length(trim(slug)) >= 1
    AND char_length(trim(excerpt)) >= 1
  );

-- authenticated: 본인 글만 수정 (추천 글 승격 불가)
DROP POLICY IF EXISTS "posts_update_own" ON public.posts;
CREATE POLICY "posts_update_own"
  ON public.posts
  FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (
    author_id = auth.uid()
    AND is_featured = false
  );

-- authenticated: 본인 글만 삭제
DROP POLICY IF EXISTS "posts_delete_own" ON public.posts;
CREATE POLICY "posts_delete_own"
  ON public.posts
  FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());
