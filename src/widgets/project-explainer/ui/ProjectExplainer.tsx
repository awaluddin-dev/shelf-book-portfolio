'use client';

import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useProjectExplainer, ProjectPayload } from '@/hooks/useProjectExplainer';

interface ProjectExplainerProps {
  project: ProjectPayload;
  /** Optional: auto-trigger explanation when component mounts */
  autoExplain?: boolean;
}

export function ProjectExplainer({ project, autoExplain = false }: ProjectExplainerProps) {
  const { text, status, error, explain, reset } = useProjectExplainer();

  useEffect(() => {
    if (autoExplain) explain(project);
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const isActive = status === 'loading' || status === 'streaming';

  return (
    <div className="mt-4">
      {status === 'idle' && (
        <button
          onClick={() => explain(project)}
          className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
        >
          <SparkleIcon className="h-4 w-4" />
          Explain this project
        </button>
      )}

      {(isActive || status === 'done' || status === 'error') && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/40">
              <SparkleIcon className="h-3.5 w-3.5" />
              AI Explanation
            </span>
            <button
              onClick={reset}
              disabled={isActive}
              aria-label="Close explanation"
              className="rounded p-1 text-white/30 transition-colors hover:text-white/60 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Loading state */}
          {status === 'loading' && (
            <div className="flex items-center gap-2 text-sm text-white/50">
              <span className="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-white/50" />
              Thinking...
            </div>
          )}

          {/* Streaming / done text */}
          {(status === 'streaming' || status === 'done') && (
            <div className="relative">
              <div className="prose prose-sm prose-invert max-w-none text-white/80 leading-relaxed marker:text-white/40 prose-a:text-neu-accent hover:prose-a:text-neu-accent/80 prose-headings:text-white/90 prose-strong:text-white/90 prose-th:text-white/70 prose-td:text-white/60">
                <ReactMarkdown>{text}</ReactMarkdown>
              </div>
              {status === 'streaming' && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-white/60 align-middle" />
              )}
            </div>
          )}

          {/* Error state */}
          {status === 'error' && (
            <div className="space-y-2">
              <p className="text-sm text-red-400">
                {error ?? 'Something went wrong. Please try again.'}
              </p>
              <button
                onClick={() => explain(project)}
                className="text-xs text-white/50 underline underline-offset-2 hover:text-white/80"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Inline icons (no external dep needed) ────────────────────────────────────

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
