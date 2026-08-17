import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Quote } from "lucide-react";

import { usePortfolioStore } from "@/shared/store/portfolioStore";

export default function Modal() {
  const { selectedTestimonial, setSelectedTestimonial } = usePortfolioStore();
  const onClose = () => setSelectedTestimonial(null);
  return (
    <AnimatePresence>
      {selectedTestimonial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-neu-bg/80 dark:bg-black/80 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
          >
            <div className="sticky top-0 z-20 flex justify-between items-center p-4 md:p-6 border-b border-gray-200/50 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
              <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-neu-text-muted">
                Full Testimonial
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-white/5 flex items-center justify-center text-neu-text-muted hover:text-neu-text hover:bg-gray-300/50 dark:hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="relative z-10 mb-8">
                <div className="absolute -top-3 -left-2 text-neu-accent/20 z-0 pointer-events-none">
                  <Quote size={48} />
                </div>
                <div className="p-6 md:p-8 rounded-3xl glass-card-inset text-base md:text-lg text-neu-text leading-relaxed font-sans italic relative z-10 bg-neu-bg/40 whitespace-pre-wrap">
                  &ldquo;{selectedTestimonial.testimonial}&rdquo;
                </div>
              </div>

              <div className="pt-4 border-t border-gray-300/30 dark:border-gray-700/30 flex flex-col gap-1">
                {selectedTestimonial.url ? (
                  <a
                    href={selectedTestimonial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-neu-text hover:text-neu-accent hover:underline transition-colors w-fit"
                  >
                    {selectedTestimonial.name}
                  </a>
                ) : (
                  <span className="text-lg font-bold text-neu-text">
                    {selectedTestimonial.name}
                  </span>
                )}
                <span className="text-neu-text-muted">
                  {selectedTestimonial.role}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
