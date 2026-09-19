"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Send, CheckCircle, FileText } from "lucide-react";
import { usePortfolioStore } from "@/shared/store/portfolioStore";
import { useDraftInquiry } from "@/hooks/useDraftInquiry";
import { cn } from "@/shared/lib/utils";
import { LeftPanel } from "@/widgets/left-panel/ui/LeftPanel";

export default function InquiryPage() {
  const {
    dynamicHeroConfig,
    inquiryMessage,
    setInquiryMessage,
    draftInquirySource,
    setDraftInquirySource,
    portfolioStatus,
    triggerToast,
  } = usePortfolioStore();

  const { draft, status: draftStatus } = useDraftInquiry();
  const [formData, setFormData] = useState(() => ({
    name: "",
    email: "",
    projectType: "contract",
    message: inquiryMessage || "",
  }));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Draft Inquiry AI generation
  useEffect(() => {
    if (!draftInquirySource) return;

    const source = draftInquirySource;
    setDraftInquirySource(null);
    queueMicrotask(() => {
      setFormData((prev) => ({ ...prev, message: "" }));
      draft(source, (chunk) => {
        setFormData((prev) => ({ ...prev, message: prev.message + chunk }));
      });
    });
  }, [draftInquirySource, draft, setDraftInquirySource]);

  // Sync inquiryMessage if updated externally
  useEffect(() => {
    if (inquiryMessage) {
      queueMicrotask(() => {
        setFormData((prev) => ({ ...prev, message: inquiryMessage }));
      });
    }
  }, [inquiryMessage]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const etag = localStorage.getItem("inquiryEtag");
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (etag) headers["X-Submit-ETag"] = etag;

      const res = await fetch("/api/contact/inquiry", {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });

      if (res.status === 429) {
        throw new Error("Anda telah mengirimkan pesan hari ini. Silakan coba lagi besok.");
      }

      if (!res.ok) throw new Error("Failed to send inquiry");

      const responseEtag = res.headers.get("X-Submit-ETag");
      if (responseEtag) localStorage.setItem("inquiryEtag", responseEtag);

      triggerToast("Availability inquiry sent successfully! Thank you.");
      setIsSubmitted(true);
      setInquiryMessage("");
      setFormData({
        name: "",
        email: "",
        projectType: "contract",
        message: "",
      });
    } catch (error: any) {
      triggerToast(error.message || "Failed to send inquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-subtle selection:text-primary relative bg-canvas text-secondary">
      {/* Mobile Sticky Top Bar (<lg) */}
      <div className="lg:hidden sticky top-0 z-40 w-full bg-canvas border-b border-subtle px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-display font-bold text-sm text-primary hover:text-brand transition-colors">
            {dynamicHeroConfig?.name || "Awaluddin"}
          </Link>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-status/10 text-status border border-status/30">
            <span className="w-1.5 h-1.5 rounded-full bg-status animate-pulse" />
            Available
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <a
            href="/assets/resume/Awaluddin_cv.pdf"
            target="_blank"
            rel="noreferrer noopener"
            className="px-2.5 py-1 rounded-lg bg-card border border-subtle text-secondary hover:text-primary hover:border-subtle-hover transition-colors flex items-center gap-1"
          >
            <FileText size={11} className="text-brand" />
            <span>Resume</span>
          </a>
          <a
            href="https://sb.awaluddin.dev/docs"
            target="_blank"
            rel="noreferrer noopener"
            className="px-2.5 py-1 rounded-lg bg-card border border-subtle text-brand hover:text-primary hover:border-subtle-hover transition-colors"
          >
            API Docs
          </a>
        </div>
      </div>

      {/* Main 2-Column Container */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-12 xl:gap-16">
          {/* A. KOLOM KIRI (Sticky Left Column) */}
          <LeftPanel isSubPage={true} />

          {/* B. KOLOM KANAN (Inquiry Form) */}
          <div className="pt-12 lg:w-[62%] xl:w-[65%] lg:py-24 space-y-8">
            {/* Back Navigation */}
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-primary transition-colors group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-brand" />
                <span>Back to Overview</span>
              </Link>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-3xl p-6 sm:p-8 border border-subtle shadow-xl">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-status/10 text-status border border-status/30 flex items-center justify-center mx-auto">
                    <CheckCircle size={24} />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-primary">Message Received!</h2>
                  <p className="text-sm text-secondary max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. I will review your inquiry and get back to you within 24 hours.
                  </p>
                  <div className="pt-4">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs font-mono text-white bg-emerald-500 hover:bg-emerald-600 transition-all"
                    >
                      Return to Home
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-2 text-brand mb-3">
                    <Sparkles size={18} className="animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">
                      Availability Inquiry
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-2">
                    Work with Awaluddin
                  </h1>

                  <p className="text-sm text-secondary mb-6 leading-relaxed">
                    Awaluddin is currently{" "}
                    <span
                      className={cn(
                        "font-bold",
                        portfolioStatus === "available"
                          ? "text-status"
                          : "text-amber-400"
                      )}
                    >
                      {portfolioStatus === "available"
                        ? "Available for projects"
                        : "Currently busy. Submit your inquiry below and get a reply within 24 hours."}
                    </span>
                  </p>

                  {/* Form */}
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="name-contact"
                        className="block text-xs font-mono text-muted mb-1.5 uppercase font-bold"
                      >
                        Your Name
                      </label>
                      <input
                        id="name-contact"
                        type="text"
                        required
                        placeholder="E.g., Sarah Jenkins"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-canvas text-primary placeholder-muted focus:outline-none transition-all border border-subtle focus:border-subtle-hover text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email-contact"
                        className="block text-xs font-mono text-muted mb-1.5 uppercase font-bold"
                      >
                        Your Email
                      </label>
                      <input
                        id="email-contact"
                        type="email"
                        required
                        placeholder="E.g., sarah@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-canvas text-primary placeholder-muted focus:outline-none transition-all border border-subtle focus:border-subtle-hover text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="project-contact"
                        className="block text-xs font-mono text-muted mb-1.5 uppercase font-bold"
                      >
                        Project Type
                      </label>
                      <select
                        id="project-contact"
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-canvas text-primary focus:outline-none transition-all border border-subtle focus:border-subtle-hover text-sm"
                      >
                        <option className="bg-card text-primary" value="contract">
                          Freelance / Contract Project
                        </option>
                        <option className="bg-card text-primary" value="fulltime">
                          Full-time Opportunity
                        </option>
                        <option className="bg-card text-primary" value="consulting">
                          Architecture Advisory / Consulting
                        </option>
                        <option className="bg-card text-primary" value="other">
                          Other Inquiry
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message-contact"
                        className="block text-xs font-mono text-muted mb-1.5 uppercase font-bold flex items-center gap-2"
                      >
                        Message
                        {(draftStatus === "loading" || draftStatus === "streaming") && (
                          <span className="text-[10px] text-brand animate-pulse normal-case font-normal flex items-center gap-1">
                            <Sparkles size={10} /> AI is drafting...
                          </span>
                        )}
                      </label>
                      <textarea
                        id="message-contact"
                        rows={4}
                        required
                        placeholder="Briefly describe your project goals, stack, or role details..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-canvas text-primary placeholder-muted focus:outline-none transition-all resize-none border border-subtle focus:border-subtle-hover text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all mt-2 text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <Send size={15} />
                      <span>{isSubmitting ? "Sending..." : "Send Inquiry"}</span>
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Footer */}
            <footer className="pt-16 border-t border-subtle/60 text-left text-xs font-mono text-muted">
              <p>
                Crafted with Next.js, Tailwind CSS, & Motion.
                © {new Date().getFullYear()} {dynamicHeroConfig?.name || "Awaluddin"}.
                All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
