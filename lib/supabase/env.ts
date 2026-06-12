function trim(value: string | undefined): string {
  return value?.trim() ?? "";
}

/**
 * Next.js는 `process.env.NEXT_PUBLIC_*`를 정적 접근할 때만
 * 클라이언트 번들에 인라인합니다. 동적 키 접근(`process.env[name]`)은
 * 브라우저에서 undefined가 되므로 반드시 직접 참조해야 합니다.
 */
export function getSupabaseUrl(): string {
  return trim(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

/** Supabase anon key (legacy) 또는 publishable key (신규 대시보드 명칭) */
export function getSupabaseAnonKey(): string {
  const anonKey = trim(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (anonKey) {
    return anonKey;
  }
  return trim(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function assertSupabaseEnv(): { url: string; anonKey: string } {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey) {
    throw new Error(
      "Supabase 환경 변수가 설정되지 않았습니다. .env 또는 .env.local에 " +
        "NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "(또는 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)를 추가해 주세요.",
    );
  }

  return { url, anonKey };
}
