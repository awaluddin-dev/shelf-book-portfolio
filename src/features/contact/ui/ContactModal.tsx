import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { useDraftInquiry } from "@/hooks/useDraftInquiry";

import { usePortfolioStore } from "@/shared/store/portfolioStore";

export default function ContactModal() {
  const {
    showInquiryModal: isOpen,
    setShowInquiryModal: onClose,
    inquiryMessage,
    setInquiryMessage,
    draftInquirySource,
    setDraftInquirySource,
    portfolioStatus,
    triggerToast,
  } = usePortfolioStore();

  const { draft, status: draftStatus } = useDraftInquiry();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "contract",
    message: "",
  });

  // Handle Draft Inquiry AI generation
  useEffect(() => {
    if (isOpen && draftInquirySource) {
      setFormData((prev) => ({ ...prev, message: "" })); // clear message before typing
      draft(draftInquirySource, (chunk) => {
        setFormData((prev) => ({ ...prev, message: prev.message + chunk }));
      });
      setDraftInquirySource(null); // consume source
    }
  }, [isOpen, draftInquirySource, draft, setDraftInquirySource]);

  // Prefill message if inquiryMessage exists when modal opens
  useEffect(() => {
    if (isOpen && inquiryMessage) {
      setFormData((prev) => ({ ...prev, message: inquiryMessage }));
    }
  }, [isOpen, inquiryMessage]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

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
        throw new Error(
          "Anda telah mengirimkan pesan hari ini. Silakan coba lagi besok.",
        );
      }

      if (!res.ok) throw new Error("Failed to send inquiry");

      const responseEtag = res.headers.get("X-Submit-ETag");
      if (responseEtag) localStorage.setItem("inquiryEtag", responseEtag);

      triggerToast("Availability inquiry sent successfully! Thank you.");
      onClose(false);
      setInquiryMessage(""); // clear message from store
      setFormData({
        name: "",
        email: "",
        projectType: "contract",
        message: "",
      });
    } catch (error: any) {
      triggerToast(
        error.message || "Failed to send inquiry. Please try again later.",
      );
    }
  };
  return (
    <>
      {/* Quick-Send Availability Inquiry Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              onClose(false);
              setInquiryMessage("");
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-neu-bg rounded-3xl shadow-neu-modal w-full max-w-lg p-6 sm:p-8 relative border border-white/5"
            >
              <button
                type="button"
                onClick={() => {
                  onClose(false);
                  setInquiryMessage("");
                }}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neu-text transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 text-neu-accent mb-3">
                <Sparkles size={18} className="animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  Availability Inquiry
                </span>
              </div>

              <h3 className="text-2xl font-display font-bold text-neu-text mb-2">
                Work with Awaluddin
              </h3>

              <p className="text-sm text-neu-text-muted mb-6 leading-relaxed">
                Awaluddin is currently{" "}
                <span
                  className={cn(
                    "font-bold",
                    portfolioStatus === "available"
                      ? "text-green-500"
                      : "text-amber-500",
                  )}
                >
                  {portfolioStatus === "available"
                    ? "Available for projects"
                    : "Currently busy. Submit your inquiry below and get a reply within 24 hours."}
                </span>
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name-contact"
                    className="block text-xs font-mono text-neu-text-muted mb-1.5 uppercase font-bold"
                  >
                    Your Name
                  </label>
                  <input
                    id="name-contact"
                    type="text"
                    required
                    placeholder="E.g., Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl glass-card-inset text-neu-text placeholder-neu-text-muted focus:outline-none focus:ring-0 transition-all border border-transparent focus:border-neu-accent/20 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email-contact"
                    className="block text-xs font-mono text-neu-text-muted mb-1.5 uppercase font-bold"
                  >
                    Your Email
                  </label>
                  <input
                    id="email-contact"
                    type="email"
                    required
                    placeholder="E.g., sarah@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl glass-card-inset text-neu-text placeholder-neu-text-muted focus:outline-none focus:ring-0 transition-all border border-transparent focus:border-neu-accent/20 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="project-contact"
                    className="block text-xs font-mono text-neu-text-muted mb-1.5 uppercase font-bold"
                  >
                    Project Type
                  </label>
                  <select
                    id="project-contact"
                    value={formData.projectType}
                    onChange={(e) =>
                      setFormData({ ...formData, projectType: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl glass-card text-neu-text focus:outline-none focus:ring-0 transition-all border border-transparent focus:border-neu-accent/20 text-sm"
                  >
                    <option
                      className="bg-white dark:bg-zinc-900 text-neu-text"
                      value="contract"
                    >
                      Freelance / Contract Project
                    </option>
                    <option
                      className="bg-white dark:bg-zinc-900 text-neu-text"
                      value="fulltime"
                    >
                      Full-time Opportunity
                    </option>
                    <option
                      className="bg-white dark:bg-zinc-900 text-neu-text"
                      value="consulting"
                    >
                      Architecture Advisory / Consulting
                    </option>
                    <option
                      className="bg-white dark:bg-zinc-900 text-neu-text"
                      value="other"
                    >
                      Other Inquiry
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message-contact"
                    className="block text-xs font-mono text-neu-text-muted mb-1.5 uppercase font-bold flex items-center gap-2"
                  >
                    Message
                    {(draftStatus === "loading" ||
                      draftStatus === "streaming") && (
                      <span className="text-[10px] text-neu-accent animate-pulse normal-case font-normal flex items-center gap-1">
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
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl glass-card-inset text-neu-text placeholder-neu-text-muted focus:outline-none focus:ring-0 transition-all resize-none border border-transparent focus:border-neu-accent/20 text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-white bg-neu-accent shadow-neu hover:shadow-neu-sm hover:scale-[1.01] active:scale-95 transition-all mt-2 text-sm"
                >
                  Send Inquiry
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
