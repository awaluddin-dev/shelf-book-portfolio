"use client";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProficiencySection } from './components/ProficiencySection';
import { ExperienceSection } from './components/ExperienceSection';
import { TestimonialsSection } from './components/TestimonialsSection';

import {
  ArrowUp,
  Award,
  Box,
  BrainCircuit,
  Briefcase,
  Cloud,
  Code2,
  Cpu,
  Database,
  Layers,
  MapPin,
  MessageSquare,
  Moon,
  Server,
  Sun,
  Terminal,
  TrendingUp,
  Zap,
  Activity } from "lucide-react";

import { useTheme } from "@/shared/ui/ThemeProvider";
import { motion, AnimatePresence, useSpring, useScroll } from "motion/react";


import { cn } from "@/shared/lib/utils";

import { getTagProjectCount } from "@/entities/project/model/projects-data";
import {
  legendLevels,
  roadmapItems } from "@/entities/skill/model/roadmap-data";

import { usePortfolioData } from "@/views/home/model/usePortfolioData";
import { useContributionData } from "@/views/home/model/useContributionData";

const FALLBACK_CURRENT_FOCUS = [
  {
    title: "Writing",
    icon: "",
    description:
      '"I Rewrote a Fintech Platform Alone — No Handover, No Team, No Docs"',
    link: "https://dev.to/awaluddin",
    linkText: "Read on dev.to" },
  {
    title: "Current Work",
    icon: "Code2",
    description:
      "Building AuraFlow AI, an intelligent project management and estimation agent.",
    link: "https://github.com/awaluddin-dev",
    linkText: "View Repository" },
  {
    title: "Upcoming Tech",
    icon: "Rocket",
    description:
      "Deep diving into local LLM orchestration and vector database optimization.",
    link: "#experience",
    linkText: "See Roadmap" },
];

const FALLBACK_METRICS = [
  {
    val: "5+ Years",
    label: "Engineering Experience",
    icon: "Code2",
    isSavings: false },
  {
    val: "Enterprise & Fintech",
    label: "INDUSTRY EXPERIENCE",
    icon: "Briefcase",
    isSavings: false },
  {
    val: "$18K/yr",
    label: "Infra Cost Savings",
    icon: "TrendingUp",
    isSavings: true },
  {
    val: "@ Astra Group",
    label: "CURRENT CONTRACT",
    icon: "MapPin",
    isSavings: false },
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

  const [_chartType, _setChartType] = useState<"temporal" | "repository">(
    "temporal",
  );
  const [searchQuery, _setSearchQuery] = useState("");
  const [selectedCategory, _setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [_selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [focusedProject, setFocusedProject] = useState<any>(null);
  const [_hoveredMonth, _setHoveredMonth] = useState<number | null>(null);
  const [_selectedLevelFilter, _setSelectedLevelFilter] = useState<number | null>(
    null,
  );
  const [isFilterModalOpen, _setIsFilterModalOpen] = useState(false);
  const [sortBy, _setSortBy] = useState<"newest" | "oldest" | "alphabetical">(
    "newest",
  );
  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredDockId, setHoveredDockId] = useState<string | null>(null);
  const [_selectedRoadmapIndex, _setSelectedRoadmapIndex] = useState(0);
  const [_activeExpIdx, _setActiveExpIdx] = useState<number | null>(0);
  const [_activeTooltipDate, setActiveTooltipDate] = useState<string | null>(
    null,
  );
  const [_hoveredLang, _setHoveredLang] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [_mounted, setMounted] = useState(false);

  const shelfRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoading = pd.loading || gh.loading;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001 });

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

  const _handleTouchStart = useCallback((dayDate: string) => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(
      () => setActiveTooltipDate(dayDate),
      200,
    );
  }, []);

  const _handleTouchEnd = useCallback(() => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => setActiveTooltipDate(null), 1500);
  }, []);

  const _handleTouchMove = useCallback(() => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
  }, []);

  const _categories = Array.from(
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
      else if (e.key === "") handleNextProject();
      else if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedProject, handlePrevProject, handleNextProject]);

  const _scrollShelf = (d: "left" | "right") => {
    shelfRef.current?.scrollBy({
      left: d === "left" ? -300 : 300,
      behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-neu-bg text-neu-text px-6 pb-6 md:px-12 md:pb-12 lg:px-24 lg:pb-24 pt-[2.7rem] font-sans transition-colors duration-300 relative">
      <motion.div
        id="scroll-progress"
        className="fixed top-0 left-0 right-0 h-1 bg-neu-accent z-[100] origin-left"
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
            : "0 8px 30px rgba(63, 114, 175, 0.08), inset 0 0 12px rgba(63, 114, 175, 0.02)" }}
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
                  marginRight: 8 }}
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
                    <ArrowUp size={16} className="sm:w-5 sm:h-5" />
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
                          damping: 24 }}
                        className="absolute bottom-full mb-3 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-xs font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none left-1/2"
                      >
                        Back to Top
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 bg-neu-bg/95 dark:bg-neu-bg/90 border-r border-b border-neu-accent/20" />
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
              icon: <Cpu size={16} className="sm:w-5 sm:h-5" /> },
            {
              id: "experience",
              label: "Experience",
              icon: <Briefcase size={16} className="sm:w-5 sm:h-5" /> },
            {
              id: "endorse",
              label: "Endorse",
              icon: (
                <MessageSquare size={16} className="sm:w-5 sm:h-5" />
              ) },
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
                        damping: 24 }}
                      className="absolute bottom-full mb-3 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-xs font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none left-1/2"
                    >
                      {sec.label}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 bg-neu-bg/95 dark:bg-neu-bg/90 border-r border-b border-neu-accent/20" />
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
                <Sun size={16} className="sm:w-5 sm:h-5" />
              ) : (
                <Moon size={16} className="sm:w-5 sm:h-5" />
              )}
            </div>
            <AnimatePresence>
              {hoveredDockId === "theme" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                  exit={{ opacity: 0, y: 6, x: "-50%", scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 450, damping: 24 }}
                  className="absolute bottom-full mb-3 px-3 py-1.5 rounded-xl bg-neu-bg/95 dark:bg-neu-bg/90 backdrop-blur-md text-neu-accent text-xs font-mono tracking-wider uppercase font-semibold whitespace-nowrap shadow-neu-modal border border-neu-accent/20 z-50 pointer-events-none left-1/2"
                >
                  {isDark ? "Light Mode" : "Dark Mode"}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 bg-neu-bg/95 dark:bg-neu-bg/90 border-r border-b border-neu-accent/20" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* Section 1: Hero & Projects */}
      <section id="hero" className="relative z-0 mb-16 md:mb-24 w-full">
        <HeroSection pd={pd} gh={gh} isLoading={isLoading} isDark={isDark} activeMetrics={activeMetrics} renderIcon={renderIcon} setShowInquiryModal={setShowInquiryModal} triggerToast={triggerToast} />
      </section>

<ProjectsSection pd={pd} triggerToast={triggerToast} activeProjects={activeProjects} isLoading={isLoading} isDark={isDark} focusedProject={focusedProject} setFocusedProject={setFocusedProject} setSelectedProject={setSelectedProject} getTagProjectCount={getTagProjectCount} />

<ProficiencySection renderIcon={renderIcon} activeRoadmap={activeRoadmap} activeCurrentFocus={activeCurrentFocus} activeProficiency={activeProficiency} isLoading={isLoading} isDark={isDark} />

<ExperienceSection activeWork={activeWork} activeRoadmap={activeRoadmap} gh={gh} isLoading={isLoading} isDark={isDark} renderIcon={renderIcon} legendLevels={legendLevels} />

<TestimonialsSection testimonialsList={testimonialsList} isLoading={isLoading} setSelectedTestimonial={setSelectedTestimonial} />

<footer className="max-w-7xl mx-auto py-12 border-t border-gray-300/50 dark:border-gray-700/50 text-center text-xs font-mono text-neu-text-muted">
        <p>
          &copy; {new Date().getFullYear()} {pd.heroConfig?.name || "Awaluddin"}
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}
