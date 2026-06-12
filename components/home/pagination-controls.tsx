"use client";

import {
  clampPage,
  getPageRange,
  getTotalPages,
} from "@/lib/posts/pagination";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const safePage = clampPage(currentPage, totalPages);
  const pages = getPageRange(safePage, totalPages);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-1"
      aria-label="페이지네이션"
    >
      <button
        type="button"
        onClick={() => onPageChange(safePage - 1)}
        disabled={safePage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-devlog-border text-devlog-muted transition hover:border-devlog-muted hover:text-devlog-text disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="이전 페이지"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages[0] > 1 && (
        <>
          <PageButton page={1} current={safePage} onClick={onPageChange} />
          {pages[0] > 2 && (
            <span className="px-1 text-devlog-muted" aria-hidden>
              …
            </span>
          )}
        </>
      )}

      {pages.map((page) => (
        <PageButton
          key={page}
          page={page}
          current={safePage}
          onClick={onPageChange}
        />
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-devlog-muted" aria-hidden>
              …
            </span>
          )}
          <PageButton
            page={totalPages}
            current={safePage}
            onClick={onPageChange}
          />
        </>
      )}

      <button
        type="button"
        onClick={() => onPageChange(safePage + 1)}
        disabled={safePage >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-devlog-border text-devlog-muted transition hover:border-devlog-muted hover:text-devlog-text disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="다음 페이지"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

function PageButton({
  page,
  current,
  onClick,
}: {
  page: number;
  current: number;
  onClick: (page: number) => void;
}) {
  const isActive = page === current;

  return (
    <button
      type="button"
      onClick={() => onClick(page)}
      aria-current={isActive ? "page" : undefined}
      className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
        isActive
          ? "bg-devlog-accent text-devlog-bg"
          : "border border-devlog-border text-devlog-muted hover:border-devlog-muted hover:text-devlog-text"
      }`}
    >
      {page}
    </button>
  );
}

export { getTotalPages };
