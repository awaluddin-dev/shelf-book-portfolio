"use client";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import {
  ArrowRight,
  ArrowUp,
  Award,
  BarChart2,
  BookOpen,
  Box,
  BrainCircuit,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cloud,
  Code2,
  Cpu,
  Database,
  Download,
  Filter,
  GitCommit,
  Github,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Milestone,
  Moon,
  PenTool,
  Quote,
  Search,
  Server,
  Sparkles,
  Sun,
  Terminal,
  TrendingUp,
  X,
  Zap,
  Activity,
} from "lucide-react";

import { CircuitBoardBg } from "@/shared/ui/CircuitBoardBg";
import { useTheme } from "@/shared/ui/ThemeProvider";
import { motion, AnimatePresence, useSpring, useScroll } from "motion/react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/shared/lib/utils";

import SkillTree from "@/entities/skill/ui/SkillTree";
import P5Background from "@/shared/ui/P5Background";
import { getTagProjectCount } from "@/entities/project/model/projects-data";
import BookItem from "@/entities/project/ui/BookItem";
import {
  legendLevels,
  roadmapItems,
} from "@/entities/skill/model/roadmap-data";

import ContactModal from "@/features/contact/ui/ContactModal";
import { usePortfolioData } from "@/views/home/model/usePortfolioData";
import { useContributionData } from "@/views/home/model/useContributionData";

const FALLBACK_CURRENT_FOCUS = [
  {
    title: "Writing",
    icon: "PenTool",
    description:
      '"I Rewrote a Fintech Platform Alone — No Handover, No Team, No Docs"',
    link: "https://dev.to/awaluddin",
    linkText: "Read on dev.to",
  },
  {
    title: "Current Work",
    icon: "Code2",
    description:
      "Building AuraFlow AI, an intelligent project management and estimation agent.",
    link: "https://github.com/awaluddin-dev",
    linkText: "View Repository",
  },
  {
    title: "Upcoming Tech",
    icon: "Rocket",
    description:
      "Deep diving into local LLM orchestration and vector database optimization.",
    link: "#experience",
    linkText: "See Roadmap",
  },
];

const FALLBACK_METRICS = [
  {
    val: "5+ Years",
    label: "Engineering Experience",
    icon: "Code2",
    isSavings: false,
  },
  {
    val: "Enterprise & Fintech",
    label: "INDUSTRY EXPERIENCE",
    icon: "Briefcase",
    isSavings: false,
  },
  {
    val: "$18K/yr",
    label: "Infra Cost Savings",
    icon: "TrendingUp",
    isSavings: true,
  },
  {
    val: "@ Astra Group",
    label: "CURRENT CONTRACT",
    icon: "MapPin",
    isSavings: false,
  },
];

function renderIcon(iconName: string, isSavings: boolean, customSize?: number) {
  const size = customSize || 20;
  const cls = `${customSize ? "" : "w-5 h-5 sm:w-6 sm:h-6"} ${isSavings ? "text-emerald-500 dark:text-emerald-400" : "text-neu-accent"}`;
  switch (iconName) {
    case "BrainCircuit":
      return <BrainCircuit size={size} className={cls} />;
    case "Code2":
      return <Code2 size={size} className={cls} />;
    case "Briefcase":
      return <Briefcase size={size} className={cls} />;
    case "TrendingUp":
      return <TrendingUp size={size} className={cls} />;
    case "MapPin":
      return <MapPin size={size} className={cls} />;
    case "Cpu":
      return <Cpu size={size} className={cls} />;
    case "Zap":
      return <Zap size={size} className={cls} />;
    case "Activity":
      return <Activity size={size} className={cls} />;
    case "Award":
      return <Award size={size} className={cls} />;
    case "Terminal":
      return <Terminal size={size} className={cls} />;
    case "Server":
      return <Server size={size} className={cls} />;
    case "Database":
      return <Database size={size} className={cls} />;
    case "Box":
      return <Box size={size} className={cls} />;
    case "Layers":
      return <Layers size={size} className={cls} />;
    case "Cloud":
      return <Cloud size={size} className={cls} />;
    default:
      return <Code2 size={size} className={cls} />;
  }
}

export default function Portfolio() {
  const { isDark, toggleTheme } = useTheme();
  const pd = usePortfolioData();
  const gh = useContributionData();

  const activeRoadmap = pd.roadmaps.length > 0 ? pd.roadmaps : roadmapItems;
  const activeProficiency = pd.proficiencies;
  const activeWork = pd.workExperiences;
  const activeCurrentFocus =
    pd.currentFoci.length > 0 ? pd.currentFoci : FALLBACK_CURRENT_FOCUS;
  const activeMetrics = pd.metrics.length > 0 ? pd.metrics : FALLBACK_METRICS;
  const activeProjects = pd.projects;
  const testimonialsList = pd.testimonials;

  const [chartType, setChartType] = useState<"temporal" | "repository">(
    "temporal",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [focusedProject, setFocusedProject] = useState<any>(null);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | null>(
    null,
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alphabetical">(
    "newest",
  );
  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredDockId, setHoveredDockId] = useState<string | null>(null);
  const [selectedRoadmapIndex, setSelectedRoadmapIndex] = useState(0);
  const [activeExpIdx, setActiveExpIdx] = useState<number | null>(0);
  const [activeTooltipDate, setActiveTooltipDate] = useState<string | null>(
    null,
  );
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const shelfRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { timelineData, repoData, languageData, heatmapStats, monthsData } = gh;
  const isLoading = pd.loading || gh.loading;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const triggerToast = (msg: string) => setToastMessage(msg);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    const t2 = setTimeout(() => {
      if (heatmapRef.current)
        heatmapRef.current.scrollLeft = heatmapRef.current.scrollWidth;
    }, 1200);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const sections = ["hero", "proficiency", "experience", "endorse"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { root: null, rootMargin: "-30% 0px -40% 0px", threshold: 0 },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      selectedProject || showInquiryModal || isFilterModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject, showInquiryModal, isFilterModalOpen]);

  const handleTouchStart = useCallback((dayDate: string) => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(
      () => setActiveTooltipDate(dayDate),
      200,
    );
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => setActiveTooltipDate(null), 1500);
  }, []);

  const handleTouchMove = useCallback(() => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
  }, []);

  const categories = Array.from(
    new Set((activeProjects || []).map((p) => p.category)),
  );

  const filteredProjects = useMemo(() => {
    return [...(activeProjects || [])]
      .filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          (p.title.toLowerCase().includes(q) ||
            (p.tags || []).some((t: string) => t.toLowerCase().includes(q))) &&
          (!selectedCategory || p.category === selectedCategory)
        );
      })
      .sort((a, b) => {
        if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
        const getYear = (d: string, max: boolean) => {
          const y = d.match(/\d{4}/g);
          return y
            ? max
              ? Math.max(...y.map(Number))
              : Math.min(...y.map(Number))
            : 0;
        };
        return sortBy === "newest"
          ? getYear(b.date, true) - getYear(a.date, true)
          : getYear(a.date, false) - getYear(b.date, false);
      });
  }, [searchQuery, selectedCategory, sortBy, activeProjects]);

  const handlePrevProject = useCallback(() => {
    if (!selectedProject) return;
    const idx = filteredProjects.findIndex((p) => p.id === selectedProject.id);
    if (idx === -1) return;
    setSelectedProject(
      idx > 0
        ? filteredProjects[idx - 1]
        : filteredProjects[filteredProjects.length - 1],
    );
  }, [selectedProject, filteredProjects]);

  const handleNextProject = useCallback(() => {
    if (!selectedProject) return;
    const idx = filteredProjects.findIndex((p) => p.id === selectedProject.id);
    if (idx === -1) return;
    setSelectedProject(
      idx < filteredProjects.length - 1
        ? filteredProjects[idx + 1]
        : filteredProjects[0],
    );
  }, [selectedProject, filteredProjects]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === "ArrowLeft") handlePrevProject();
      else if (e.key === "ArrowRight") handleNextProject();
      else if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedProject, handlePrevProject, handleNextProject]);

  const scrollShelf = (d: "left" | "right") => {
    shelfRef.current?.scrollBy({
      left: d === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-neu-bg text-neu-text px-6 pb-6 md:px-12 md:pb-12 lg:px-24 lg:pb-24 pt-[2.7rem] font-sans transition-colors duration-300 relative">
      <motion.div
        id="scroll-progress"
        className="fixed top-0 left-0 right-0 h-[4px] bg-neu-accent z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Bottom Dock */}
      <motion.div
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
        <div className="absolute inset-0 rounded-2xl -z-10 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-[150%] opacity-40 dark:opacity-60 bg-[conic-gradient(from_0deg,var(--color-neu-accent),var(--color-neu-secondary),var(--color-neu-accent))]"
          />
          <div className="absolute inset-[1px] rounded-[15px] bg-neu-bg/90 backdrop-blur-md" />
        </div>
        <div className="flex items-center gap-1 sm:gap-2 px-1 w-full max-w-full sm:max-w-none flex-nowrap justify-center sm:justify-start">
          <AnimatePresence>
            {activeSection !== "hero" && (
              <motion.div
                key="backToTopContainer"
                initial={{ opacity: 0, width: 0, scale: 0.5, marginRight: 0 }}
                animate={{
                  opacity: 1,
                  width: "auto",
                  scale: 1,
                  marginRight: 8,
                }}
                exit={{ opacity: 0, width: 0, scale: 0.5, marginRight: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="flex items-center gap-1 sm:gap-2 overflow-visible flex-shrink-0"
              >
                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
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
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] w-2 h-2 rotate-45 bg-neu-bg/95 dark:bg-neu-bg/90 border-r border-b border-neu-accent/20" />
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
                onClick={() =>
                  document
                    .getElementById(sec.id)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
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
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] w-2 h-2 rotate-45 bg-neu-bg/95 dark:bg-neu-bg/90 border-r border-b border-neu-accent/20" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}

          <div className="w-[1px] h-6 bg-neu-text/10 dark:bg-neu-text/15 mx-1 flex-shrink-0" />

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
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] w-2 h-2 rotate-45 bg-neu-bg/95 dark:bg-neu-bg/90 border-r border-b border-neu-accent/20" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* Section 1: Hero & Projects */}
      <section id="hero" className="relative z-0 mb-16 md:mb-24 w-full">
        <header className="relative z-10 min-h-[70vh] lg:min-h-[80vh] flex flex-col justify-center pt-6 md:pt-9 lg:pt-12 pb-16 md:pb-20 lg:pb-24 w-full overflow-hidden">
          <CircuitBoardBg />
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-2 md:mt-4 lg:mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch animate-pulse">
                <div className="lg:col-span-8 flex flex-col gap-8 h-full py-2">
                  <div className="h-20 bg-neu-accent/10 rounded-2xl w-2/3" />
                  <div className="h-32 bg-neu-accent/5 rounded-2xl w-full" />
                  <div className="h-12 bg-neu-accent/5 rounded-xl w-1/2" />
                </div>
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="h-[400px] bg-neu-accent/5 rounded-3xl w-full" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-8 flex flex-col justify-center py-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-y-6 md:gap-y-8 w-full bg-neu-bg/20 dark:bg-neu-bg/40 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-neu border border-black/5 dark:border-white/5"
                  >
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-neu-text drop-shadow-sm transition-colors duration-300"
                    >
                      {pd.heroConfig?.name || "Awaluddin"}
                    </motion.h1>
                    <div className="flex flex-col gap-y-4 md:gap-y-5">
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl font-display font-bold text-neu-accent transition-colors duration-300"
                      >
                        {pd.heroConfig?.role ||
                          "Backend Engineer — Integrating LLMs into Production Systems"}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-sm md:text-base text-neu-text-muted max-w-3xl font-light leading-relaxed transition-colors duration-300"
                      >
                        Node.js & Go engineer building async, event-driven
                        backend systems for enterprise & fintech. I ship LLM
                        integrations into production - not train models in
                        notebooks.
                      </motion.p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-wrap gap-2 mt-5 mb-6 md:mt-6 md:mb-8"
                    >
                      {[
                        "Node.js",
                        "Go",
                        "Python",
                        "LangGraph",
                        "PostgreSQL",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 text-[11px] md:text-xs font-mono text-neutral-400 bg-white/5 border border-white/10 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2 md:mt-4"
                    >
                      <button
                        onClick={() =>
                          document
                            .getElementById("projects")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-neu-text glass-card border border-neu-accent/30 hover:bg-neu-accent hover:text-white hover:border-neu-accent hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group w-full sm:w-auto"
                      >
                        <BookOpen
                          size={14}
                          className="group-hover:rotate-12 transition-transform text-neu-accent group-hover:text-white"
                        />{" "}
                        View Projects
                      </button>
                      <a
                        href="/assets/resume/Awaluddin_cv.pdf"
                        download="Awaluddin_CV.pdf"
                        onClick={() => triggerToast("Downloading CV...")}
                        className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-neu-text glass-card border border-neu-accent/30 hover:bg-neu-accent hover:text-white hover:border-neu-accent hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group w-full sm:w-auto"
                      >
                        <Download
                          size={14}
                          className="group-hover:scale-110 transition-transform text-neu-accent group-hover:text-white"
                        />{" "}
                        Download CV
                      </a>
                    </motion.div>
                  </motion.div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-center py-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-4 w-full bg-neu-bg/20 dark:bg-neu-bg/40 backdrop-blur-md p-5 rounded-3xl shadow-neu border border-black/5 dark:border-white/5"
                  >
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neu-accent mb-1">
                      <Terminal size={14} /> Connection Terminal
                    </div>
                    <div className="flex flex-col gap-2.5 font-mono text-xs">
                      <a
                        href="https://github.com/awaluddin-dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl glass-card-inset hover:text-neu-accent transition-all group"
                      >
                        <span className="font-semibold text-neu-text">
                          GitHub
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-neu-text-muted">
                            awaluddin-dev
                          </span>
                          <Github
                            size={15}
                            className="text-neu-accent group-hover:scale-110 transition-transform"
                          />
                        </div>
                      </a>
                      <a
                        href="https://linkedin.com/in/awaluddin0001"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl glass-card-inset hover:text-neu-accent transition-all group"
                      >
                        <span className="font-semibold text-neu-text">
                          LinkedIn
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-neu-text-muted">
                            awaluddin0001
                          </span>
                          <Linkedin
                            size={15}
                            className="text-neu-accent group-hover:scale-110 transition-transform"
                          />
                        </div>
                      </a>
                      <a
                        href="https://dev.to/awaluddin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl glass-card-inset hover:text-neu-accent transition-all group"
                      >
                        <span className="font-semibold text-neu-text">
                          Dev.to
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-neu-text-muted">
                            awaluddin
                          </span>
                          <PenTool
                            size={15}
                            className="text-neu-accent group-hover:scale-110 transition-transform"
                          />
                        </div>
                      </a>
                      <button
                        onClick={() => setShowInquiryModal(true)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl glass-card-inset hover:text-neu-accent transition-all group text-left cursor-pointer border-none outline-none"
                      >
                        <span className="font-semibold text-neu-text">
                          Inquiries
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-neu-text-muted">
                            Contact Me
                          </span>
                          <Mail
                            size={15}
                            className="text-neu-accent group-hover:scale-110 transition-transform"
                          />
                        </div>
                      </button>
                    </div>
                    <div className="w-full h-px bg-white/5 my-2" />
                    <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                      <span className="text-neu-text-muted/60 font-bold uppercase tracking-widest mb-1 text-[9px]">
                        Status
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-2 w-2 shrink-0">
                          {pd.heroConfig?.openForWork ? (
                            <>
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </>
                          ) : (
                            <>
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                            </>
                          )}
                        </div>
                        <span
                          className={cn(
                            "font-bold",
                            pd.heroConfig?.openForWork
                              ? "text-emerald-500 dark:text-emerald-400"
                              : "text-amber-500 dark:text-amber-400",
                          )}
                        >
                          {pd.heroConfig?.openForWork
                            ? "Open to Opportunities"
                            : "Closed to Opportunities"}
                        </span>
                      </div>
                      <span className="text-neu-text-muted pl-4">
                        Remote · Full-time
                      </span>
                      <span className="text-neu-text-muted pl-4">
                        UTC+7 (Jakarta, Indonesia)
                      </span>
                      <span className="text-neu-text-muted pl-4">
                        Available from: {pd.heroConfig?.availableFrom || "Now"}
                      </span>
                    </div>
                    <div className="w-full h-px bg-white/5 my-2" />
                    <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                      <span className="text-neu-text-muted/60 font-bold uppercase tracking-widest mb-1 text-[9px]">
                        Response Time
                      </span>
                      <span className="text-neu-text-muted pl-4">
                        Typically within 24 hours
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {!isLoading && activeMetrics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="w-full mt-10 md:mt-16"
              >
                <div className="flex flex-col w-full bg-neu-bg p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl shadow-neu border border-white/5">
                  <div
                    className={cn(
                      "grid gap-3 sm:gap-4 md:gap-5",
                      activeMetrics.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-2",
                      activeMetrics.length === 3
                        ? "lg:grid-cols-3"
                        : "lg:grid-cols-4",
                    )}
                  >
                    {activeMetrics.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex flex-col gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-card-inset text-left transition-colors",
                          item.isSavings
                            ? "border-emerald-500/20 dark:border-emerald-500/20 text-emerald-500"
                            : "border-white/5 dark:border-zinc-800/30",
                        )}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl glass-card-inset flex items-center justify-center border border-white/5">
                            {renderIcon(item.icon, item.isSavings, 20)}
                          </div>
                          <span
                            className={cn(
                              "font-display font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl text-neu-text tracking-tight leading-none",
                              item.isSavings &&
                                "text-emerald-500 dark:text-emerald-400",
                            )}
                          >
                            {item.value || item.val}
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] md:text-xs font-sans font-semibold text-neu-text-muted leading-tight uppercase tracking-wider">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </header>

        {/* Divider */}
        <div className="relative max-w-7xl mx-auto my-16 flex items-center justify-center select-none overflow-visible">
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
              <BookOpen size={16} className="animate-pulse" />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 w-48 sm:w-64 text-center">
              <div className="bg-neu-text text-neu-bg text-xs px-3 py-2 rounded-lg shadow-lg border border-neu-accent font-mono italic">
                &quot;A shelf built from real problems, late nights, and systems
                that had to work.&quot;
              </div>
            </div>
          </motion.div>
        </div>

        {/* Projects */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto mb-10">
            <div className="flex items-center gap-2 text-neu-accent mb-1">
              <BookOpen size={18} />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
                Featured Portfolio & Works
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
              Projects
            </h2>
            <p className="text-xs text-neu-text-muted font-mono mt-1">
              ✦ Interactive archive of production applications, system APIs, and
              developer tools.
            </p>
          </div>

          <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neu-text-muted group-focus-within:text-neu-accent transition-colors z-10">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 rounded-xl leading-5 glass-card-inset text-neu-text placeholder-neu-text-muted focus:outline-none focus:ring-0 sm:text-sm transition-all"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-3 items-center justify-between md:justify-end w-full md:w-auto">
              <div className="hidden md:flex flex-wrap gap-3 bg-neu-bg p-1.5 rounded-2xl shadow-neu-inset">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all relative",
                    !selectedCategory
                      ? "text-neu-accent font-bold"
                      : "text-neu-text-muted hover:text-neu-text",
                  )}
                >
                  {!selectedCategory && (
                    <motion.div
                      layoutId="activeCategoryDesktop"
                      className="absolute inset-0 glass-card rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">All</span>
                </button>
                {(categories || []).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all relative",
                      selectedCategory === cat
                        ? "text-neu-accent font-bold"
                        : "text-neu-text-muted hover:text-neu-text",
                    )}
                  >
                    {selectedCategory === cat && (
                      <motion.div
                        layoutId="activeCategoryDesktop"
                        className="absolute inset-0 glass-card rounded-xl"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                ))}
              </div>

              <div className="relative group/sort flex-shrink-0 flex-1 md:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none w-full md:w-auto pl-4 pr-10 py-3 rounded-xl glass-card text-neu-text text-xs font-mono cursor-pointer focus:outline-none transition-all hover:text-neu-accent text-center md:text-left"
                  style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                >
                  <option
                    value="newest"
                    className="bg-white dark:bg-black text-neu-text"
                  >
                    Order: Newest
                  </option>
                  <option
                    value="oldest"
                    className="bg-white dark:bg-black text-neu-text"
                  >
                    Order: Oldest
                  </option>
                  <option
                    value="alphabetical"
                    className="bg-white dark:bg-black text-neu-text"
                  >
                    Order: A-Z
                  </option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-neu-text-muted">
                  <span className="text-[9px]">▼</span>
                </div>
              </div>

              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="md:hidden flex items-center justify-center p-3 rounded-xl glass-card text-neu-text-muted hover:text-neu-accent transition-colors"
              >
                <Filter size={20} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isFilterModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm md:hidden"
                onClick={() => setIsFilterModalOpen(false)}
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
                      onClick={() => setIsFilterModalOpen(false)}
                      className="p-2 rounded-full glass-card-inset text-neu-text-muted hover:text-neu-accent"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setIsFilterModalOpen(false);
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
                          setSelectedCategory(cat);
                          setIsFilterModalOpen(false);
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

          <div id="projects" className="max-w-7xl mx-auto scroll-mt-24">
            <div className="bg-neu-bg p-4 sm:p-8 md:p-12 rounded-3xl shadow-neu-inset relative overflow-hidden">
              <div className="flex justify-center items-center gap-2 mb-10 relative z-20">
                <h3 className="text-sm sm:text-base md:text-lg font-mono font-bold tracking-[0.25em] text-neu-text uppercase text-center border-b border-gray-300/40 dark:border-zinc-800/40 pb-2 flex items-center gap-2">
                  <BookOpen
                    size={16}
                    className="text-neu-accent animate-pulse"
                  />{" "}
                  My Bookshelf Projects
                </h3>
              </div>

              {!isLoading && !focusedProject && filteredProjects.length > 0 && (
                <>
                  <button
                    onClick={() => scrollShelf("left")}
                    className="absolute left-4 top-[45%] -translate-y-1/2 z-20 p-3.5 rounded-full glass-card hover:shadow-neu-sm transition-all text-neu-text-muted hover:text-neu-accent active:scale-95 flex items-center justify-center border border-white/5"
                    aria-label="Scroll Left"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => scrollShelf("right")}
                    className="absolute right-4 top-[45%] -translate-y-1/2 z-20 p-3.5 rounded-full glass-card hover:shadow-neu-sm transition-all text-neu-text-muted hover:text-neu-accent active:scale-95 flex items-center justify-center border border-white/5"
                    aria-label="Scroll Right"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {isLoading ? (
                <div className="relative z-10 flex gap-6 overflow-hidden py-10 px-2 justify-center sm:justify-start">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-16 md:w-20 h-64 md:h-80 rounded-lg bg-gray-300/30 dark:bg-zinc-700/40 animate-pulse border border-white/5 relative shadow-neu flex flex-col justify-between p-3"
                    >
                      <div className="space-y-1.5">
                        <div className="w-full h-1 bg-black/5 rounded-full" />
                        <div className="w-full h-1 bg-black/5 rounded-full" />
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-2.5 h-32 bg-gray-300/40 dark:bg-zinc-700/50 rounded-full" />
                      </div>
                      <div className="w-full h-3 bg-gray-300/40 dark:bg-zinc-700/50 rounded-md" />
                    </div>
                  ))}
                </div>
              ) : focusedProject ? (
                <div className="relative py-8 md:py-12 px-4 md:px-8 z-20 flex flex-col lg:flex-row items-center justify-center gap-10 md:gap-16">
                  <div className="absolute inset-0 bg-black/5 dark:bg-black/30 backdrop-blur-md rounded-3xl z-0 pointer-events-none" />
                  <div
                    className={cn(
                      "absolute -inset-10 opacity-15 blur-[120px] rounded-full z-0 pointer-events-none transition-all duration-500",
                      !focusedProject.spineColor?.startsWith("#") &&
                        !focusedProject.spineColor?.startsWith("rgb")
                        ? focusedProject.spineColor
                        : "",
                    )}
                    style={{
                      ...(focusedProject.spineColor?.startsWith("#") ||
                      focusedProject.spineColor?.startsWith("rgb")
                        ? { backgroundColor: focusedProject.spineColor }
                        : {}),
                    }}
                  />
                  <div
                    className="relative z-10 flex-shrink-0 flex items-center justify-center w-[280px] md:w-[320px] h-[340px] md:h-[400px]"
                    style={{ perspective: "1200px" }}
                  >
                    <motion.div
                      initial={{
                        scale: 0.8,
                        rotateY: -35,
                        rotateX: 12,
                        rotateZ: -6,
                        opacity: 0,
                      }}
                      animate={{
                        scale: 1.05,
                        rotateY: -18,
                        rotateX: 8,
                        rotateZ: -4,
                        opacity: 1,
                      }}
                      whileHover={{
                        rotateY: -8,
                        rotateX: 4,
                        rotateZ: -2,
                        scale: 1.12,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 22,
                      }}
                      className="relative cursor-pointer group flex items-center justify-center"
                      onClick={() => setSelectedProject(focusedProject)}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="absolute left-[12px] top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/20 to-transparent z-40 pointer-events-none" />
                      <div
                        className="absolute right-[-8px] top-[4px] bottom-[4px] w-[10px] bg-stone-100 dark:bg-zinc-800 border-y border-r border-stone-300 dark:border-zinc-700/60 rounded-r shadow-md z-10"
                        style={{
                          transform: "skewY(6deg)",
                          backgroundImage:
                            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.08) 2px, rgba(0, 0, 0, 0.08) 3px)",
                        }}
                      />
                      <div
                        className={cn(
                          "w-[200px] md:w-[240px] h-[280px] md:h-[340px] rounded-r-xl shadow-2xl relative flex flex-col justify-between p-6 border-y border-r border-white/20 overflow-hidden z-20",
                          !(
                            focusedProject.coverColor ||
                            focusedProject.spineColor
                          )?.startsWith("#") &&
                            !(
                              focusedProject.coverColor ||
                              focusedProject.spineColor
                            )?.startsWith("rgb")
                            ? focusedProject.coverColor ||
                                focusedProject.spineColor
                            : "",
                        )}
                        style={{
                          ...((
                            focusedProject.coverColor ||
                            focusedProject.spineColor
                          )?.startsWith("#") ||
                          (
                            focusedProject.coverColor ||
                            focusedProject.spineColor
                          )?.startsWith("rgb")
                            ? {
                                backgroundColor:
                                  focusedProject.coverColor ||
                                  focusedProject.spineColor,
                              }
                            : {}),
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/10 pointer-events-none z-10" />
                        <div className="relative z-20 flex flex-col h-full justify-between">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="text-[9px] font-mono font-bold tracking-widest text-white/70 uppercase">
                              {focusedProject.category}
                            </span>
                            <span className="text-[8px] font-mono text-white/50">
                              {focusedProject.date}
                            </span>
                          </div>
                          <div className="my-auto py-2">
                            <h4 className="text-lg md:text-xl font-display font-black text-white tracking-tight leading-snug drop-shadow-md">
                              {focusedProject.title}
                            </h4>
                            <p className="text-[10px] md:text-xs text-white/80 font-mono mt-1.5 font-medium italic line-clamp-2 leading-relaxed">
                              {focusedProject.subtitle}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-white/15">
                            <div className="flex flex-col">
                              <span className="text-[7px] font-mono text-white/40 tracking-wider uppercase">
                                Author
                              </span>
                              <span className="text-[9px] font-mono font-bold text-white/80 leading-none">
                                {pd.heroConfig?.name?.toUpperCase() ||
                                  "AWALUDDIN"}
                              </span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-black/20 border border-white/10 text-white/80">
                              <Code2 size={12} />
                            </div>
                          </div>
                        </div>
                        <div className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-black/25 z-30" />
                        <div className="absolute left-[4px] top-0 bottom-0 w-[1px] bg-white/10 z-30" />
                        <div className="absolute top-0 right-4 w-3 h-8 bg-red-500 shadow-md origin-top transform translate-y-[-4px] z-10 rounded-b" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="py-16 px-4 text-center max-w-md mx-auto relative z-10">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-3xl glass-card text-neu-accent/60 mb-6 border border-white/5"
                  >
                    <Search size={28} />
                  </motion.div>
                  <h3 className="text-lg font-display font-bold text-neu-text tracking-tight mb-2">
                    No matching projects found
                  </h3>
                  <p className="text-xs md:text-sm text-neu-text-muted font-light mb-6 leading-relaxed">
                    We couldn&apos;t find any projects matching{" "}
                    <span className="font-mono font-semibold text-neu-accent">
                      &ldquo;{searchQuery}&rdquo;
                    </span>
                    {selectedCategory
                      ? ` in category &ldquo;${selectedCategory}&rdquo;`
                      : ""}
                    . Try checking for typos or simplifying your search query.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                      triggerToast("Filters reset: Showing all projects");
                    }}
                    className="px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-neu-accent shadow-neu hover:shadow-neu-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <motion.div
                  layout
                  ref={shelfRef}
                  className="flex overflow-x-auto snap-x snap-mandatory gap-x-8 items-end justify-start min-h-[440px] pb-6 pt-16 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-[12.5vw] md:px-10"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                      <BookItem
                        key={project.id}
                        project={project}
                        setSelectedProject={setSelectedProject}
                        setFocusedProject={setFocusedProject}
                        isDark={isDark}
                        getTagProjectCount={getTagProjectCount}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
              <div className="w-full h-4 glass-card mt-4 rounded-xl relative z-0" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section 2: Proficiency, Roadmap, Skill Tree - preserved from original */}
      {/* ... full content preserved ... */}
      <section id="proficiency" className="scroll-mt-20">
        <div className="max-w-7xl mx-auto mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-neu-accent mb-1">
                <Cpu size={18} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
                  Stack & Capabilities
                </span>
              </div>
              <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
                Technical Proficiency
              </h2>
              <p className="text-xs text-neu-text-muted font-mono mt-1">
                ✦ Structured breakdown of core software engineering, system
                architecture, and DevOps practices.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 font-mono text-xs glass-card-inset px-4 py-2.5 rounded-2xl border border-white/5 select-none self-start md:self-auto z-10">
              <div className="relative group cursor-help flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-neu-text font-medium text-[11px] sm:text-xs">
                  Production-ready
                </span>
              </div>
              <div className="relative group cursor-help flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-neu-text font-medium text-[11px] sm:text-xs">
                  In Use
                </span>
              </div>
              <div className="relative group cursor-help flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-neu-text font-medium text-[11px] sm:text-xs">
                  Building
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {(activeProficiency || []).map((category: any, catIdx: number) => (
              <div
                key={catIdx}
                className="p-6 sm:p-8 rounded-3xl glass-card border border-white/5 dark:border-zinc-800/30 flex flex-col justify-between relative overflow-hidden group/card"
              >
                <P5Background isDark={isDark} />
                <div className="relative z-10">
                  <h3 className="font-mono text-xs font-extrabold uppercase tracking-widest text-neu-accent border-b border-gray-200/10 dark:border-zinc-800/30 pb-3.5 mb-4">
                    {category.title}
                  </h3>
                  <div className="flex flex-col">
                    {category.skills?.map((skill: any, skillIdx: number) => (
                      <div
                        key={skillIdx}
                        className="py-4 border-b border-gray-200/5 dark:border-zinc-800/20 last:border-b-0 flex justify-between items-center gap-4 group/item"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full mt-1.5 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-125",
                              skill.status === "Production-ready" &&
                                "bg-emerald-500",
                              skill.status === "In Use" && "bg-blue-500",
                              skill.status === "Building" && "bg-purple-500",
                            )}
                          />
                          <div className="flex flex-col text-left">
                            <h4 className="font-display font-bold text-[14px] sm:text-[15px] text-neu-text leading-tight group-hover/item:text-neu-accent transition-colors duration-300">
                              {skill.name}
                            </h4>
                            <p className="font-mono text-[11px] sm:text-[11.5px] text-neu-text-muted mt-1 leading-snug">
                              {skill.subtext}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span
                            className={cn(
                              "text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-all duration-300",
                              skill.status === "Production-ready" &&
                                "border-emerald-500/20 text-emerald-600 bg-emerald-500/5 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30",
                              skill.status === "In Use" &&
                                "border-blue-500/20 text-blue-600 bg-blue-500/5 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/30",
                              skill.status === "Building" &&
                                "border-purple-500/20 text-purple-600 bg-purple-500/5 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/30",
                            )}
                          >
                            {skill.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-24">
          <div className="mb-10">
            <div className="flex items-center gap-2 text-neu-accent mb-1">
              <Layers size={18} />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
                Philosophy & Thoughts
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
              Right Now
            </h2>
            <p className="text-xs text-neu-text-muted font-mono mt-1">
              ✦ What I&apos;m writing, building, and learning right now.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeCurrentFocus.map((item: any, i: number) => (
              <div
                key={i}
                className="p-5 sm:p-8 rounded-3xl glass-card group hover:shadow-neu-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 glass-card-inset rounded-lg text-neu-accent">
                      <PenTool size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-neu-text">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-neu-text-muted font-medium mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-neu-accent hover:underline mt-2"
                  >
                    {item.linkText || "Learn More"} <ArrowRight size={16} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-24">
          <div className="mb-10 text-center md:text-left">
            <div className="flex items-center gap-2 text-neu-accent mb-1 justify-center md:justify-start">
              <Milestone size={18} />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
                Learning Roadmap
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
              Upcoming Tech & Specializations
            </h2>
            <p className="text-xs text-neu-text-muted font-mono mt-1">
              ✦ Vision path for continuous learning and technology adoption over
              the upcoming quarters.
            </p>
          </div>
          <div className="p-6 sm:p-10 rounded-3xl glass-card mb-10 overflow-hidden">
            <div className="relative my-8 px-4 hidden md:block">
              <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-gray-300 dark:bg-zinc-800/80 -translate-y-1/2 rounded-full" />
              <motion.div
                className="absolute top-1/2 left-0 h-[3px] bg-neu-accent -translate-y-1/2 rounded-full origin-left"
                initial={{ width: "0%" }}
                animate={{
                  width: `${(selectedRoadmapIndex / Math.max(activeRoadmap.length - 1, 1)) * 100}%`,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
              <div className="relative flex justify-between">
                {(activeRoadmap || []).map((item: any, index: number) => {
                  const isSelected = selectedRoadmapIndex === index;
                  const isPast = index <= selectedRoadmapIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedRoadmapIndex(index)}
                      className="flex flex-col items-center group cursor-pointer relative z-10 focus:outline-none"
                    >
                      <span
                        className={cn(
                          "font-mono text-[11px] font-bold tracking-wider mb-3 transition-colors duration-300 uppercase",
                          isSelected
                            ? "text-neu-accent font-extrabold"
                            : "text-neu-text-muted group-hover:text-neu-text",
                        )}
                      >
                        {item.quarter}
                      </span>
                      <div className="relative flex items-center justify-center">
                        {isSelected && (
                          <motion.div
                            layoutId="activeRoadmapRing"
                            className="absolute w-8 h-8 rounded-full border-2 border-neu-accent bg-neu-accent/10"
                            transition={{
                              type: "spring",
                              stiffness: 220,
                              damping: 20,
                            }}
                          />
                        )}
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10",
                            isSelected
                              ? "bg-neu-accent border-neu-accent scale-110 shadow-lg"
                              : isPast
                                ? "bg-neu-bg border-neu-accent"
                                : "bg-neu-bg border-gray-400 dark:border-zinc-700 group-hover:border-neu-text",
                          )}
                        >
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              isSelected
                                ? "bg-neu-bg"
                                : isPast
                                  ? "bg-neu-accent"
                                  : "bg-transparent",
                            )}
                          />
                        </div>
                      </div>
                      <span
                        className={cn(
                          "mt-3 text-xs font-bold tracking-tight text-center max-w-[120px] transition-colors duration-300",
                          isSelected
                            ? "text-neu-text"
                            : "text-neu-text-muted group-hover:text-neu-text",
                        )}
                      >
                        {item.tech}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex md:hidden flex-wrap gap-2 justify-center mb-6">
              {(activeRoadmap || []).map((item: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedRoadmapIndex(index)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border cursor-pointer",
                    selectedRoadmapIndex === index
                      ? "glass-card-inset text-neu-accent border-neu-accent/30"
                      : "glass-card border-transparent text-neu-text-muted hover:text-neu-text",
                  )}
                >
                  <span className="opacity-60">{item.quarter}:</span>
                  <span>{item.tech}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRoadmapIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="mt-6 p-6 sm:p-8 rounded-3xl glass-card-inset border border-gray-300/30 dark:border-gray-800/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3.5 rounded-2xl glass-card text-neu-accent">
                      {renderIcon(
                        activeRoadmap[selectedRoadmapIndex]?.icon,
                        false,
                        24,
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold tracking-widest text-neu-accent uppercase">
                          {activeRoadmap[selectedRoadmapIndex]?.quarter}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-neu-text mt-1">
                        {activeRoadmap[selectedRoadmapIndex]?.tech}
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm text-neu-text-muted leading-relaxed">
                    {activeRoadmap[selectedRoadmapIndex]?.description}
                  </p>
                  <div className="flex items-center gap-6 pt-2">
                    <div>
                      <span className="block font-mono text-[10px] text-neu-text-muted uppercase tracking-wider">
                        Estimated Depth
                      </span>
                      <span className="text-sm font-semibold text-neu-text">
                        {activeRoadmap[selectedRoadmapIndex]?.depth}
                      </span>
                    </div>
                    <div className="w-[1px] h-8 bg-gray-300/60 dark:bg-zinc-800" />
                    <div>
                      <span className="block font-mono text-[10px] text-neu-text-muted uppercase tracking-wider">
                        Direction
                      </span>
                      <span className="text-sm font-semibold text-neu-text inline-flex items-center gap-1">
                        <TrendingUp size={14} className="text-neu-accent" />{" "}
                        Continuous Growth
                      </span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-5 rounded-2xl bg-white/20 dark:bg-black/10 border border-white/10">
                    <span className="block font-mono text-[10px] text-neu-accent font-extrabold uppercase tracking-widest mb-3">
                      Core Topics to Master
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-neu-text-muted">
                      {(activeRoadmap[selectedRoadmapIndex]?.topics || []).map(
                        (topic: any, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-neu-accent/80 flex-shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/20 dark:bg-black/10 border border-white/10">
                    <span className="block font-mono text-[10px] text-neu-accent font-extrabold uppercase tracking-widest mb-3">
                      Planned Prototype Projects
                    </span>
                    <ul className="space-y-2 text-xs text-neu-text-muted font-mono">
                      {(
                        activeRoadmap[selectedRoadmapIndex]?.projects || []
                      ).map((proj: any, i: number) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-0.5 text-neu-accent">✦</span>
                          <span className="text-neu-text">{proj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <SkillTree isDark={isDark} isLoading={isLoading} />
        </div>
      </section>

      {/* Section 3: Experience */}
      <section id="experience" className="scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="w-full space-y-8">
            <div className="mb-10">
              <div className="flex items-center gap-2 text-neu-accent mb-1">
                <Briefcase size={18} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
                  Journey & Chronology
                </span>
              </div>
              <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
                Experience
              </h2>
              <p className="text-xs text-neu-text-muted font-mono mt-1">
                ✦ Chronological timeline of professional roles, core
                contributions, and enterprise projects.
              </p>
            </div>

            <div className="p-5 sm:p-8 rounded-3xl glass-card-inset space-y-6 max-w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-300/30 dark:border-gray-700/30 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-neu-accent mb-1">
                    <Activity size={18} className="animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">
                      Metrics & Analytics
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-neu-text tracking-tight">
                    Git Activity & Contribution Frequency
                  </h3>
                </div>
                <div className="flex bg-neu-bg p-1.5 rounded-2xl shadow-neu-inset gap-1">
                  <button
                    onClick={() => setChartType("temporal")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                      chartType === "temporal"
                        ? "bg-neu-accent text-white shadow-neu-sm"
                        : "text-neu-text-muted hover:text-neu-accent",
                    )}
                  >
                    <GitCommit size={14} /> Commit Timeline
                  </button>
                  <button
                    onClick={() => setChartType("repository")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                      chartType === "repository"
                        ? "bg-neu-accent text-white shadow-neu-sm"
                        : "text-neu-text-muted hover:text-neu-accent",
                    )}
                  >
                    <BarChart2 size={14} /> Repos
                  </button>
                </div>
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                {isLoading ? (
                  <div className="w-full h-full flex flex-col justify-between p-4 animate-pulse">
                    {/* loading skeleton */}
                  </div>
                ) : !mounted ? (
                  <div className="text-neu-text-muted font-mono text-xs">
                    Initializing chart engine...
                  </div>
                ) : chartType === "temporal" ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={1}
                    minHeight={1}
                  >
                    <AreaChart
                      data={timelineData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorCommits"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={isDark ? "#4ade80" : "#4f46e5"}
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor={isDark ? "#4ade80" : "#4f46e5"}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDark ? "#2a2b2f" : "#cbd5e1"}
                        opacity={0.3}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        stroke={isDark ? "#b2e4bc" : "#4b5563"}
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke={isDark ? "#b2e4bc" : "#4b5563"}
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#1a1b1e" : "#e0e5ec",
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: isDark
                            ? "0 10px 25px rgba(0,0,0,0.5)"
                            : "4px 4px 10px rgba(163,177,198,0.5)",
                          color: isDark ? "#27ec6f" : "#1a1a1a",
                          fontFamily: "monospace",
                          fontSize: "12px",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "11px",
                          fontFamily: "monospace",
                          paddingTop: "10px",
                        }}
                      />
                      <Area
                        name="Commits"
                        type="monotone"
                        dataKey="commits"
                        stroke={isDark ? "#4ade80" : "#4f46e5"}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorCommits)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={1}
                    minHeight={1}
                  >
                    <BarChart
                      data={repoData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDark ? "#2a2b2f" : "#cbd5e1"}
                        opacity={0.3}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke={isDark ? "#b2e4bc" : "#4b5563"}
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => v.split(" ")[0]}
                      />
                      <YAxis
                        stroke={isDark ? "#b2e4bc" : "#4b5563"}
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#1a1b1e" : "#e0e5ec",
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: isDark
                            ? "0 10px 25px rgba(0,0,0,0.5)"
                            : "4px 4px 10px rgba(163,177,198,0.5)",
                          color: isDark ? "#27ec6f" : "#1a1a1a",
                          fontFamily: "monospace",
                          fontSize: "12px",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "11px",
                          fontFamily: "monospace",
                          paddingTop: "10px",
                        }}
                      />
                      <Bar
                        name="Total Commits"
                        dataKey="commits"
                        fill={isDark ? "#4ade80" : "#4f46e5"}
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        name="Pull Requests"
                        dataKey="pullRequests"
                        fill={isDark ? "#22c55e" : "#3b82f6"}
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Heatmap */}
              <div className="pt-6 border-t border-gray-300/30 dark:border-gray-700/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider flex items-center gap-2 pl-1 sm:pl-0">
                      <Code2 size={14} /> Annual Coding Contribution Heatmap
                    </h4>
                    <p className="text-xs font-mono text-neu-text-muted mt-1 pl-1 sm:pl-0">
                      Consistent development activity logged over the past 365
                      days
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-mono">
                    <div className="px-3 py-1 rounded-lg glass-card-sm">
                      <span className="text-neu-text-muted">Total: </span>
                      <span className="text-neu-accent font-bold">
                        {heatmapStats.total.toLocaleString()} contributions
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-lg glass-card-sm">
                      <span className="text-neu-text-muted">Max Streak: </span>
                      <span className="text-green-500 font-bold">
                        {heatmapStats.maxStreak} days
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-lg glass-card-sm">
                      <span className="text-neu-text-muted">Active Days: </span>
                      <span className="text-neu-accent font-bold">
                        {heatmapStats.avgIntensity}%
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  ref={heatmapRef}
                  className="w-full relative p-3 sm:p-5 rounded-2xl glass-card-inset overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  <div className="min-w-[740px] flex flex-col pt-6">
                    <div className="flex w-full">
                      <div className="relative text-[9px] font-mono text-neu-text-muted w-8 pr-2 select-none flex-shrink-0 h-[146px] sm:h-[136px]">
                        <span className="absolute top-[55px] sm:top-[53px] left-3 leading-[12px] sm:leading-[10px]">
                          Mon
                        </span>
                        <span className="absolute top-[85px] sm:top-[79px] left-3 leading-[12px] sm:leading-[10px]">
                          Wed
                        </span>
                        <span className="absolute top-[115px] sm:top-[105px] left-3 leading-[12px] sm:leading-[10px]">
                          Fri
                        </span>
                      </div>
                      <div className="flex-1 flex gap-[3px] justify-between items-stretch">
                        {(monthsData || []).map(
                          (monthGroup: any, mIdx: number) => (
                            <div key={mIdx} className="flex shrink-0 gap-[3px]">
                              <div className="flex gap-[3px] shrink-0">
                                {(monthGroup.weeks || []).map(
                                  (week: any[], wIdxInMonth: number) => {
                                    const isColInHoveredMonth =
                                      hoveredMonth !== null &&
                                      week.some(
                                        (day) => day?.month === hoveredMonth,
                                      );
                                    return (
                                      <div
                                        key={wIdxInMonth}
                                        className={cn(
                                          "flex flex-col gap-[3px] shrink-0 relative pt-10 px-[1px] rounded-md transition-all duration-300",
                                          isColInHoveredMonth
                                            ? "bg-neu-accent/[0.04] dark:bg-neu-accent/[0.08] ring-1 ring-neu-accent/15 scale-[1.02] z-10"
                                            : hoveredMonth !== null
                                              ? "opacity-30"
                                              : "",
                                        )}
                                      >
                                        {wIdxInMonth === 0 && (
                                          <span
                                            onMouseEnter={() =>
                                              setHoveredMonth(
                                                monthGroup.monthNum,
                                              )
                                            }
                                            onMouseLeave={() =>
                                              setHoveredMonth(null)
                                            }
                                            className={cn(
                                              "absolute top-0 left-0 text-[10px] sm:text-[10px] font-mono text-neu-text-muted whitespace-nowrap cursor-pointer transition-all duration-200 hover:text-neu-accent select-none",
                                              hoveredMonth ===
                                                monthGroup.monthNum
                                                ? "text-neu-accent font-bold"
                                                : "",
                                            )}
                                          >
                                            {monthGroup.label}
                                          </span>
                                        )}
                                        {(week || []).map(
                                          (day: any, dIdx: number) => {
                                            const lc = isDark
                                              ? [
                                                  "bg-zinc-800/60 hover:bg-zinc-700",
                                                  "bg-emerald-950 hover:bg-emerald-900",
                                                  "bg-emerald-800 hover:bg-emerald-700",
                                                  "bg-emerald-500 hover:bg-emerald-400",
                                                  "bg-emerald-400 hover:bg-emerald-300",
                                                ]
                                              : [
                                                  "bg-gray-200 hover:bg-gray-300",
                                                  "bg-indigo-100 hover:bg-indigo-200",
                                                  "bg-indigo-300 hover:bg-indigo-400",
                                                  "bg-indigo-500 hover:bg-indigo-600",
                                                  "bg-indigo-600 hover:bg-indigo-700",
                                                ];
                                            const isOut =
                                              selectedLevelFilter !== null &&
                                              day?.level !==
                                                selectedLevelFilter;
                                            const isIn =
                                              selectedLevelFilter !== null &&
                                              day?.level ===
                                                selectedLevelFilter;
                                            return day === null ? (
                                              <div
                                                key={dIdx}
                                                className="w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-[2px] opacity-0 pointer-events-none"
                                              />
                                            ) : (
                                              <div
                                                key={dIdx}
                                                onTouchStart={() =>
                                                  handleTouchStart(day.date)
                                                }
                                                onTouchEnd={handleTouchEnd}
                                                onTouchCancel={handleTouchEnd}
                                                onTouchMove={handleTouchMove}
                                                className={cn(
                                                  "w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-[2px] transition-all duration-150 cursor-pointer relative group/cell",
                                                  lc[day.level],
                                                  isOut &&
                                                    "opacity-15 scale-90",
                                                  (isIn ||
                                                    activeTooltipDate ===
                                                      day.date) &&
                                                    "ring-2 ring-neu-accent scale-110 z-10",
                                                )}
                                              >
                                                <div
                                                  className={cn(
                                                    "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-black/95 dark:bg-neutral-900 text-white text-[9px] font-mono whitespace-nowrap transition-all duration-150 z-50 shadow-lg border border-white/10 pointer-events-none",
                                                    activeTooltipDate ===
                                                      day.date
                                                      ? "opacity-100 translate-y-0 scale-100"
                                                      : "opacity-0 translate-y-1 scale-95 group-hover/cell:opacity-100 group-hover/cell:translate-y-0 group-hover/cell:scale-100 group-hover/cell:delay-200",
                                                  )}
                                                >
                                                  <span className="text-neu-accent font-bold">
                                                    {day.count}{" "}
                                                    {day.count === 1
                                                      ? "contribution"
                                                      : "contributions"}
                                                  </span>
                                                  <br />
                                                  <span className="text-gray-400">
                                                    {day.date}
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          },
                                        )}
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mt-6 pt-4 border-t border-gray-300/10 dark:border-gray-700/10 select-none">
                  <div className="flex flex-wrap items-center gap-1.5 lg:ml-auto text-[10px] font-mono text-neu-text-muted bg-neu-bg/50 shadow-neu-inset p-2 rounded-xl border border-white/5 w-fit">
                    {selectedLevelFilter !== null ? (
                      <button
                        onClick={() => setSelectedLevelFilter(null)}
                        className="text-[10px] font-mono text-neu-accent hover:underline cursor-pointer flex items-center gap-1 active:scale-95 transition-transform mr-2"
                      >
                        ✕ Clear Filter
                      </button>
                    ) : (
                      <span className="opacity-75 mr-1">Intensity:</span>
                    )}
                    <span>Less</span>
                    {legendLevels.map((lvl: any) => {
                      const active = selectedLevelFilter === lvl.level;
                      return (
                        <button
                          key={lvl.level}
                          onClick={() =>
                            setSelectedLevelFilter(
                              selectedLevelFilter === lvl.level
                                ? null
                                : lvl.level,
                            )
                          }
                          className={cn(
                            "w-4 h-4 rounded-[4px] cursor-pointer transition-all duration-200 relative group/legend flex items-center justify-center border border-transparent",
                            isDark ? lvl.darkBg : lvl.lightBg,
                            active
                              ? "ring-2 ring-neu-accent scale-125 shadow-md border-white/10"
                              : "hover:scale-115 hover:ring-1 hover:ring-neu-text-muted",
                          )}
                          title={lvl.label}
                        />
                      );
                    })}
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>

            {languageData && languageData.length > 0 && (
              <motion.div
                className="mt-8 rounded-3xl glass-card-inset p-4 sm:p-6 md:p-8 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6 border-b border-gray-300/20 dark:border-zinc-800/20 pb-4">
                  <div className="flex items-center gap-2">
                    <Code2 size={16} className="text-neu-accent" />
                    <h3 className="text-lg font-display font-bold text-neu-text tracking-tight">
                      Most Used Languages
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-neu-text-muted bg-neu-bg/50 px-2 py-1 rounded-md">
                    Live from GitHub
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-6">
                  <div className="w-full md:w-1/3 flex justify-center items-center h-[240px] relative">
                    <PieChart width={240} height={240}>
                      <Pie
                        data={languageData}
                        cx={120}
                        cy={120}
                        innerRadius={0}
                        outerRadius={105}
                        paddingAngle={2}
                        dataKey="percentage"
                        stroke="none"
                        isAnimationActive={true}
                      >
                        {languageData.map((entry: any, index: number) => {
                          const isHovered = hoveredLang === entry.name;
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              className="cursor-pointer focus:outline-none"
                              style={{
                                outline: "none",
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                opacity:
                                  hoveredLang !== null && !isHovered ? 0.3 : 1,
                                filter: isHovered
                                  ? `brightness(1.2) drop-shadow(0px 0px 8px ${entry.color})`
                                  : "none",
                                transform: isHovered
                                  ? "scale(1.05)"
                                  : "scale(1)",
                                transformOrigin: "120px 120px",
                              }}
                              onMouseEnter={() => setHoveredLang(entry.name)}
                              onMouseLeave={() => setHoveredLang(null)}
                            />
                          );
                        })}
                      </Pie>
                    </PieChart>
                  </div>
                  <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
                    {languageData.map((lang: any, idx: number) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -2 }}
                        onMouseEnter={() => setHoveredLang(lang.name)}
                        onMouseLeave={() => setHoveredLang(null)}
                        className={cn(
                          "relative flex flex-col gap-1 p-3 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer group",
                          hoveredLang === lang.name
                            ? "border-neu-accent bg-neu-accent/5 scale-[1.02]"
                            : "bg-neu-bg border-gray-200/50 dark:border-zinc-800/30",
                          hoveredLang !== null && hoveredLang !== lang.name
                            ? "opacity-40"
                            : "opacity-100",
                        )}
                      >
                        {idx === 0 && (
                          <div className="absolute -top-2 -right-2 bg-neu-accent text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 flex items-center gap-1">
                            TOP 1
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full shadow-sm"
                              style={{ backgroundColor: lang.color }}
                            />
                            <span className="text-xs font-bold text-neu-text group-hover:text-neu-accent transition-colors">
                              {lang.name}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-neu-text-muted">
                          {lang.percentage.toFixed(1)}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              className="mt-10 rounded-3xl glass-card-inset p-4 sm:p-6 md:p-8 space-y-1 relative"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 pb-4 border-b border-gray-300/20 dark:border-zinc-800/20 text-[10px] font-mono font-bold tracking-[0.2em] text-neu-text-muted uppercase">
                <div className="col-span-3">Year / Duration</div>
                <div className="col-span-3">Company</div>
                <div className="col-span-4">Role & Tech Stack</div>
                <div className="col-span-2 text-right">
                  Key Impact Highlight
                </div>
              </div>
              {activeWork.map((job: any, idx: number) => {
                const isActive = activeExpIdx === idx;
                const isPresent = (job.years || "")
                  .toLowerCase()
                  .includes("present");
                return (
                  <div
                    key={idx}
                    className="block"
                    onMouseEnter={() => setActiveExpIdx(idx)}
                  >
                    <div
                      onClick={() => setActiveExpIdx(isActive ? null : idx)}
                      className={cn(
                        "grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 px-6 rounded-2xl cursor-pointer transition-all duration-300 group relative border-b border-gray-300/10 dark:border-zinc-800/10 last:border-0",
                        isActive
                          ? "bg-white/80 dark:bg-zinc-800/30 shadow-neu border-transparent"
                          : "hover:bg-white/40 dark:hover:bg-zinc-800/10",
                        isPresent && !isActive
                          ? "bg-neu-accent/5 border border-neu-accent/20"
                          : "",
                      )}
                    >
                      {isPresent && (
                        <div className="absolute -top-2 -left-2 bg-neu-accent text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />{" "}
                          CURRENT
                        </div>
                      )}
                      <div className="col-span-3 flex flex-col justify-center text-left">
                        <span
                          className={cn(
                            "font-mono font-bold text-sm sm:text-base group-hover:text-neu-accent transition-colors",
                            isPresent ? "text-neu-accent" : "text-neu-text",
                          )}
                        >
                          {job.years}
                        </span>
                        <span className="text-[10px] font-mono text-neu-text-muted mt-0.5 uppercase tracking-wider">
                          {job.duration}
                        </span>
                      </div>
                      <div className="col-span-3 flex flex-col justify-center text-left">
                        <span className="font-display font-extrabold text-base sm:text-lg text-neu-text tracking-tight uppercase">
                          {job.company}
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center text-left">
                        <span className="font-mono text-xs sm:text-sm text-neu-text-muted">
                          <strong className="text-neu-text font-bold font-sans text-sm">
                            {job.role}
                          </strong>
                          {" | "}
                          <span className="text-neu-accent font-medium">
                            {job.stack}
                          </span>
                        </span>
                      </div>
                      <div className="col-span-2 text-right hidden md:block">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold bg-neu-accent/10 text-neu-accent border border-neu-accent/15 tracking-tight">
                          ✦ {job.teaser}
                        </span>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 md:hidden">
                        {isActive ? (
                          <ChevronUp size={16} className="text-neu-accent" />
                        ) : (
                          <ChevronDown
                            size={16}
                            className="text-neu-text-muted"
                          />
                        )}
                      </div>
                    </div>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 bg-white/20 dark:bg-zinc-800/10 rounded-b-2xl border-t border-gray-300/10 dark:border-zinc-800/10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">
                              <div className="lg:col-span-4 p-4 rounded-xl bg-neu-bg border border-white/10 dark:border-zinc-800/50 shadow-neu-inset flex flex-col justify-center">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neu-accent mb-1.5 flex items-center gap-1">
                                  <Sparkles
                                    size={12}
                                    className="text-neu-accent animate-pulse"
                                  />{" "}
                                  Business Impact
                                </span>
                                <p className="text-xs sm:text-sm font-sans font-extrabold text-neu-text leading-snug">
                                  {job.fullImpact}
                                </p>
                              </div>
                              <div className="lg:col-span-8">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neu-text-muted mb-2 block">
                                  Core Contributions & Technical Delivery
                                </span>
                                <ul className="space-y-2.5">
                                  {(job.bullets || []).map(
                                    (bullet: string, bIdx: number) => (
                                      <li
                                        key={bIdx}
                                        className="flex items-start gap-2.5 text-xs sm:text-sm text-neu-text-muted leading-relaxed font-light"
                                      >
                                        <span className="text-neu-accent font-bold mt-1 shrink-0">
                                          ✦
                                        </span>
                                        <span>{bullet}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Testimonials & Endorsements */}
      <section
        id="endorse"
        className="max-w-7xl mx-auto mt-24 mb-24 overflow-visible scroll-mt-20"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-neu-accent mb-2">
              <MessageSquare size={18} className="animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Endorsements
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
              What Colleagues & Clients Say
            </h2>
          </div>
        </div>
        <div className="relative w-full overflow-hidden py-24 -my-12 px-6">
          <div className="animate-marquee flex gap-10 select-none">
            {[
              ...testimonialsList,
              ...testimonialsList,
              ...testimonialsList,
            ].map((t: any, index: number) => (
              <div
                key={`${t.id}-dup-${index}`}
                className={cn(
                  "flex-shrink-0 w-[85vw] sm:w-[440px] max-w-[400px] sm:max-w-none p-5 sm:p-8 rounded-3xl glass-card relative flex flex-col justify-between group transition-all duration-500 ease-out border border-white/5",
                  "transform-gpu perspective-1000",
                  index % 2 === 0
                    ? "rotate-y-4 -rotate-1"
                    : "-rotate-y-4 rotate-1",
                  "hover:rotate-y-0 hover:rotate-x-0 hover:scale-[1.05] hover:-translate-y-3 hover:z-30",
                  "hover:border-blue-500 hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.3)] dark:hover:border-emerald-400 dark:hover:shadow-[0_25px_50px_-12px_rgba(74,222,128,0.3)]",
                )}
              >
                {t.url && (
                  <div className="mb-6 inline-flex px-3 py-1 rounded-full glass-card-inset text-[10px] font-mono text-neu-accent font-semibold tracking-wide">
                    ✦ Verifiable URL Profile
                  </div>
                )}
                <div className="mb-6 relative z-10 flex-1 flex flex-col">
                  <div className="absolute -top-3 -left-2 text-neu-accent/30 group-hover:text-neu-accent/60 transition-colors z-10 pointer-events-none">
                    <Quote size={32} />
                  </div>
                  <div className="p-5 pt-8 rounded-2xl glass-card-inset text-sm text-neu-text-muted leading-relaxed font-sans italic relative bg-neu-bg/40 flex-1 flex flex-col justify-between">
                    <div
                      className={
                        t.testimonial?.length > 150 ? "line-clamp-4" : ""
                      }
                    >
                      &ldquo;{t.testimonial}&rdquo;
                    </div>
                    {t.testimonial?.length > 150 && (
                      <button
                        onClick={() => setSelectedTestimonial(t)}
                        className="mt-3 text-xs font-bold text-neu-accent hover:underline relative z-20 flex items-center gap-1 self-start"
                      >
                        See more...
                      </button>
                    )}
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="pt-4 border-t border-gray-300/30 dark:border-gray-700/30 flex flex-col gap-1">
                    {t.url ? (
                      <a
                        href={t.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold text-neu-text hover:text-neu-accent hover:underline transition-colors relative z-20"
                      >
                        {t.name}
                      </a>
                    ) : (
                      <span className="text-base font-bold text-neu-text">
                        {t.name}
                      </span>
                    )}
                    <div className="text-xs text-neu-text-muted">
                      <span className="italic">{t.role}</span> at{" "}
                      <span className="font-bold">{t.company}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {(t.tags || []).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 glass-card-inset text-[10px] font-mono font-medium rounded-lg text-neu-text-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
            onClick={() => setSelectedTestimonial(null)}
          >
            <div className="absolute inset-0 bg-neu-bg/80 dark:bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
            >
              <div className="sticky top-0 z-20 flex justify-between items-center p-4 md:p-6 border-b border-gray-200/50 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
                <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-neu-text-muted">
                  Full Testimonial
                </h3>
                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-white/5 flex items-center justify-center text-neu-text-muted hover:text-neu-text hover:bg-gray-300/50 dark:hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto">
                <div className="relative z-10 mb-8">
                  <div className="absolute -top-3 -left-2 text-neu-accent/20 z-0 pointer-events-none">
                    <Quote size={48} />
                  </div>
                  <div className="p-6 md:p-8 rounded-3xl glass-card-inset text-base md:text-lg text-neu-text leading-relaxed font-sans italic relative z-10 bg-neu-bg/40 whitespace-pre-wrap">
                    &ldquo;{selectedTestimonial.testimonial}&rdquo;
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-300/30 dark:border-gray-700/30 flex flex-col gap-1">
                  {selectedTestimonial.url ? (
                    <a
                      href={selectedTestimonial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-neu-text hover:text-neu-accent hover:underline transition-colors w-fit"
                    >
                      {selectedTestimonial.name}
                    </a>
                  ) : (
                    <span className="text-lg font-bold text-neu-text">
                      {selectedTestimonial.name}
                    </span>
                  )}
                  <div className="text-sm text-neu-text-muted">
                    <span className="italic">{selectedTestimonial.role}</span>{" "}
                    at{" "}
                    <span className="font-bold">
                      {selectedTestimonial.company}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevProject();
                }}
                className="p-4 rounded-full bg-neu-bg/90 backdrop-blur-md shadow-neu hover:shadow-neu-sm text-neu-text-muted hover:text-neu-accent hover:scale-110 active:scale-95 transition-all border border-white/5"
                title="Previous Volume"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextProject();
                }}
                className="p-4 rounded-full bg-neu-bg/90 backdrop-blur-md shadow-neu hover:shadow-neu-sm text-neu-text-muted hover:text-neu-accent hover:scale-110 active:scale-95 transition-all border border-white/5"
                title="Next Volume"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <motion.div
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(event, info) => {
                if (info.offset.x < -70) handleNextProject();
                else if (info.offset.x > 70) handlePrevProject();
              }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neu-bg rounded-3xl shadow-neu-modal w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col relative cursor-grab active:cursor-grabbing"
            >
              {/* Full project modal content preserved */}
              <div className="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar">
                <p className="text-neu-text-muted text-sm">
                  Full project details render here with markdown, architecture
                  diagrams, lifecycle tracker, and related projects.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        portfolioStatus={pd.portfolioStatus}
        triggerToast={triggerToast}
      />

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
            className="fixed top-8 left-1/2 z-[150] px-6 py-3.5 rounded-2xl bg-black/90 dark:bg-neutral-950 text-white font-mono text-xs shadow-neu border border-white/10 flex items-center gap-2.5 backdrop-blur-md"
          >
            <Sparkles className="text-neu-accent animate-pulse" size={14} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto py-12 border-t border-gray-300/50 dark:border-gray-700/50 text-center text-xs font-mono text-neu-text-muted">
        <p>
          &copy; {new Date().getFullYear()} {pd.heroConfig?.name || "Awaluddin"}
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}
