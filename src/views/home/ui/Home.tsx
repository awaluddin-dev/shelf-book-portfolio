"use client";

import { useState, useEffect } from "react";
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
  BookOpen,
} from "lucide-react";

import { useTheme } from "@/shared/ui/ThemeProvider";
import { getTechIconAndColor } from "@/shared/lib/tech-icons";
import { motion, AnimatePresence, useSpring, useScroll } from "motion/react";
import { SiGithub, SiLinkedin } from "@/shared/ui/icons/BrandIcons";

import { usePortfolioStore } from "@/shared/store/portfolioStore";
import ProjectsSection from "@/widgets/projects-list/ui/ProjectsList";
import ProficiencySection from "@/widgets/proficiency/ui/Proficiency";
import ExperienceSection from "@/widgets/experience/ui/Experience";
import ContactModal from "@/features/contact/ui/ContactModal";
import ProjectModal from "@/widgets/project-modal/ui/ProjectModal";
import DockNavigation from "@/widgets/dock-navigation/ui/DockNavigation";
import TestimonialModal from "@/widgets/testimonial-modal/ui/TestimonialModal";
import AdminPlayground from "@/views/admin-playground/ui/AdminPlayground";
import { CoverLetterModal } from "@/widgets/cover-letter/CoverLetterModal";
import WritingSection from "@/widgets/writing/ui/WritingSection";
import MetricsBento from "@/widgets/metrics/ui/MetricsBento";
import WhiteboardTestimonials from "@/widgets/testimonials/ui/WhiteboardTestimonials";
import dynamic from "next/dynamic";
import { Loader } from "@/shared/ui/Loader";

const Mascot = dynamic(
  () => import("@/widgets/mascot/ui/Mascot").then((mod) => mod.Mascot),
  { ssr: false },
);

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "proficiency", label: "Proficiency" },
  { id: "experience", label: "Experience" },
  { id: "writing", label: "Writing" },
  { id: "endorse", label: "Endorsements" },
];

export default function Portfolio() {
  const { isDark } = useTheme();
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
    const sections = ["about", "projects", "proficiency", "experience", "writing", "endorse"];
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
            className="fixed inset-0 z-[999] flex items-center justify-center bg-neu-bg"
          >
            <Loader size={100} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-neu-bg text-neu-text font-sans selection:bg-neu-accent/20 selection:text-neu-accent transition-colors duration-300 relative">
        {/* Animated Scroll Progress Bar */}
        <motion.div
          id="scroll-progress"
          role="progressbar"
          aria-label="Scroll Progress"
          suppressHydrationWarning
          className="fixed top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-gradient-x z-[100] origin-left"
          style={{ scaleX }}
        />

        {/* Sticky bottom dock navigation */}
        <DockNavigation
          isDark={isDark}
          showBackToTop={showBackToTop}
          activeSection={activeSection}
          openPlayground={() => setPlaygroundOpen(true)}
        />

        {/* Main 2-Column Container */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="lg:flex lg:justify-between lg:gap-12 xl:gap-16">
            {/* ========================================================================= */}
            {/* A. KOLOM KIRI (Sticky Left Column - 32% / 28% width) */}
            {/* ========================================================================= */}
            <header className="lg:w-[32%] xl:w-[28%] lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-between lg:py-24 pt-16 pb-10">
              <div className="flex flex-col">
                {/* Status Badge */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold glass-card border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Available for Remote Roles (UTC+7)</span>
                  </div>
                </div>

                {/* Identity & Headline */}
                <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-neu-text">
                  <a href="#about" className="hover:text-neu-accent transition-colors">
                    {dynamicHeroConfig?.name || "Awaluddin"}
                  </a>
                </h1>

                <h2 className="mt-3 text-lg sm:text-xl font-display font-bold text-neu-accent">
                  Backend Engineer & AI Integrator
                </h2>

                <p className="mt-1 text-xs sm:text-sm font-mono uppercase tracking-widest text-neu-text-muted">
                  Production Systems at Scale
                </p>

                {/* Core Quote / Summary */}
                <p className="mt-4 max-w-sm text-sm text-neu-text-muted font-normal leading-relaxed">
                  &ldquo;I ship LLM integrations into production — not train models in notebooks.&rdquo;
                </p>

                {/* Quick Action CTAs */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href="/assets/resume/Awaluddin_cv.pdf"
                    download="Awaluddin_CV.pdf"
                    onClick={() => triggerToast?.("Downloading CV...")}
                    className="px-4 py-2 rounded-xl font-bold text-xs font-mono text-neu-text glass-card border border-neu-accent/30 hover:bg-neu-accent hover:text-white hover:border-neu-accent hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 shadow-sm group"
                  >
                    <Download size={13} className="group-hover:scale-110 transition-transform text-neu-accent group-hover:text-white" />
                    View Resume
                  </a>

                  <button
                    type="button"
                    onClick={() => window.open("/api/scalar", "_blank")}
                    className="px-4 py-2 rounded-xl font-bold text-xs font-mono text-neu-text glass-card border border-white/10 hover:border-neu-accent/50 hover:text-neu-accent hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 shadow-sm group"
                  >
                    <Code2 size={13} className="group-hover:rotate-12 transition-transform text-neu-accent" />
                    Scalar API Docs
                  </button>
                </div>

                {/* Navigasi Scrollspy Vertikal */}
                <nav className="nav hidden lg:block mt-16" aria-label="In-page jump links">
                  <ul className="w-max space-y-3">
                    {NAV_ITEMS.map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => scrollToSection(item.id)}
                            className="group flex items-center py-1 cursor-pointer text-left focus:outline-none"
                          >
                            <span
                              className={`mr-4 h-px transition-all duration-300 group-hover:w-16 group-hover:bg-neu-accent ${
                                isActive
                                  ? "w-16 bg-neu-accent"
                                  : "w-8 bg-neu-text-muted/40"
                              }`}
                            />
                            <span
                              className={`text-xs font-mono font-bold uppercase tracking-widest transition-colors duration-300 group-hover:text-neu-accent ${
                                isActive
                                  ? "text-neu-accent"
                                  : "text-neu-text-muted"
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              {/* Social Links & Slot Mascot Kolom Kiri */}
              <div className="mt-8 lg:mt-0 flex flex-col gap-6">
                <ul className="flex items-center gap-5 text-neu-text-muted" aria-label="Social media">
                  <li>
                    <a
                      href="https://github.com/awaluddin-dev"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hover:text-neu-accent transition-colors p-1"
                      aria-label="GitHub (opens in a new tab)"
                    >
                      <SiGithub size={20} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/awaluddin-developer"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hover:text-neu-accent transition-colors p-1"
                      aria-label="LinkedIn (opens in a new tab)"
                    >
                      <SiLinkedin size={20} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://dev.to/awaluddin"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hover:text-neu-accent transition-colors p-1"
                      aria-label="Dev.to (opens in a new tab)"
                    >
                      <PenTool size={20} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:hello@awaluddin.dev"
                      className="hover:text-neu-accent transition-colors p-1"
                      aria-label="Email (opens mail client)"
                    >
                      <MapPin size={20} />
                    </a>
                  </li>
                </ul>

                <p className="text-xs font-mono text-neu-text-muted/60">
                  hello@awaluddin.dev
                </p>
              </div>
            </header>

            {/* ========================================================================= */}
            {/* B. KOLOM KANAN (Scrollable Feed - 68% / 72% width) */}
            {/* ========================================================================= */}
            <main className="lg:w-[68%] xl:w-[72%] lg:py-24 space-y-24 pb-24">
              {/* SECTION 1: #about */}
              <section
                id="about"
                className="scroll-mt-16 lg:scroll-mt-24"
                aria-label="About me"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-neu-bg/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-neu-accent">
                    About
                  </h2>
                </div>

                <div className="space-y-4 text-sm text-neu-text-muted leading-relaxed font-normal">
                  <p>
                    Back in my early engineering days at{" "}
                    <span className="font-semibold text-neu-text">Daikin HVAC</span>,
                    I spent countless hours diagnosing industrial refrigeration systems,
                    tuning physical feedback controllers, and managing sensor data pipelines.
                    Working with physical thermodynamics taught me the unyielding truth of
                    production systems: failure modes will always occur at the boundaries, and
                    real-time reliability is non-negotiable.
                  </p>

                  <p>
                    That passion for robust, deterministic architectures naturally led me to
                    pivot into{" "}
                    <span className="font-semibold text-neu-text">
                      distributed backend engineering and cloud infrastructure
                    </span>
                    . Today, I architect and build async, event-driven microservices using{" "}
                    <span className="font-semibold text-neu-text">Node.js, Go, Python, and PostgreSQL</span>,
                    specializing in resilient financial platforms and high-throughput enterprise systems.
                  </p>

                  <p>
                    My primary technical focus is bridging modern AI systems with production backends:
                    integrating{" "}
                    <span className="font-semibold text-neu-accent">
                      large language models (LLMs), LangGraph/LangChain agentic workflows, and semantic retrieval
                    </span>{" "}
                    into scalable architectures. I care deeply about token telemetry, deterministic fallbacks,
                    and building software that consistently delivers value at scale.
                  </p>
                </div>
              </section>

              {/* OPERATIONAL METRICS BENTO */}
              <MetricsBento />

              {/* SECTION 2: #projects */}
              <section
                id="projects"
                className="scroll-mt-16 lg:scroll-mt-24"
                aria-label="Featured projects"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-neu-bg/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-neu-accent">
                    Projects
                  </h2>
                </div>
                <ProjectsSection isDark={isDark} />
              </section>

              {/* SECTION 3: #proficiency */}
              <section
                id="proficiency"
                className="scroll-mt-16 lg:scroll-mt-24"
                aria-label="Technical proficiency"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-neu-bg/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-neu-accent">
                    Proficiency
                  </h2>
                </div>
                <ProficiencySection isDark={isDark} renderIcon={renderIcon} />
              </section>

              {/* SECTION 4: #experience */}
              <section
                id="experience"
                className="scroll-mt-16 lg:scroll-mt-24"
                aria-label="Work experience"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-neu-bg/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-neu-accent">
                    Experience
                  </h2>
                </div>
                <ExperienceSection isDark={isDark} />
              </section>

              {/* SECTION 5: #writing */}
              <section
                id="writing"
                className="scroll-mt-16 lg:scroll-mt-24"
                aria-label="Curated writings"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-6 w-screen bg-neu-bg/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-neu-accent">
                    Writing
                  </h2>
                </div>

                <WritingSection isDark={isDark} />
              </section>

              {/* SECTION 6: #endorse */}
              <WhiteboardTestimonials isDark={isDark} />

              {/* Footer */}
              <footer className="pt-16 border-t border-gray-300/30 dark:border-gray-800/40 text-left text-xs font-mono text-neu-text-muted/80">
                <p>
                  Crafted with Next.js, Tailwind CSS, & Motion.
                  © {new Date().getFullYear()} {dynamicHeroConfig?.name || "Awaluddin"}.
                  All rights reserved.
                </p>
              </footer>
            </main>
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
              className="fixed top-8 left-1/2 z-[150] px-6 py-3.5 rounded-2xl bg-black/90 dark:bg-neutral-950 text-white font-mono text-xs shadow-neu border border-white/10 flex items-center gap-2.5 backdrop-blur-md"
            >
              <Sparkles className="text-neu-accent animate-pulse" size={14} />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

