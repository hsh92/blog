import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-devlog-border bg-devlog-bg">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="text-sm font-bold text-devlog-text">DevLog</span>
          <p className="text-xs text-devlog-muted">
            © 2024 DEVLOG. 개발자를 위해 구축되었습니다.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-devlog-muted">
          <Link href="/" className="transition hover:text-devlog-text">
            게시글
          </Link>
          <Link href="#" className="transition hover:text-devlog-text">
            문서
          </Link>
          <Link href="#" className="transition hover:text-devlog-text">
            개인정보 처리방침
          </Link>
          <Link href="#" className="transition hover:text-devlog-text">
            이용약관
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-devlog-text"
          >
            Github
          </a>
          <Link href="#" className="transition hover:text-devlog-text">
            RSS
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-devlog-muted">
          <button
            type="button"
            className="rounded p-1 transition hover:text-devlog-text"
            aria-label="화면 모드"
            disabled
            title="준비 중"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded p-1 transition hover:text-devlog-text"
            aria-label="언어"
            disabled
            title="준비 중"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
