import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { CoverLetterGenerator } from "./CoverLetterGenerator";
import { usePortfolioStore } from "@/shared/store/portfolioStore";

export function CoverLetterModal() {
  const { showCoverLetterModal: isOpen, setShowCoverLetterModal: setIsOpen } =
    usePortfolioStore();

  return (
    <>
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-subtle overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-subtle bg-canvas">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-status animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                    AI Cover Letter
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-subtle/30 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <CoverLetterGenerator onClose={() => setIsOpen(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
