"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AppError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error("Unhandled App Router Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas text-primary p-4 font-sans">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-card border border-subtle shadow-2xl">
        <div className="flex justify-center">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/30">
            <AlertTriangle size={32} />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase">
            System Error
          </span>
          <h1 className="text-2xl font-display font-extrabold tracking-tight text-primary">
            Orchestration Failure
          </h1>
          <p className="text-sm text-secondary font-mono">
            An unexpected error occurred in the execution engine.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold px-4 py-2.5 rounded-xl bg-canvas hover:bg-card text-primary hover:text-white border border-subtle hover:border-subtle-hover transition-colors"
          >
            <RefreshCw size={14} /> Retry Process
          </button>
        </div>
      </div>
    </div>
  );
}
