"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
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
  Server,
  Sparkles,
  Terminal,
  TrendingUp,
  Zap,
  Activity,
} from "lucide-react";

import { useTheme } from "@/shared/ui/ThemeProvider";
import { getTechIconAndColor } from "@/shared/lib/tech-icons";
import {
  getTagProjectCount,
  legendLevels,
  getRelatedProjects,
  TECHNICAL_IMAGERY,
} from "@/shared/lib/helpers";
import { motion, AnimatePresence, useSpring, useScroll } from "motion/react";

import { Testimonial } from "@/shared/types";

import { fetchWithRetry, warmupDatabase } from "@/shared/lib/fetchUtils";
import HeroSection from "./sections/HeroSection";
import ProjectsSection from "./sections/ProjectsSection";
import ProficiencySection from "./sections/ProficiencySection";
import ExperienceSection from "./sections/ExperienceSection";
import ContactModal from "@/features/contact/ui/ContactModal";
import ProjectModal from "./components/ProjectModal";
import DockNavigation from "./components/DockNavigation";
import TestimonialModal from "./components/TestimonialModal";

export default function Portfolio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [isBannerMinimized, setIsBannerMinimized] = useState(false);
  const [focusedProject, setFocusedProject] = useState<any>(null);
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic API Data States
  const [dynamicRoadmap, setDynamicRoadmap] = useState<any[]>([]);
  const [dynamicProficiency, setDynamicProficiency] = useState<any[]>([]);
  const [dynamicHeroConfig, setDynamicHeroConfig] = useState<any>(null);
  const [dynamicMetrics, setDynamicMetrics] = useState<any[]>([]);
  const [dynamicProjects, setDynamicProjects] = useState<any[]>([]);
  const [dynamicWork, setDynamicWork] = useState<any[]>([]);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetchWithRetry("/api/learning");
        const resData = await res.json();
        const payload = resData.data || resData;
        const arr = payload.roadmap || (Array.isArray(payload) ? payload : []);
        if (arr.length > 0) setDynamicRoadmap(arr);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchProficiency = async () => {
      try {
        const res = await fetchWithRetry("/api/proficiency");
        const resData = await res.json();
        const payload = resData.data || resData;
        const arr =
          payload.proficiency || (Array.isArray(payload) ? payload : []);
        if (arr.length > 0) setDynamicProficiency(arr);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchHero = async () => {
      try {
        const res = await fetchWithRetry("/api/hero", { cache: "no-store" });
        const resData = await res.json();
        const payload = resData.data || resData;
        if (payload.heroConfig) setDynamicHeroConfig(payload.heroConfig);
        const metricsArr =
          payload.metrics || (Array.isArray(payload) ? payload : []);
        if (metricsArr.length > 0) setDynamicMetrics(metricsArr);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await fetchWithRetry("/api/projects");
        const resData = await res.json();
        const payload = resData.data || resData;
        const arr = payload.projects || (Array.isArray(payload) ? payload : []);
        if (arr.length > 0) setDynamicProjects(arr);
      } catch (e) {
        console.error(e);
      }
    };

    const sortWorkExp = (a: any, b: any) => {
      const isPresentA =
        a.years.toLowerCase().includes("present") ||
        a.years.toLowerCase().includes("current") ||
        a.years.toLowerCase().includes("now");
      const isPresentB =
        b.years.toLowerCase().includes("present") ||
        b.years.toLowerCase().includes("current") ||
        b.years.toLowerCase().includes("now");
      if (isPresentA && !isPresentB) return -1;
      if (!isPresentA && isPresentB) return 1;
      const startA = a.years.split("-")[0].trim();
      const startB = b.years.split("-")[0].trim();
      const dateA =
        new Date(startA).getTime() ||
        Number.parseInt(startA.match(/\d{4}/)?.[0] || "0");
      const dateB =
        new Date(startB).getTime() ||
        Number.parseInt(startB.match(/\d{4}/)?.[0] || "0");
      return dateB - dateA;
    };

    const fetchWork = async () => {
      try {
        const res = await fetchWithRetry("/api/work");
        const resData = await res.json();
        const payload = resData.data || resData;
        const arr =
          payload.workExperience ||
          payload.workExperiences ||
          (Array.isArray(payload) ? payload : []);
        if (arr.length > 0) {
          arr.sort(sortWorkExp);
          setDynamicWork(arr);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const initializeData = async () => {
      try {
        await warmupDatabase((attempt) => {
          if (attempt === 1)
            setToastMessage("Waking up database (cold start)... Please wait.");
        });

        await Promise.all([
          fetchRoadmap(),
          fetchProficiency(),
          fetchHero(),
          fetchProjects(),
          fetchWork(),
        ]);
      } catch (e) {
        console.error("Failed to warmup DB:", e);
      }
    };

    initializeData();
  }, []);

  // Use dynamic if available, fallback to static imports or defaults
  const activeRoadmap = dynamicRoadmap;
  const activeProficiency = dynamicProficiency;
  const activeWork = dynamicWork;
  const activeMetrics = dynamicMetrics;

  const renderIcon = (
    iconName: string,
    isSavings: boolean,
    customSize?: number,
  ) => {
    const props = {
      ...(customSize ? { size: customSize } : {}),
      className: `${customSize ? "" : "w-5 h-5 sm:w-6 sm:h-6"} ${isSavings ? "text-emerald-500 dark:text-emerald-400" : "text-neu-accent"}`,
    };
    switch (iconName) {
      case "BrainCircuit":
        return <BrainCircuit {...props} />;
      case "Code2":
        return <Code2 {...props} />;
      case "Briefcase":
        return <Briefcase {...props} />;
      case "TrendingUp":
        return <TrendingUp {...props} />;
      case "MapPin":
        return <MapPin {...props} />;
      case "Cpu":
        return <Cpu {...props} />;
      case "Zap":
        return <Zap {...props} />;
      case "Activity":
        return <Activity {...props} />;
      case "Award":
        return <Award {...props} />;
      case "Terminal":
        return <Terminal {...props} />;
      case "Server":
        return <Server {...props} />;
      case "Database":
        return <Database {...props} />;
      case "Box":
        return <Box {...props} />;
      case "Layers":
        return <Layers {...props} />;
      case "Cloud":
        return <Cloud {...props} />;
      default:
        return <Code2 {...props} />;
    }
  };

  const [chartType, setChartType] = useState<"temporal" | "repository">(
    "temporal",
  );
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | null>(
    null,
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alphabetical">(
    "newest",
  );
  const shelfRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedRoadmapIndex, setSelectedRoadmapIndex] = useState<
    number | null
  >(0);
  const [activeExpIdx, setActiveExpIdx] = useState<number | null>(0);
  const [activeTooltipDate, setActiveTooltipDate] = useState<string | null>(
    null,
  );
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((dayDate: string) => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

    touchTimeoutRef.current = setTimeout(() => {
      setActiveTooltipDate(dayDate);
    }, 200);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      setActiveTooltipDate(null);
    }, 1500);
  }, []);

  const handleTouchMove = useCallback(() => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
  }, []);

  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        const payload = data.data || data;
        let arr =
          payload.testimonials || (Array.isArray(payload) ? payload : []);
        arr = arr.filter((t: any) => t.status === "accepted" || !t.status);

        setTestimonialsList(arr);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const [portfolioStatus, setPortfolioStatus] = useState<"available" | "busy">(
    "available",
  );
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setPortfolioStatus(data.status));
  }, []);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Scroll heatmap to the rightmost (most recent month) on mobile
      if (heatmapRef.current) {
        heatmapRef.current.scrollLeft = heatmapRef.current.scrollWidth;
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["hero", "proficiency", "experience", "endorse"];
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -40% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const [contributionData, setContributionData] = useState<any[][]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [repoData, setRepoData] = useState<any[]>([]);
  const [languageData, setLanguageData] = useState<any[]>([]);
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/github/contributions/awaluddin-dev")
      .then((res) => res.json())
      .then((data) => {
        const payload = data.data || data;
        if (payload?.calendar) {
          setContributionData(payload.calendar);
          setTimelineData(payload.timeline || []);
          setRepoData(payload.repositories || []);
          setLanguageData(payload.languages || []);
        } else {
          // Fallback if API hasn't updated yet or returns old format
          setContributionData(Array.isArray(payload) ? payload : []);
        }
      })
      .catch(console.error);
  }, []);

  const weeks = contributionData; // backend now returns array of weeks directly

  const heatmapStats = useMemo(() => {
    let total = 0;
    let currentStreak = 0;
    let max = 0;
    let activeDays = 0;
    let totalDays = 0;

    weeks.forEach((week) => {
      if (!Array.isArray(week)) return;
      week.forEach((day) => {
        if (!day) return;
        totalDays++;
        if (day.count > 0) {
          total += day.count;
          currentStreak++;
          activeDays++;
        } else {
          if (currentStreak > max) max = currentStreak;
          currentStreak = 0;
        }
      });
    });
    if (currentStreak > max) max = currentStreak;

    const intensity = totalDays > 0 ? (activeDays / totalDays) * 100 : 0;

    return {
      total,
      maxStreak: max,
      avgIntensity: intensity.toFixed(1),
    };
  }, [weeks]);

  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string; monthNum: number }[] = [];
    let prevMonth = -1;
    weeks.forEach((week, index) => {
      if (!Array.isArray(week)) return;
      const firstValidDay = week.find((d) => d !== null);
      if (firstValidDay) {
        const currentMonth = firstValidDay.month;
        if (currentMonth !== prevMonth) {
          const monthName = new Date(2026, currentMonth, 1).toLocaleDateString(
            "en-US",
            { month: "short" },
          );
          labels.push({ index, label: monthName, monthNum: currentMonth });
          prevMonth = currentMonth;
        }
      }
    });
    return labels;
  }, [weeks]);

  const monthsData = useMemo(() => {
    const months: { label: string; monthNum: number; weeks: typeof weeks }[] =
      [];
    let currentMonthWeeks: typeof weeks = [];
    let currentMonthLabel = "";
    let currentMonthNum = -1;

    weeks.forEach((week, index) => {
      const monthLabel = monthLabels.find((lbl: any) => lbl.index === index);
      if (monthLabel) {
        if (currentMonthWeeks.length > 0) {
          months.push({
            label: currentMonthLabel,
            monthNum: currentMonthNum,
            weeks: currentMonthWeeks,
          });
        }
        currentMonthWeeks = [week];
        currentMonthLabel = monthLabel.label;
        currentMonthNum = monthLabel.monthNum;
      } else {
        currentMonthWeeks.push(week);
      }
    });
    if (currentMonthWeeks.length > 0) {
      months.push({
        label: currentMonthLabel,
        monthNum: currentMonthNum,
        weeks: currentMonthWeeks,
      });
    }
    return months;
  }, [weeks, monthLabels]);

  const activeProjects = dynamicProjects;

  const categories = Array.from(
    new Set((activeProjects || []).map((p) => p.category)),
  );

  const filteredProjects = useMemo(() => {
    const filtered = (activeProjects || []).filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.tags || []).some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesCategory = selectedCategory
        ? project.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      const getLatestYear = (dateStr: string) => {
        const years = dateStr.match(/\d{4}/g);
        if (!years) return 0;
        return Math.max(...years.map(Number));
      };
      const getEarliestYear = (dateStr: string) => {
        const years = dateStr.match(/\d{4}/g);
        if (!years) return 0;
        return Math.min(...years.map(Number));
      };

      if (sortBy === "newest") {
        const yearA = getLatestYear(a.date);
        const yearB = getLatestYear(b.date);
        if (yearA !== yearB) {
          return yearB - yearA;
        }
        return activeProjects.indexOf(a) - activeProjects.indexOf(b);
      } else if (sortBy === "oldest") {
        const yearA = getEarliestYear(a.date);
        const yearB = getEarliestYear(b.date);
        if (yearA !== yearB) {
          return yearA - yearB;
        }
        return activeProjects.indexOf(a) - activeProjects.indexOf(b);
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy, activeProjects]);

  const handlePrevProject = () => {
    if (!selectedProject) return;
    const currentIndex = filteredProjects.findIndex(
      (p) => p.id === selectedProject.id,
    );
    if (currentIndex === -1) return;
    if (currentIndex > 0) {
      setSelectedProject(filteredProjects[currentIndex - 1]);
    } else {
      setSelectedProject(filteredProjects.at(-1));
    }
  };

  const handleNextProject = () => {
    if (!selectedProject) return;
    const currentIndex = filteredProjects.findIndex(
      (p) => p.id === selectedProject.id,
    );
    if (currentIndex === -1) return;
    if (currentIndex < filteredProjects.length - 1) {
      setSelectedProject(filteredProjects[currentIndex + 1]);
    } else {
      setSelectedProject(filteredProjects[0]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === "ArrowLeft") {
        handlePrevProject();
      } else if (e.key === "ArrowRight") {
        handleNextProject();
      } else if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, filteredProjects]);

  const scrollShelf = (direction: "left" | "right") => {
    if (shelfRef.current) {
      const scrollAmount = 300; // width of a book + gap
      shelfRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (selectedProject || showInquiryModal || isFilterModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject, showInquiryModal, isFilterModalOpen]);

  return (
    <div className="min-h-screen bg-neu-bg text-neu-text px-6 pb-6 md:px-12 md:pb-12 lg:px-24 lg:pb-24 pt-[2.7rem] font-sans transition-colors duration-300 relative">
      {/* Animated Scroll Progress Bar */}
      <motion.div
        id="scroll-progress"
        role="progressbar"
        aria-label="Scroll Progress"
        suppressHydrationWarning
        className="fixed top-0 left-0 right-0 h-[4px] bg-neu-accent z-[100] origin-left"
        style={{ scaleX }}
      />
      {/* Sticky bottom dock navigation */}
      <DockNavigation
        isDark={isDark}
        showBackToTop={showBackToTop}
        activeSection={activeSection}
        toggleTheme={toggleTheme}
      />
      {/* Extracted Sections */}
      <HeroSection
        isLoading={isLoading}
        isDark={isDark}
        dynamicHeroConfig={dynamicHeroConfig}
        activeMetrics={activeMetrics}
        renderIcon={renderIcon}
        triggerToast={triggerToast}
        setShowInquiryModal={setShowInquiryModal}
      />
      <ProjectsSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isFilterModalOpen={isFilterModalOpen}
        setIsFilterModalOpen={setIsFilterModalOpen}
        filteredProjects={filteredProjects}
        getTechIconAndColor={getTechIconAndColor}
        getTagProjectCount={(t) => getTagProjectCount(t, activeProjects)}
        setSelectedProject={setSelectedProject}
        setFocusedProject={setFocusedProject}
        isDark={isDark}
        focusedProject={focusedProject}
        dynamicHeroConfig={dynamicHeroConfig}
        triggerToast={triggerToast}
        shelfRef={shelfRef}
        activeProjects={activeProjects}
        selectedProject={selectedProject}
        isBannerMinimized={isBannerMinimized}
        setIsBannerMinimized={setIsBannerMinimized}
        isLoading={isLoading}
        scrollShelf={scrollShelf}
      />
      <ProficiencySection
        dynamicProficiency={dynamicProficiency}
        activeRoadmap={activeRoadmap}
        activeCurrentFocus={!!dynamicProficiency[1]}
        renderIcon={renderIcon}
        selectedRoadmapIndex={selectedRoadmapIndex}
        setSelectedRoadmapIndex={setSelectedRoadmapIndex}
        isDark={isDark}
        activeProficiency={activeProficiency}
        isLoading={isLoading}
      />
      <ExperienceSection
        dynamicWork={dynamicWork}
        activeExpIdx={activeExpIdx}
        setActiveExpIdx={setActiveExpIdx}
        testimonialsList={testimonialsList}
        setSelectedTestimonial={setSelectedTestimonial}
        heatmapRef={heatmapRef}
        monthsData={monthsData}
        selectedLevelFilter={selectedLevelFilter}
        setSelectedLevelFilter={setSelectedLevelFilter}
        handleTouchStart={handleTouchStart}
        handleTouchEnd={handleTouchEnd}
        handleTouchMove={handleTouchMove}
        activeTooltipDate={activeTooltipDate}
        legendLevels={legendLevels}
        activeWork={activeWork}
        contributionData={contributionData}
        chartType={chartType}
        setChartType={setChartType}
        timelineData={timelineData}
        repoData={repoData}
        languageData={languageData}
        hoveredMonth={hoveredMonth}
        setHoveredMonth={setHoveredMonth}
        hoveredLang={hoveredLang}
        setHoveredLang={setHoveredLang}
        mounted={mounted}
        isLoading={isLoading}
        isDark={isDark}
        heatmapStats={heatmapStats}
      />
      {/* Footer */}
      <footer className="max-w-7xl mx-auto py-12 border-t border-gray-300/50 dark:border-gray-700/50 text-center text-xs font-mono text-neu-text-muted">
        <p>
          © {new Date().getFullYear()} {dynamicHeroConfig?.name || "Awaluddin"}.
          All rights reserved.
        </p>
      </footer>
      {/* Project Modal */}
      <ProjectModal
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
        onPrevProject={handlePrevProject}
        onNextProject={handleNextProject}
        onSelectProject={setSelectedProject}
        isBannerMinimized={isBannerMinimized}
        setIsBannerMinimized={setIsBannerMinimized}
        isDark={isDark}
        getRelatedProjects={(p: any) => getRelatedProjects(p, activeProjects)}
        getTechIconAndColor={getTechIconAndColor}
        getTagProjectCount={(t: string) =>
          getTagProjectCount(t, activeProjects)
        }
        TECHNICAL_IMAGERY={TECHNICAL_IMAGERY}
      />{" "}
      {/* Quick-Send Availability Inquiry Modal */}
      <ContactModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        portfolioStatus={portfolioStatus}
        triggerToast={triggerToast}
      />
      {/* Premium Toast Notification */}
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
      {/* Testimonial Modal */}
      <TestimonialModal
        selectedTestimonial={selectedTestimonial}
        onClose={() => setSelectedTestimonial(null)}
      />
    </div>
  );
}
