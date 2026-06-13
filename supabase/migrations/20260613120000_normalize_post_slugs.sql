-- 비 ASCII slug를 URL-safe slug로 변환 (Next.js 라우팅 호환)
UPDATE public.posts
SET slug = 'post-' || floor(extract(epoch FROM created_at) * 1000)::text
WHERE slug !~ '^[a-z0-9-]+$';
