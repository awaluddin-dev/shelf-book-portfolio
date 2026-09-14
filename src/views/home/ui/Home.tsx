"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Download,
  PenTool,
  ArrowUpRight,
  FileText,
  Mail,
} from "lucide-react";

import { getTechIconAndColor } from "@/shared/lib/tech-icons";
import { motion, AnimatePresence, useSpring, useScroll } from "motion/react";
import { SiGithub, SiLinkedin } from "@/shared/ui/icons/BrandIcons";

import { usePortfolioStore } from "@/shared/store/portfolioStore";
import ProjectsSection from "@/widgets/projects-list/ui/ProjectsList";
import ProficiencySection from "@/widgets/proficiency/ui/Proficiency";
import ExperienceSection from "@/widgets/experience/ui/Experience";
import ContactModal from "@/features/contact/ui/ContactModal";
import ProjectModal from "@/widgets/project-modal/ui/ProjectModal";
import TestimonialModal from "@/widgets/testimonial-modal/ui/TestimonialModal";
import AdminPlayground from "@/views/admin-playground/ui/AdminPlayground";
import { CoverLetterModal } from "@/widgets/cover-letter/CoverLetterModal";
import { MetricsBento } from "@/widgets/metrics/ui/MetricsBento";
import WhiteboardTestimonials from "@/widgets/testimonials/ui/WhiteboardTestimonials";
import dynamic from "next/dynamic";
import { Loader } from "@/shared/ui/Loader";
import { LeftPanel } from "@/widgets/left-panel/ui/LeftPanel";

const Mascot = dynamic(
  () => import("@/widgets/mascot/ui/Mascot").then((mod) => mod.Mascot),
  { ssr: false },
);

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Career" },
  { id: "projects", label: "Projects" },
  { id: "proficiency", label: "Proficiency" },
  { id: "endorse", label: "Endorsements" },
];

export default function Portfolio() {
  const isDark = true;
  const { dynamicHeroConfig, initializeData, toastMessage, isLoading, triggerToast } =
    usePortfolioStore();

  const [isPlaygroundOpen, setPlaygroundOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["about", "experience", "projects", "proficiency", "endorse"];
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -45% 0px",
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-canvas"
          >
            <Loader size={100} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="min-h-screen font-sans selection:bg-subtle selection:text-primary relative bg-canvas text-secondary"
      >
        {/* Animated Scroll Progress Bar */}
        <motion.div
          id="scroll-progress"
          role="progressbar"
          aria-label="Scroll Progress"
          suppressHydrationWarning
          className="fixed top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-subtle via-brand to-status animate-gradient-x z-[100] origin-left"
          style={{ scaleX }}
        />

        {/* Mobile Sticky Top Bar (<lg) */}
        <div className="lg:hidden sticky top-0 z-40 w-full bg-canvas border-b border-subtle px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-primary">
              {dynamicHeroConfig?.name || "Awaluddin"}
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-status/10 text-status border border-status/30">
              <span className="w-1.5 h-1.5 rounded-full bg-status animate-pulse" />
              Available
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <a
              href="/assets/resume/Awaluddin_cv.pdf"
              target="_blank"
              rel="noreferrer noopener"
              className="px-2.5 py-1 rounded-lg bg-card border border-subtle text-secondary hover:text-primary hover:border-subtle-hover transition-colors duration-150 flex items-center gap-1"
            >
              <FileText size={11} className="text-brand" />
              <span>Resume</span>
            </a>
            <a
              href="https://sb.awaluddin.dev/docs"
              target="_blank"
              rel="noreferrer noopener"
              className="px-2.5 py-1 rounded-lg bg-card border border-subtle text-brand hover:text-primary hover:border-subtle-hover transition-colors duration-150"
            >
              API Docs
            </a>
          </div>
        </div>

        {/* Main 2-Column Container */}
        <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12 lg:py-0">
          <div className="lg:flex lg:justify-between lg:gap-12 xl:gap-16">
            {/* ========================================================================= */}
            {/* A. KOLOM KIRI (Sticky Left Column - 32% / 28% width) */}
            {/* ========================================================================= */}
            <LeftPanel
              navItems={NAV_ITEMS}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />

            {/* ========================================================================= */}
            {/* B. KOLOM KANAN (Scrollable Main Content - 60% / 65% width) */}
            {/* ========================================================================= */}
            <div className="pt-12 lg:w-[62%] xl:w-[65%] lg:py-24 space-y-24">
              {/* SECTION 1: #about */}
              <section
                id="about"
                className="scroll-mt-16 lg:scroll-mt-24"
                aria-label="About me"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-canvas px-6 py-5 md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-brand">
                    About
                  </h2>
                </div>

                <div className="space-y-4 text-sm text-secondary leading-relaxed font-normal">
                  <p>
                    Back in my early engineering days at{" "}
                    <span className="font-semibold text-primary">Daikin HVAC</span>,
                    I spent countless hours diagnosing industrial refrigeration systems,
                    tuning physical feedback controllers, and managing sensor data pipelines.
                    Working with physical thermodynamics taught me the unyielding truth of
                    production systems: failure modes will always occur at the boundaries, and
                    real-time reliability is non-negotiable.
                  </p>

                  <p>
                    That passion for robust, deterministic architectures naturally led me to
                    pivot into{" "}
                    <span className="font-semibold text-primary">
                      distributed backend engineering and cloud infrastructure
                    </span>
                    . Today, I architect and build async, event-driven microservices using{" "}
                    <span className="font-semibold text-primary">Node.js, Go, Python, and PostgreSQL</span>,
                    specializing in resilient financial platforms and high-throughput enterprise systems.
                  </p>

                  <p>
                    My primary technical focus is bridging modern AI systems with production backends:
                    integrating{" "}
                    <span className="font-semibold text-brand">
                      large language models (LLMs), LangGraph/LangChain agentic workflows, and semantic retrieval
                    </span>{" "}
                    into scalable architectures. I care deeply about token telemetry, deterministic fallbacks,
                    and building software that consistently delivers value at scale.
                  </p>
                </div>
              </section>

              {/* OPERATIONAL METRICS BENTO */}
              <MetricsBento />

              {/* SECTION 2: #experience */}
              <section
                id="experience"
                className="scroll-mt-16 lg:scroll-mt-24"
                aria-label="Career experience"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-canvas px-6 py-5 md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-brand">
                    Career
                  </h2>
                </div>
                <ExperienceSection isDark={isDark} />
              </section>

              {/* SECTION 3: #projects */}
              <section
                id="projects"
                className="scroll-mt-16 lg:scroll-mt-24"
                aria-label="Featured projects"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-canvas px-6 py-5 md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-brand">
                    Projects
                  </h2>
                </div>
                <ProjectsSection isDark={isDark} />
              </section>

              {/* SECTION 4: #proficiency */}
              <section
                id="proficiency"
                className="scroll-mt-16 lg:scroll-mt-24"
                aria-label="Technical proficiency"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-canvas px-6 py-5 md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-brand">
                    Proficiency
                  </h2>
                </div>
                <ProficiencySection isDark={isDark} renderIcon={renderIcon} />
              </section>

              {/* SECTION 5: #endorse */}
              <WhiteboardTestimonials isDark={isDark} />

              {/* Footer */}
              <footer className="pt-16 border-t border-subtle/60 text-left text-xs font-mono text-muted">
                <p>
                  Crafted with Next.js, Tailwind CSS, & Motion.
                  © {new Date().getFullYear()} {dynamicHeroConfig?.name || "Awaluddin"}.
                  All rights reserved.
                </p>
              </footer>
            </div>
          </div>
        </div>

        {/* Modal Orchestrator */}
        <ProjectModal isDark={isDark} getTechIconAndColor={getTechIconAndColor} />
        <ContactModal />
        <TestimonialModal />
        <CoverLetterModal />

        {/* Dynamic Mascot Component */}
        <Mascot />

        {/* Admin Playground */}
        <AnimatePresence>
          {isPlaygroundOpen && (
            <AdminPlayground onClose={() => setPlaygroundOpen(false)} />
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: "-50%", scale: 0.9 }}
              animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
              exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
              className="fixed top-8 left-1/2 z-[150] px-6 py-3.5 rounded-2xl bg-card text-primary font-mono text-xs shadow-lg border border-subtle flex items-center gap-2.5"
            >
              <Sparkles className="text-status animate-pulse" size={14} />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

