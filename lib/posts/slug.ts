export function createPostSlug(title: string): string {
  const asciiSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  if (asciiSlug.length >= 3) {
    return asciiSlug;
  }

  return `post-${Date.now()}`;
}

export function appendSlugSuffix(baseSlug: string, suffix: number): string {
  return `${baseSlug}-${suffix}`.slice(0, 80);
}

export function normalizePostSlug(rawSlug: string): string {
  let slug = rawSlug.trim();

  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (!slug.includes("%")) {
      break;
    }

    try {
      const decoded = decodeURIComponent(slug);

      if (decoded === slug) {
        break;
      }

      slug = decoded;
    } catch {
      break;
    }
  }

  return slug;
}

export function buildPostPath(slug: string): string {
  return `/posts/${normalizePostSlug(slug)}`;
}
