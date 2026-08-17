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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-neu-bg rounded-2xl shadow-neu-modal border border-white/10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neu-accent animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-text">
                    AI Cover Letter
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-neu-text-muted hover:text-neu-text hover:bg-white/10 transition-colors"
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
