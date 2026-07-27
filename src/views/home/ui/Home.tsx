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

import { usePortfolioStore } from "@/shared/store/portfolioStore";
import HeroSection from "@/widgets/hero/ui/Hero";
import ProjectsSection from "@/widgets/projects-list/ui/ProjectsList";
import ProficiencySection from "@/widgets/proficiency/ui/Proficiency";
import ExperienceSection from "@/widgets/experience/ui/Experience";
import ContactModal from "@/features/contact/ui/ContactModal";
import ProjectModal from "@/widgets/project-modal/ui/ProjectModal";
import DockNavigation from "@/widgets/dock-navigation/ui/DockNavigation";
import TestimonialModal from "@/widgets/testimonial-modal/ui/TestimonialModal";
import AdminPlayground from "@/views/admin-playground/ui/AdminPlayground";

export default function Portfolio() {
  const { isDark } = useTheme();
  const { isLoading, dynamicHeroConfig, initializeData, toastMessage } = usePortfolioStore();

  const [isPlaygroundOpen, setPlaygroundOpen] = useState(false);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const [activeSection, setActiveSection] = useState("hero");
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      // Scroll heatmap to the rightmost (most recent month) on mobile
      // Can't do it here easily, will be done in Experience.tsx if needed
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
        openPlayground={() => setPlaygroundOpen(true)}
      />
      {/* Extracted Sections */}
      <HeroSection
        isDark={isDark}
        renderIcon={renderIcon}
      />
      <ProjectsSection
        isDark={isDark}
      />
      <ProficiencySection
        isDark={isDark}
        renderIcon={renderIcon}
      />
      <ExperienceSection
        isDark={isDark}
      />
      {/* Footer */}
      <footer className="max-w-7xl mx-auto py-12 border-t border-gray-300/50 dark:border-gray-700/50 text-center text-xs font-mono text-neu-text-muted">
        <p>
          © {new Date().getFullYear()} {dynamicHeroConfig?.name || "Awaluddin"}.
          All rights reserved.
        </p>
      </footer>
      <ProjectModal
        isDark={isDark}
        getTechIconAndColor={getTechIconAndColor}
      />
      {/* Quick-Send Availability Inquiry Modal */}
      <ContactModal />
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
      <TestimonialModal />
      <AnimatePresence>
        {isPlaygroundOpen && (
          <AdminPlayground onClose={() => setPlaygroundOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
