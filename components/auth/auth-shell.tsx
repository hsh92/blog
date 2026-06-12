import Link from "next/link";

type AuthShellProps = {
  children: React.ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-devlog-bg text-devlog-text">
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="flex flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-devlog-muted sm:flex-row">
        <p>© 2024 DevLog. 개발자를 위해 만들어졌습니다.</p>
        <nav className="flex gap-4">
          <Link href="#" className="transition hover:text-devlog-text">
            문서
          </Link>
          <Link href="#" className="transition hover:text-devlog-text">
            개인정보처리방침
          </Link>
          <Link href="#" className="transition hover:text-devlog-text">
            약관
          </Link>
        </nav>
      </footer>
    </div>
  );
}
