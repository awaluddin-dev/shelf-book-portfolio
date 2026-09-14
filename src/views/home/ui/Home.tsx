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
  FileText,
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

const Mascot = dynamic(
  () => import("@/widgets/mascot/ui/Mascot").then((mod) => mod.Mascot),
  { ssr: false },
);

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "proficiency", label: "Proficiency" },
  { id: "experience", label: "Professional Experience" },
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
    const sections = ["about", "projects", "proficiency", "experience", "endorse"];
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
            <aside className="lg:sticky lg:top-0 lg:h-screen lg:max-h-screen lg:self-start lg:w-[32%] xl:w-[28%] lg:flex lg:flex-col lg:justify-between lg:py-24">
              <div>
                {/* Available for Remote Work Status Indicator */}
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-card border border-subtle text-[11px] font-mono mb-5">
                  <div className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-status">Status:</span>
                    <span className="text-secondary">Available for Remote Roles (UTC+7)</span>
                  </div>
                </div>

                {/* Identity & Headline */}
                <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-primary">
                  <a href="#about" className="hover:text-brand transition-colors">
                    {dynamicHeroConfig?.name || "Awaluddin"}
                  </a>
                </h1>

                <h2 className="mt-2 text-base sm:text-lg font-display font-semibold text-brand">
                  Backend Engineer & AI Integrator
                </h2>

                <p className="mt-1 text-base sm:text-lg font-display font-semibold text-brand">
                  Production Systems at Scale
                </p>

                {/* Core Quote / Summary */}
                <p className="mt-3.5 max-w-sm text-xs sm:text-sm text-secondary font-normal leading-relaxed">
                  &ldquo;I ship LLM integrations into production — not train models in notebooks.&rdquo;
                </p>

                {/* Quick Action CTAs */}
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <a
                    href="/assets/resume/Awaluddin_cv.pdf"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-3.5 py-1.5 rounded-lg font-semibold text-xs font-mono text-primary bg-card border border-subtle/60 hover:bg-brand hover:text-canvas hover:border-subtle-hover hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 shadow-sm group cursor-pointer"
                  >
                    <FileText size={13} className="group-hover:scale-110 transition-transform text-brand group-hover:text-canvas" />
                    View Resume
                  </a>

                  <button
                    type="button"
                    onClick={() => window.open("https://sb.awaluddin.dev/docs", "_blank")}
                    className="px-3.5 py-1.5 rounded-lg font-semibold text-xs font-mono text-primary bg-card border border-subtle/60 hover:border-subtle-hover hover:text-brand hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 shadow-sm group"
                  >
                    <Code2 size={13} className="group-hover:rotate-12 transition-transform text-brand" />
                    Scalar API Docs
                  </button>
                </div>

                {/* Navigasi Scrollspy Vertikal */}
                <nav className="nav hidden lg:block mt-10" aria-label="In-page jump links">
                  <ul className="w-max space-y-2.5">
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
                              className={`mr-3 h-px transition-all duration-300 group-hover:w-12 group-hover:bg-brand ${
                                isActive
                                  ? "w-12 bg-brand"
                                  : "w-6 bg-subtle"
                              }`}
                            />
                            <span
                              className={`text-xs font-mono font-medium uppercase tracking-wider transition-colors duration-300 group-hover:text-primary ${
                                isActive
                                  ? "text-primary"
                                  : "text-muted"
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

              {/* Social Links Kolom Kiri */}
              <div className="mt-8 lg:mt-0 flex flex-col gap-5">
                <ul className="flex items-center gap-5 text-secondary" aria-label="Social media">
                  <li>
                    <a
                      href="https://github.com/awaluddin-dev"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hover:text-brand transition-colors p-1"
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
                      className="hover:text-brand transition-colors p-1"
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
                      className="hover:text-brand transition-colors p-1"
                      aria-label="Dev.to (opens in a new tab)"
                    >
                      <PenTool size={20} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:hello@awaluddin.dev"
                      className="hover:text-brand transition-colors p-1"
                      aria-label="Email (opens mail client)"
                    >
                      <MapPin size={20} />
                    </a>
                  </li>
                </ul>

                <p className="text-xs font-mono text-muted">
                  hello@awaluddin.dev
                </p>
              </div>
            </aside>

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

              {/* SECTION 2: #projects */}
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

              {/* SECTION 3: #proficiency */}
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

              {/* SECTION 4: #experience */}
              <section
                id="experience"
                className="scroll-mt-16 lg:scroll-mt-24"
                aria-label="Work experience"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-canvas px-6 py-5 md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-brand">
                    Professional Experience
                  </h2>
                </div>
                <ExperienceSection isDark={isDark} />
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

