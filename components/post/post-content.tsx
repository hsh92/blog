import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PostContentProps = {
  content: string;
};

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="post-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 text-3xl font-bold tracking-tight text-devlog-text first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-10 mb-4 text-xl font-bold tracking-tight text-devlog-text first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 mb-3 text-lg font-semibold text-devlog-text">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-5 text-base leading-8 text-devlog-muted">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-5 list-disc space-y-2 pl-6 text-devlog-muted">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-5 list-decimal space-y-2 pl-6 text-devlog-muted">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-7 text-devlog-muted">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-5 border-l-2 border-devlog-accent pl-4 text-devlog-muted italic">
              {children}
            </blockquote>
          ),
          pre: ({ children }) => (
            <pre className="mb-6 overflow-x-auto rounded-xl border border-devlog-border bg-devlog-input p-4 text-sm leading-6">
              {children}
            </pre>
          ),
          code: ({ className, children }) => {
            const isBlock = Boolean(className);

            if (isBlock) {
              return (
                <code className="font-mono text-[0.875rem] text-devlog-text">
                  {children}
                </code>
              );
            }

            return (
              <code className="rounded bg-devlog-card px-1.5 py-0.5 font-mono text-sm text-devlog-accent">
                {children}
              </code>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-devlog-accent underline-offset-2 transition hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-devlog-text">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
