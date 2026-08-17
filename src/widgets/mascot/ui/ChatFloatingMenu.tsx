import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePortfolioStore } from "@/shared/store/portfolioStore";
import { MessageSquare, FileText, X } from "lucide-react";

interface ChatFloatingMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatFloatingMenu({ isOpen, onClose }: ChatFloatingMenuProps) {
  const { setIsChatOpen, setShowCoverLetterModal } = usePortfolioStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10, x: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10, x: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute bottom-full right-full mb-4 mr-4 w-48 bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md border border-neu-border rounded-xl shadow-neu-modal z-[110] overflow-hidden"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-neu-border">
            <span className="text-xs font-bold text-neu-text-muted">Options</span>
            <button
              onClick={onClose}
              className="text-neu-text-muted hover:text-neu-accent transition-colors p-1 rounded-md"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex flex-col p-1.5">
            <button
              onClick={() => {
                setShowCoverLetterModal(true);
                onClose();
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neu-text hover:text-neu-accent hover:bg-neu-secondary/30 rounded-lg transition-colors text-left"
            >
              <FileText size={16} />
              Cover Letter
            </button>
            <button
              onClick={() => {
                setIsChatOpen(true);
                onClose();
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neu-text hover:text-neu-accent hover:bg-neu-secondary/30 rounded-lg transition-colors text-left mt-0.5"
            >
              <MessageSquare size={16} />
              AI Chat
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
