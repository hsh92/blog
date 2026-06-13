import Link from "next/link";
import { signOutAction } from "@/app/login/actions";

type SiteHeaderProps = {
  userEmail?: string | null;
};

export function SiteHeader({ userEmail }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-devlog-border bg-devlog-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-devlog-text"
          >
            DevLog
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-devlog-muted md:flex">
            <Link
              href="/"
              className="border-b-2 border-devlog-accent pb-0.5 text-devlog-text transition hover:text-devlog-text"
            >
              글 목록
            </Link>
            <Link href="#" className="transition hover:text-devlog-text">
              문서
            </Link>
          </nav>
        </div>

        <div className="mx-auto hidden max-w-md flex-1 md:block">
          <label className="relative block">
            <span className="sr-only">기사 검색</span>
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-devlog-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
            <input
              type="search"
              placeholder="기사 검색..."
              className="w-full rounded-lg border border-devlog-border bg-devlog-input py-2 pl-10 pr-4 text-sm text-devlog-text placeholder:text-devlog-muted focus:border-devlog-accent focus:outline-none focus:ring-1 focus:ring-devlog-accent"
              disabled
              aria-disabled
              title="검색 기능은 준비 중입니다"
            />
          </label>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {userEmail ? (
            <>
              <Link
                href="/write"
                className="hidden text-sm text-devlog-muted transition hover:text-devlog-text sm:inline"
              >
                글쓰기
              </Link>
              <span className="hidden max-w-[160px] truncate text-sm text-devlog-muted sm:inline">
                {userEmail}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="text-sm text-devlog-muted transition hover:text-devlog-text"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-devlog-muted transition hover:text-devlog-text"
              >
                로그인
              </Link>
              <Link
                href="/login?tab=signup"
                className="rounded-lg bg-devlog-accent px-4 py-2 text-sm font-medium text-devlog-bg transition hover:bg-sky-300"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
