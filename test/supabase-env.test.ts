import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

describe("getSupabaseUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  });

  it("URL 환경 변수를 반환한다", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    expect(getSupabaseUrl()).toBe("https://example.supabase.co");
  });
});

describe("getSupabaseAnonKey", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  });

  it("ANON_KEY를 우선 사용한다", () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key";
    expect(getSupabaseAnonKey()).toBe("anon-key");
  });

  it("PUBLISHABLE_KEY를 대체로 사용한다", () => {
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key";
    expect(getSupabaseAnonKey()).toBe("publishable-key");
  });
});
