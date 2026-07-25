'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('Unhandled App Router Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-4 font-sans">
      <div
        className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm"
      >
        <div className="flex justify-center">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20">
            <AlertTriangle size={32} />
          </div>
        </div>
        
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-rose-500 uppercase">System Error</span>
          <h1 className="text-2xl font-display font-extrabold tracking-tight">Orchestration Failure</h1>
          <p className="text-sm text-zinc-400 font-mono">
            An unexpected error occurred in the execution engine.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/50 transition-all duration-200 cursor-pointer"
          >
            <RefreshCw size={14} /> Retry Process
          </button>
        </div>
      </div>
    </div>
  );
}
