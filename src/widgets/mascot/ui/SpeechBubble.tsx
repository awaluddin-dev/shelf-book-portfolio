import { motion, AnimatePresence } from "motion/react";
import { usePortfolioStore } from "@/shared/store/portfolioStore";

interface SpeechBubbleProps {
  text: string;
  onClose: () => void;
  showButton?: boolean;
}

export function SpeechBubble({
  text,
  onClose,
  showButton,
}: Readonly<SpeechBubbleProps>) {
  const { setShowCoverLetterModal } = usePortfolioStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="absolute bottom-full right-16 mb-4 w-64 p-4 pr-8 rounded-2xl rounded-br-sm glass-card border border-neu-accent/30 shadow-neu-modal bg-neu-bg/95 backdrop-blur-xl z-[200]"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 text-neu-text-muted hover:text-neu-accent transition-colors"
        aria-label="Close Mascot"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="text-sm font-mono text-neu-text-muted leading-relaxed">
        <AnimatePresence mode="wait">
          <motion.p
            key={text}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {text}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              onClick={() => setShowCoverLetterModal(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-neu-accent/10 text-neu-accent hover:bg-neu-accent/20 border border-neu-accent/30 font-bold transition-colors"
            >
              Cover Letter Generator
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Pointer Triangle */}
      <div className="absolute -bottom-2 right-4 w-4 h-4 bg-neu-bg/95 border-b border-r border-neu-accent/30 backdrop-blur-xl transform rotate-45" />
    </motion.div>
  );
}
