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
          <div className="absolute inset-0 bg-black/80" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-card border border-subtle shadow-2xl rounded-3xl overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
          >
            <div className="sticky top-0 z-20 flex justify-between items-center p-4 md:p-6 border-b border-subtle bg-canvas">
              <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-brand">
                Full Testimonial
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-canvas border border-subtle flex items-center justify-center text-secondary hover:text-primary hover:border-subtle-hover transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="relative z-10 mb-8">
                <div className="absolute -top-3 -left-2 text-brand/20 z-0 pointer-events-none">
                  <Quote size={48} />
                </div>
                <div className="p-6 md:p-8 rounded-2xl border border-subtle text-base md:text-lg text-primary leading-relaxed font-sans italic relative z-10 bg-canvas whitespace-pre-wrap">
                  &ldquo;{selectedTestimonial.testimonial}&rdquo;
                </div>
              </div>

              <div className="pt-4 border-t border-subtle flex flex-col gap-1">
                {selectedTestimonial.url ? (
                  <a
                    href={selectedTestimonial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-primary hover:text-brand hover:underline transition-colors w-fit"
                  >
                    {selectedTestimonial.name}
                  </a>
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {selectedTestimonial.name}
                  </span>
                )}
                <span className="text-muted text-sm">
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
