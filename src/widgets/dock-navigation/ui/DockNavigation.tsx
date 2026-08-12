import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DockItem } from "./DockItem";
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
        {/* Dock Items */}
        <AnimatePresence>
          {isOpen && (
            <>
              <DockItem
                id="projects"
                label="Projects"
                icon={<BookOpen size={18} />}
                isActive={activeSection === "projects"}
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                wrapperClassName="col-start-1 row-start-1 flex items-center justify-center pointer-events-auto"
                hoveredDockId={hoveredDockId}
                setHoveredDockId={setHoveredDockId}
              />
              <DockItem
                id="proficiency"
                label="Proficiency"
                icon={<Cpu size={18} />}
                isActive={activeSection === "proficiency"}
                onClick={() => document.getElementById("proficiency")?.scrollIntoView({ behavior: "smooth" })}
                wrapperClassName="col-start-2 row-start-1 flex items-center justify-center pointer-events-auto"
                hoveredDockId={hoveredDockId}
                setHoveredDockId={setHoveredDockId}
              />
              <DockItem
                id="experience"
                label="Experience"
                icon={<Briefcase size={18} />}
                isActive={activeSection === "experience"}
                onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}
                wrapperClassName="col-start-3 row-start-1 flex items-center justify-center pointer-events-auto"
                hoveredDockId={hoveredDockId}
                setHoveredDockId={setHoveredDockId}
              />
              <DockItem
                id="endorse"
                label="Endorse"
                icon={<MessageSquare size={18} />}
                isActive={activeSection === "endorse"}
                onClick={() => document.getElementById("endorse")?.scrollIntoView({ behavior: "smooth" })}
                wrapperClassName="col-start-4 row-start-1 flex items-center justify-center pointer-events-auto"
                hoveredDockId={hoveredDockId}
                setHoveredDockId={setHoveredDockId}
              />
              
              <DockItem
                id="theme-playground"
                label="Theme Playground"
                icon={<Palette size={18} />}
                onClick={openPlayground}
                wrapperClassName="col-start-5 row-start-2 flex items-center justify-center pointer-events-auto"
                delay={0.05}
                tooltipPos="LEFT"
                hoverAnimation="group-hover:rotate-12 group-hover:scale-110"
                hoverColor="group-hover:colorful"
                hoveredDockId={hoveredDockId}
                setHoveredDockId={setHoveredDockId}
              />
              
              <DockItem
                id="theme-toggle"
                label={isDark ? "Light Mode" : "Dark Mode"}
                ariaLabel="Toggle Theme"
                icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                wrapperClassName="col-start-5 row-start-3 flex items-center justify-center pointer-events-auto"
                delay={0.10}
                tooltipPos="LEFT"
                hoverAnimation="group-hover:rotate-12 group-hover:scale-110"
                hoveredDockId={hoveredDockId}
                setHoveredDockId={setHoveredDockId}
              />
              
              <DockItem
                id="chat-toggle"
                label="AI Chat"
                ariaLabel="Ask about Awaluddin"
                icon={<Sparkles size={18} />}
                onClick={() => setIsChatOpen(true)}
                wrapperClassName="col-start-5 row-start-4 flex items-center justify-center pointer-events-auto"
                delay={0.15}
                tooltipPos="LEFT"
                hoverAnimation="group-hover:rotate-12 group-hover:scale-110"
                hoveredDockId={hoveredDockId}
                setHoveredDockId={setHoveredDockId}
              />
              
              {showBackToTop && (
                <DockItem
                  id="scroll-top"
                  label="Back to Top"
                  ariaLabel="Scroll to Top"
                  icon={<ArrowUp size={18} />}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  wrapperClassName="col-start-5 row-start-5 flex items-center justify-center pointer-events-auto"
                  delay={0.20}
                  tooltipPos="LEFT"
                  hoverAnimation="group-hover:-translate-y-0.5"
                  hoveredDockId={hoveredDockId}
                  setHoveredDockId={setHoveredDockId}
                />
              )}
            </>
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


      </div>
    </motion.div>
  );
}
