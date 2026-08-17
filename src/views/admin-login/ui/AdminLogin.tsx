"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, User } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, turnstileToken }),
      });

      if (!res.ok) throw new Error("Login failed");

      const resData = await res.json();
      const token = resData.data?.access_token || resData.access_token;
      const refreshToken = resData.data?.refresh_token || resData.refresh_token;

      if (token) {
        localStorage.setItem("isAdmin", "true"); // kept for backwards compatibility in UI state
        localStorage.setItem("token", token);
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
        router.push("/admin/dashboard");
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-neu-bg flex items-center justify-center p-6 text-neu-text">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 border border-white/5">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full glass-card-inset flex items-center justify-center">
            <Lock className="text-neu-accent" size={24} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Admin Portal</h1>
        <p className="text-sm text-neu-text-muted text-center mb-8 font-mono">
          Secure access for site owner
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email-log-in"
              className="block text-xs font-mono font-bold uppercase tracking-wider mb-2"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neu-text-muted">
                <User size={16} />
              </div>
              <input
                id="email-log-in"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
                className="w-full pl-10 pr-4 py-3 glass-card-inset rounded-xl focus:outline-none focus:ring-1 focus:ring-neu-accent"
                placeholder="Enter email..."
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password-log-in"
              className="block text-xs font-mono font-bold uppercase tracking-wider mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neu-text-muted">
                <Lock size={16} />
              </div>
              <input
                id="password-log-in"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="w-full pl-10 pr-4 py-3 glass-card-inset rounded-xl focus:outline-none focus:ring-1 focus:ring-neu-accent"
                placeholder="Enter password..."
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2">
                Incorrect credentials. Please try again.
              </p>
            )}
          </div>
          <div className="flex justify-center mt-4 mb-2">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !turnstileToken}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neu-accent text-white rounded-xl shadow-neu hover:scale-[1.02] active:scale-95 transition-all font-bold disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
