import Link from "next/link";

type EditorHeaderProps = {
  onPublish: () => void;
  isPublishing: boolean;
};

export function EditorHeader({ onPublish, isPublishing }: EditorHeaderProps) {
  return (
    <header className="border-b border-devlog-border bg-devlog-bg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-devlog-text"
          >
            DevLog
          </Link>
          <span className="rounded-md border border-devlog-border bg-devlog-card px-2 py-0.5 text-xs text-devlog-muted">
            에디터
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-devlog-muted transition hover:text-devlog-text"
          >
            취소
          </Link>
          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            className="rounded-lg bg-devlog-accent px-4 py-2 text-sm font-medium text-devlog-bg transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPublishing ? "발행 중…" : "발행"}
          </button>
        </div>
      </div>
    </header>
  );
}
