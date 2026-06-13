-- Unsplash에서 제거된 featured image URL 교체
UPDATE public.posts
SET featured_image_url = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop'
WHERE slug = 'react-19-concurrent-rendering'
  AND featured_image_url = 'https://images.unsplash.com/photo-1511467687858-23d96c786e82?w=1200&h=800&fit=crop';
