import React from 'react';
import { motion } from 'motion/react';

interface AnimatedDividerProps {
  icon: React.ElementType;
  quote?: string;
  author?: string;
}

export function AnimatedDivider({ icon: Icon, quote, author }: AnimatedDividerProps) {
  return (
    <div className="relative max-w-7xl mx-auto my-16 flex items-center justify-center select-none overflow-visible z-20">
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 dark:via-emerald-500/20 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <motion.div
        className="relative px-4 bg-neu-bg z-10 group"
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          type: "spring",
          stiffness: 200,
        }}
      >
        <div className="p-2.5 rounded-full glass-card border border-white/5 flex items-center justify-center text-indigo-500 dark:text-emerald-400 hover:rotate-12 transition-transform duration-300 cursor-help">
          <Icon size={16} className="animate-pulse" />
        </div>
        
        {quote && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 w-48 sm:w-64 text-center">
            <div className="bg-neu-text text-neu-bg text-xs px-3 py-2 rounded-lg shadow-lg border border-neu-accent font-mono italic">
              &quot;{quote}&quot;
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
