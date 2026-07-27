import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { ArrowUp, Cpu, Briefcase, MessageSquare, Sun, Moon } from "lucide-react";

interface DockNavigationProps {
  isDark: boolean;
  showBackToTop: boolean;
  activeSection: string;
  toggleTheme: () => void;
}

export default function DockNavigation({
  isDark,
  showBackToTop,
  activeSection,
  toggleTheme,
}: DockNavigationProps) {
  const [hoveredDockId, setHoveredDockId] = useState<string | null>(null);

  return (
    <motion.div
      role="navigation"
      aria-label="Bottom Dock Navigation"
      suppressHydrationWarning
      initial={{ y: 100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 left-1/2 z-50 w-auto max-w-[95vw] sm:max-w-lg md:max-w-none p-1.5 rounded-2xl flex flex-nowrap items-center transition-all duration-300 group"
      style={{
        boxShadow: isDark
          ? "0 8px 30px rgba(0, 173, 181, 0.12), inset 0 0 12px rgba(0, 173, 181, 0.04)"
          : "0 8px 30px rgba(63, 114, 175, 0.08), inset 0 0 12px rgba(63, 114, 175, 0.02)",
      }}
    >
      {/* Dynamic Rotating Glow Border Effect */}
      <div className="absolute inset-0 rounded-2xl -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-[150%] opacity-40 dark:opacity-60 bg-[conic-gradient(from_0deg,var(--color-neu-accent),var(--color-neu-secondary),var(--color-neu-accent))]"
        />
        {/* Inner masking to keep only the thin border shining and preserve backdrop blur */}
        <div className="absolute inset-[1px] rounded-[15px] bg-neu-bg/90 backdrop-blur-md" />
      </div>
      <div className="flex items-center gap-1 sm:gap-2 px-1 w-full max-w-full sm:max-w-none flex-nowrap justify-center sm:justify-start">
        <AnimatePresence>
          {showBackToTop && (
            <motion.div
              key="backToTopContainer"
              initial={{ opacity: 0, width: 0, scale: 0.8, marginRight: 0 }}
              animate={{
                opacity: 1,
                width: "auto",
                scale: 1,
                marginRight: 8,
              }}
              exit={{ opacity: 0, width: 0, scale: 0.8, marginRight: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-1 sm:gap-2 overflow-visible flex-shrink-0"
            >
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onMouseEnter={() => setHoveredDockId("scroll-top")}
                onMouseLeave={() => setHoveredDockId(null)}
                className="group relative flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer flex-shrink"
                aria-label="Scroll to Top"
              >
                <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5 text-neu-text-muted group-hover:text-neu-accent">
                  <ArrowUp size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <AnimatePresence>
                  {hoveredDockId === "scroll-top" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                      exit={{ opacity: 0, y: 6, x: "-50%", scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 24,
                      }}
                      className="absolute bottom-full mb-3 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none left-1/2"
                    >
                      Back to Top
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] w-2 h-2 rotate-45 bg-neu-bg/95 dark:bg-neu-bg/90 border-r border-b border-neu-accent/20"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <div className="w-[1px] h-6 bg-neu-text/10 dark:bg-neu-text/15 mx-1 flex-shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>

        {[
          {
            id: "proficiency",
            label: "Stack & Insights",
            icon: <Cpu size={16} className="sm:w-[18px] sm:h-[18px]" />,
          },
          {
            id: "experience",
            label: "Experience",
            icon: <Briefcase size={16} className="sm:w-[18px] sm:h-[18px]" />,
          },
          {
            id: "endorse",
            label: "Endorse",
            icon: (
              <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px]" />
            ),
          },
        ].map((sec) => {
          const active = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => {
                document
                  .getElementById(sec.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              onMouseEnter={() => setHoveredDockId(sec.id)}
              onMouseLeave={() => setHoveredDockId(null)}
              className="group relative flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer flex-shrink"
              aria-label={sec.label}
            >
              {active && (
                <motion.div
                  layoutId="activeDockButton"
                  className="absolute inset-0 bg-neu-secondary/80 dark:bg-neu-secondary/60 rounded-xl border border-neu-accent/30"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <div
                className={cn(
                  "relative z-10 transition-transform duration-300 group-hover:scale-110",
                  active
                    ? "text-neu-accent"
                    : "text-neu-text-muted group-hover:text-neu-accent",
                )}
              >
                {sec.icon}
              </div>
              <AnimatePresence>
                {hoveredDockId === sec.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                    exit={{ opacity: 0, y: 6, x: "-50%", scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 24,
                    }}
                    className="absolute bottom-full mb-3 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none left-1/2"
                  >
                    {sec.label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] w-2 h-2 rotate-45 bg-neu-bg/95 dark:bg-neu-bg/90 border-r border-b border-neu-accent/20"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}

        {/* Vertical divider */}
        <div className="w-[1px] h-6 bg-neu-text/10 dark:bg-neu-text/15 mx-1 flex-shrink-0" />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          onMouseEnter={() => setHoveredDockId("theme")}
          onMouseLeave={() => setHoveredDockId(null)}
          className="group relative flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer flex-shrink"
          aria-label="Toggle Theme"
        >
          <div
            className={cn(
              "relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110",
              "text-neu-text-muted group-hover:text-neu-accent",
            )}
          >
            {isDark ? (
              <Sun size={16} className="sm:w-[18px] sm:h-[18px]" />
            ) : (
              <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />
            )}
          </div>
          <AnimatePresence>
            {hoveredDockId === "theme" && (
              <motion.div
                initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.8 }}
                animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                exit={{ opacity: 0, y: 6, x: "-50%", scale: 0.8 }}
                transition={{ type: "spring", stiffness: 450, damping: 24 }}
                className="absolute bottom-full mb-3 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none left-1/2"
              >
                {isDark ? "Light Mode" : "Dark Mode"}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] w-2 h-2 rotate-45 bg-neu-bg/95 dark:bg-neu-bg/90 border-r border-b border-neu-accent/20"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}
