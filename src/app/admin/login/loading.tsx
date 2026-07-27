import { Lock } from "lucide-react";

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-neu-bg flex items-center justify-center p-6 text-neu-text">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full glass-card-inset flex items-center justify-center animate-pulse mb-6 relative">
          <div className="absolute inset-0 rounded-full border-[3px] border-neu-accent border-t-transparent animate-spin"></div>
          <Lock className="text-neu-accent animate-pulse" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 font-display tracking-tight text-neu-text/50">
          Securing Connection
        </h1>
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-neu-accent animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-neu-accent animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-neu-accent animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
