import { motion } from "motion/react";
import { Search } from "lucide-react";

export default function EmptyState({
  message = "No data available",
}: Readonly<{ message?: string }>) {
  return (
    <div className="py-16 px-4 text-center w-full max-w-md mx-auto relative z-10">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-3xl glass-card text-neu-accent/60 mb-6 border border-white/5"
      >
        <Search size={28} />
      </motion.div>
      <h3 className="text-lg font-display font-bold text-neu-text tracking-tight mb-2">
        {message}
      </h3>
    </div>
  );
}
