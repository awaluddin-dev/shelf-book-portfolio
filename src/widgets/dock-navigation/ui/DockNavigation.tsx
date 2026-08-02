import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";
import {
  ArrowUp,
  Cpu,
  Briefcase,
  MessageSquare,
  Palette,
  Menu,
  X,
  BookOpen,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePortfolioStore } from "@/shared/store/portfolioStore";

interface DockNavigationProps {
  isDark: boolean;
  showBackToTop: boolean;
  activeSection: string;
  openPlayground: () => void;
}

export default function DockNavigation({
  isDark,
  showBackToTop,
  activeSection,
  openPlayground,
}: Readonly<DockNavigationProps>) {
  const [hoveredDockId, setHoveredDockId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const { setTheme } = useTheme();
  const { setIsChatOpen } = usePortfolioStore();

  // Initialize state based on screen size on first mount
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, []);

  // Full SVG Path for the Top-Right L-Shape (300x300) - 5 rows tall, 5 cols wide
  const lShapePathFull =
    "M 20 0 L 280 0 A 20 20 0 0 1 300 20 L 300 280 A 20 20 0 0 1 280 300 L 260 300 A 20 20 0 0 1 240 280 L 240 80 A 20 20 0 0 0 220 60 L 20 60 A 20 20 0 0 1 0 40 L 0 20 A 20 20 0 0 1 20 0 Z";

  // Short SVG Path when Back To Top is hidden (300x240) - 4 rows tall
  const lShapePathShort =
    "M 20 0 L 280 0 A 20 20 0 0 1 300 20 L 300 220 A 20 20 0 0 1 280 240 L 260 240 A 20 20 0 0 1 240 220 L 240 80 A 20 20 0 0 0 220 60 L 20 60 A 20 20 0 0 1 0 40 L 0 20 A 20 20 0 0 1 20 0 Z";

  // Square SVG Path when menu is closed (60x60 at top-right corner)
  const lShapePathSquare =
    "M 260 0 L 280 0 A 20 20 0 0 1 300 20 L 300 40 A 20 20 0 0 1 280 60 L 260 60 A 20 20 0 0 1 240 40 L 240 20 A 20 20 0 0 0 240 20 L 240 20 A 20 20 0 0 1 240 20 L 240 20 A 20 20 0 0 1 260 0 Z";

  const activePath = !isOpen
    ? lShapePathSquare
    : showBackToTop
      ? lShapePathFull
      : lShapePathShort;

  return (
    <motion.div
      role="navigation"
      aria-label="Top Right Corner Dock Navigation"
      suppressHydrationWarning
      initial={{ y: -100, x: 100, opacity: 0 }}
      animate={{ y: 0, x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed top-6 right-6 z-50 w-[300px] h-[300px] pointer-events-none group"
    >
      {/* Background and Border */}
      <div className="absolute inset-0 z-0">
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="absolute inset-0 overflow-visible pointer-events-none"
        >
          <defs>
            <clipPath id="l-shape-clip">
              <motion.path
                initial={false}
                animate={{ d: activePath }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            </clipPath>
            <linearGradient
              id="l-glow-grad"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="300"
              y2="300"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="transparent" />
              <stop offset="75%" stopColor="#3b82f6" />
              <stop offset="85%" stopColor="#8b5cf6" />
              <stop offset="95%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f59e0b" />
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                from="0 90 120"
                to="360 90 120"
                dur="4s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>

          {/* Glowing Border */}
          <motion.path
            initial={false}
            animate={{ d: activePath }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            fill="none"
            stroke="url(#l-glow-grad)"
            strokeWidth="3"
            className="pointer-events-none"
          />

          {/* Subtle static border */}
          <motion.path
            initial={false}
            animate={{ d: activePath }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            fill="none"
            stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
            strokeWidth="1.5"
            className="pointer-events-none"
          />
        </svg>

        {/* Glass Background */}
        <div
          className="absolute inset-0 bg-neu-bg/20 dark:bg-neu-bg/40 backdrop-blur-md shadow-2xl pointer-events-auto transition-colors duration-300"
          style={{
            clipPath: "url(#l-shape-clip)",
            WebkitClipPath: "url(#l-shape-clip)",
          }}
        />
      </div>

      {/* Interactive Grid Container */}
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 z-10 pointer-events-none">
        {/* Row 1 Col 1: Projects */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
              className="col-start-1 row-start-1 flex items-center justify-center pointer-events-auto"
            >
              <button
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                onMouseEnter={() => setHoveredDockId("projects")}
                onMouseLeave={() => setHoveredDockId(null)}
                className="group relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer"
                aria-label="Projects"
              >
                {activeSection === "projects" && (
                  <motion.div
                    layoutId="activeDockButton"
                    className="absolute inset-0 bg-neu-secondary/80 dark:bg-neu-secondary/60 rounded-xl border border-neu-accent/30"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <div
                  className={cn(
                    "relative z-10 transition-transform duration-300 group-hover:scale-110",
                    activeSection === "projects"
                      ? "text-neu-accent"
                      : "text-neu-text-muted group-hover:text-neu-accent",
                  )}
                >
                  <BookOpen size={18} />
                </div>
                {/* Tooltip BOTTOM */}
                <AnimatePresence>
                  {hoveredDockId === "projects" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, x: "-50%", scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                      exit={{ opacity: 0, y: -6, x: "-50%", scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 24,
                      }}
                      className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none"
                    >
                      Projects
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Col 2: Proficiency */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
              className="col-start-2 row-start-1 flex items-center justify-center pointer-events-auto"
            >
              <button
                onClick={() =>
                  document
                    .getElementById("proficiency")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                onMouseEnter={() => setHoveredDockId("proficiency")}
                onMouseLeave={() => setHoveredDockId(null)}
                className="group relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer"
                aria-label="Proficiency"
              >
                {activeSection === "proficiency" && (
                  <motion.div
                    layoutId="activeDockButton"
                    className="absolute inset-0 bg-neu-secondary/80 dark:bg-neu-secondary/60 rounded-xl border border-neu-accent/30"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <div
                  className={cn(
                    "relative z-10 transition-transform duration-300 group-hover:scale-110",
                    activeSection === "proficiency"
                      ? "text-neu-accent"
                      : "text-neu-text-muted group-hover:text-neu-accent",
                  )}
                >
                  <Cpu size={18} />
                </div>
                {/* Tooltip BOTTOM */}
                <AnimatePresence>
                  {hoveredDockId === "proficiency" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, x: "-50%", scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                      exit={{ opacity: 0, y: -6, x: "-50%", scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 24,
                      }}
                      className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none"
                    >
                      Proficiency
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Middle: Experience */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
              className="col-start-3 row-start-1 flex items-center justify-center pointer-events-auto"
            >
              <button
                onClick={() =>
                  document
                    .getElementById("experience")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                onMouseEnter={() => setHoveredDockId("experience")}
                onMouseLeave={() => setHoveredDockId(null)}
                className="group relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer"
                aria-label="Experience"
              >
                {activeSection === "experience" && (
                  <motion.div
                    layoutId="activeDockButton"
                    className="absolute inset-0 bg-neu-secondary/80 dark:bg-neu-secondary/60 rounded-xl border border-neu-accent/30"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <div
                  className={cn(
                    "relative z-10 transition-transform duration-300 group-hover:scale-110",
                    activeSection === "experience"
                      ? "text-neu-accent"
                      : "text-neu-text-muted group-hover:text-neu-accent",
                  )}
                >
                  <Briefcase size={18} />
                </div>
                {/* Tooltip BOTTOM */}
                <AnimatePresence>
                  {hoveredDockId === "experience" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, x: "-50%", scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                      exit={{ opacity: 0, y: -6, x: "-50%", scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 24,
                      }}
                      className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none"
                    >
                      Experience
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Col 4: Endorse */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
              className="col-start-4 row-start-1 flex items-center justify-center pointer-events-auto"
            >
              <button
                onClick={() =>
                  document
                    .getElementById("endorse")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                onMouseEnter={() => setHoveredDockId("endorse")}
                onMouseLeave={() => setHoveredDockId(null)}
                className="group relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer"
                aria-label="Endorse"
              >
                {activeSection === "endorse" && (
                  <motion.div
                    layoutId="activeDockButton"
                    className="absolute inset-0 bg-neu-secondary/80 dark:bg-neu-secondary/60 rounded-xl border border-neu-accent/30"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <div
                  className={cn(
                    "relative z-10 transition-transform duration-300 group-hover:scale-110",
                    activeSection === "endorse"
                      ? "text-neu-accent"
                      : "text-neu-text-muted group-hover:text-neu-accent",
                  )}
                >
                  <MessageSquare size={18} />
                </div>
                {/* Tooltip BOTTOM */}
                <AnimatePresence>
                  {hoveredDockId === "endorse" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, x: "-50%", scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                      exit={{ opacity: 0, y: -6, x: "-50%", scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 24,
                      }}
                      className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none"
                    >
                      Endorse
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Right (Corner): Hamburger Toggle */}
        <div className="col-start-5 row-start-1 flex items-center justify-center pointer-events-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setHoveredDockId("menu-toggle")}
            onMouseLeave={() => setHoveredDockId(null)}
            className="group relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 text-neu-text-muted group-hover:text-neu-accent">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? "open" : "closed"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Tooltip BOTTOM for Hamburger */}
            <AnimatePresence>
              {hoveredDockId === "menu-toggle" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, x: "-50%", scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                  exit={{ opacity: 0, y: -6, x: "-50%", scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 450, damping: 24 }}
                  className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none"
                >
                  {isOpen ? "Close Menu" : "Menu"}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Row 2 Col 5: Theme Playground */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="col-start-5 row-start-2 flex items-center justify-center pointer-events-auto"
            >
              <button
                onClick={openPlayground}
                onMouseEnter={() => setHoveredDockId("theme-playground")}
                onMouseLeave={() => setHoveredDockId(null)}
                className="group relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer"
                aria-label="Theme Playground"
              >
                <div
                  className={cn(
                    "relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110",
                    "text-neu-text-muted group-hover:colorful",
                  )}
                >
                  <Palette size={18} />
                </div>
                {/* Tooltip LEFT */}
                <AnimatePresence>
                  {hoveredDockId === "theme-playground" && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, y: "-50%", scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, y: "-50%", scale: 1 }}
                      exit={{ opacity: 0, x: 6, y: "-50%", scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 24,
                      }}
                      className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none"
                    >
                      Theme Playground
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Row 3 Col 5: Theme Toggle */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ duration: 0.2, delay: 0.10 }}
              className="col-start-5 row-start-3 flex items-center justify-center pointer-events-auto"
            >
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                onMouseEnter={() => setHoveredDockId("theme-toggle")}
                onMouseLeave={() => setHoveredDockId(null)}
                className="group relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer"
                aria-label="Toggle Theme"
              >
                <div
                  className={cn(
                    "relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110",
                    "text-neu-text-muted group-hover:text-neu-accent",
                  )}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </div>
                {/* Tooltip LEFT */}
                <AnimatePresence>
                  {hoveredDockId === "theme-toggle" && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, y: "-50%", scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, y: "-50%", scale: 1 }}
                      exit={{ opacity: 0, x: 6, y: "-50%", scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 24,
                      }}
                      className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none"
                    >
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Row 4 Col 5: AI Chat */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ duration: 0.2, delay: 0.15 }}
              className="col-start-5 row-start-4 flex items-center justify-center pointer-events-auto"
            >
              <button
                onClick={() => setIsChatOpen(true)}
                onMouseEnter={() => setHoveredDockId("chat-toggle")}
                onMouseLeave={() => setHoveredDockId(null)}
                className="group relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer"
                aria-label="Ask about Awaluddin"
              >
                <div
                  className={cn(
                    "relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110",
                    "text-neu-text-muted group-hover:text-neu-accent",
                  )}
                >
                  <Sparkles size={18} />
                </div>
                {/* Tooltip LEFT */}
                <AnimatePresence>
                  {hoveredDockId === "chat-toggle" && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, y: "-50%", scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, y: "-50%", scale: 1 }}
                      exit={{ opacity: 0, x: 6, y: "-50%", scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 24,
                      }}
                      className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none"
                    >
                      AI Chat
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Row 5 Col 5: Back to Top */}
        <AnimatePresence>
          {isOpen && showBackToTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="col-start-5 row-start-5 flex items-center justify-center pointer-events-auto"
            >
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                onMouseEnter={() => setHoveredDockId("scroll-top")}
                onMouseLeave={() => setHoveredDockId(null)}
                className="group relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-neu-secondary/50 dark:hover:bg-neu-secondary/30 active:scale-90 transition-all cursor-pointer"
                aria-label="Scroll to Top"
              >
                <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5 text-neu-text-muted group-hover:text-neu-accent">
                  <ArrowUp size={18} />
                </div>
                {/* Tooltip LEFT */}
                <AnimatePresence>
                  {hoveredDockId === "scroll-top" && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, y: "-50%", scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, y: "-50%", scale: 1 }}
                      exit={{ opacity: 0, x: 6, y: "-50%", scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 24,
                      }}
                      className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-[10px] font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none"
                    >
                      Back to Top
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </motion.div>
  );
}
