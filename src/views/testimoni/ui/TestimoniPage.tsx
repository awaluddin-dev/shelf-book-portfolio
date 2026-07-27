"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SubmitTestimonial({
  params,
}: Readonly<{ params: Promise<{ token: string }> }>) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    url: "",
    testimonial: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hardcoded simple check for encoded endpoint concept
  if (resolvedParams.token !== "submit-2026") {
    return (
      <div className="min-h-screen bg-neu-bg flex items-center justify-center p-6 text-neu-text">
        <div className="glass-card-inset p-8 rounded-3xl text-center">
          <h1 className="text-xl font-bold text-red-500 mb-2">
            Invalid Endpoint
          </h1>
          <p className="text-sm font-mono text-neu-text-muted">
            This endorsement link is invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const etag = localStorage.getItem("testimoniEtag");
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (etag) headers["X-Submit-ETag"] = etag;

      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });

      if (res.status === 429) {
        throw new Error(
          "Anda telah mengirimkan testimoni hari ini. Silakan coba lagi besok.",
        );
      }

      if (!res.ok) throw new Error("Failed to submit testimonial");

      const responseEtag = res.headers.get("X-Submit-ETag");
      if (responseEtag) localStorage.setItem("testimoniEtag", responseEtag);

      setSubmitted(true);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Terjadi kesalahan. Silakan coba lagi.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neu-bg flex items-center justify-center p-6 text-neu-text">
        <div className="glass-card max-w-md w-full p-10 rounded-3xl text-center border border-white/5">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full glass-card-inset flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3">Thank You!</h1>
          <p className="text-sm text-neu-text-muted font-mono leading-relaxed mb-8">
            Your endorsement has been submitted successfully and will appear on
            the portfolio.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 glass-card rounded-xl text-sm font-bold text-neu-accent hover:scale-[1.02] transition-all"
          >
            Return to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neu-bg flex items-center justify-center p-6 text-neu-text py-12">
      <div className="glass-card w-full max-w-xl rounded-3xl p-6 md:p-10 border border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="text-neu-accent" size={24} />
          <h1 className="text-2xl font-display font-bold">
            Leave an Endorsement
          </h1>
        </div>
        <p className="text-sm text-neu-text-muted font-mono mb-8">
          Thank you for taking the time to share your experience working with
          me.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-mono font-bold uppercase tracking-wider mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                required
                type="text"
                className="w-full px-4 py-3 glass-card-inset rounded-xl focus:outline-none focus:ring-1 focus:ring-neu-accent text-sm"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-xs font-mono font-bold uppercase tracking-wider mb-2"
              >
                Role / Title
              </label>
              <input
                id="role"
                required
                type="text"
                className="w-full px-4 py-3 glass-card-inset rounded-xl focus:outline-none focus:ring-1 focus:ring-neu-accent text-sm"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="e.g. Lead Engineer"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="company"
                className="block text-xs font-mono font-bold uppercase tracking-wider mb-2"
              >
                Company
              </label>
              <input
                id="company"
                required
                type="text"
                className="w-full px-4 py-3 glass-card-inset rounded-xl focus:outline-none focus:ring-1 focus:ring-neu-accent text-sm"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div>
              <label
                htmlFor="url"
                className="block text-xs font-mono font-bold uppercase tracking-wider mb-2"
              >
                LinkedIn / Website URL (Optional)
              </label>
              <input
                id="url"
                type="url"
                className="w-full px-4 py-3 glass-card-inset rounded-xl focus:outline-none focus:ring-1 focus:ring-neu-accent text-sm"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="endors"
              className="block text-xs font-mono font-bold uppercase tracking-wider mb-2"
            >
              Endorsement
            </label>
            <textarea
              id="endors"
              required
              rows={4}
              className="w-full px-4 py-3 glass-card-inset rounded-xl focus:outline-none focus:ring-1 focus:ring-neu-accent text-sm resize-none"
              value={formData.testimonial}
              onChange={(e) =>
                setFormData({ ...formData, testimonial: e.target.value })
              }
              placeholder="Write your testimonial here..."
            />
          </div>
          {errorMsg && (
            <div className="text-red-500 text-sm font-mono p-3 glass-card-inset rounded-xl border border-red-500/20">
              {errorMsg}
            </div>
          )}
          <button
            disabled={loading}
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-neu-accent text-white rounded-xl shadow-neu hover:scale-[1.02] active:scale-95 transition-all font-bold disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit Endorsement"}{" "}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
