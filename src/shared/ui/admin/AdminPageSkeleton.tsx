import React from 'react';

export function AdminPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6 w-full animate-pulse">
      <div className="h-10 bg-white/5 rounded-xl w-1/4"></div>
      <div className="h-20 bg-white/5 rounded-2xl w-full"></div>
      <div className="h-64 bg-white/5 rounded-3xl w-full"></div>
      <div className="h-20 bg-white/5 rounded-2xl w-full"></div>
    </div>
  );
}
