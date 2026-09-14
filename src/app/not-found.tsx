'use client';

import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas text-primary p-4 font-sans">
      <div
        className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-card border border-subtle shadow-2xl"
      >
        <div className="flex justify-center">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/30">
            <AlertCircle size={32} />
          </div>
        </div>
        
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">404 - Not Found</span>
          <h1 className="text-2xl font-display font-extrabold tracking-tight text-primary">System Node Missing</h1>
          <p className="text-sm text-secondary font-mono">
            The endpoint or orchestration node you are looking for does not exist in this pipeline.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono font-bold px-4 py-2.5 rounded-xl bg-canvas hover:bg-card text-primary hover:text-white border border-subtle hover:border-subtle-hover transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
