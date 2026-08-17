import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";

export interface DockItemProps {
  id: string;
  label: string;
  ariaLabel?: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  wrapperClassName: string;
  delay?: number;
  tooltipPos?: "BOTTOM" | "LEFT";
  hoverAnimation?: string;
  hoverColor?: string;
  hoveredDockId: string | null;
  setHoveredDockId: (id: string | null) => void;
}

export function DockItem({
  id,
  label,
  ariaLabel,
  icon,
  isActive,
  onClick,
  wrapperClassName,
  delay = 0,
  tooltipPos = "BOTTOM",
  hoverAnimation = "group-hover:scale-110",
  hoverColor = "group-hover:text-neu-accent",
  hoveredDockId,
  setHoveredDockId,
}: Readonly<DockItemProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
      transition={{ duration: 0.2, delay }}
      className={wrapperClassName}
    >
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHoveredDockId(id)}
        onMouseLeave={() => setHoveredDockId(null)}
        className="group relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer"
        aria-label={ariaLabel || label}
      >
        {isActive && (
          <motion.div
            layoutId="activeDockButton"
            className="absolute inset-0 bg-neu-secondary/80 dark:bg-neu-secondary/60 rounded-xl border border-neu-accent/30"
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          />
        )}
        <div
          className={cn(
            "relative z-10 transition-transform duration-300",
            hoverAnimation,
            isActive
              ? "text-neu-accent"
              : cn("text-neu-text-muted", hoverColor),
          )}
        >
          {icon}
        </div>
        {/* Tooltip */}
        <AnimatePresence>
          {hoveredDockId === id && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                ...(tooltipPos === "BOTTOM"
                  ? { y: -10, x: "-50%" }
                  : { x: 10, y: "-50%" }),
              }}
              animate={{
                opacity: 1,
                scale: 1,
                ...(tooltipPos === "BOTTOM"
                  ? { y: 0, x: "-50%" }
                  : { x: 0, y: "-50%" }),
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                ...(tooltipPos === "BOTTOM"
                  ? { y: -6, x: "-50%" }
                  : { x: 6, y: "-50%" }),
              }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 24,
              }}
              className={cn(
                "absolute px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none",
                tooltipPos === "BOTTOM"
                  ? "top-[calc(100%+12px)] left-1/2 -translate-x-1/2"
                  : "right-[calc(100%+12px)] top-1/2 -translate-y-1/2",
              )}
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
