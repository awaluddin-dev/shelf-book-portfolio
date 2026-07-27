import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function MobileFilterModal({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
}: Readonly<MobileFilterModalProps>) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: "100%", scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-neu-bg rounded-t-3xl sm:rounded-3xl p-6 shadow-neu-modal border border-white/10"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Filter Projects</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full glass-card-inset text-neu-text-muted hover:text-neu-accent"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  onSelectCategory(null);
                  onClose();
                }}
                className={cn(
                  "px-5 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all text-left",
                  !selectedCategory
                    ? "glass-card text-neu-accent"
                    : "text-neu-text-muted glass-card-inset",
                )}
              >
                All Projects
              </button>
              {(categories || []).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    onClose();
                  }}
                  className={cn(
                    "px-5 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all text-left",
                    selectedCategory === cat
                      ? "glass-card text-neu-accent"
                      : "text-neu-text-muted glass-card-inset",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
