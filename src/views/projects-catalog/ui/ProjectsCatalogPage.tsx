"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, FileText } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { usePortfolioStore } from "@/shared/store/portfolioStore";
import { LeftPanel } from "@/widgets/left-panel/ui/LeftPanel";
import ProjectsSection from "@/widgets/projects-list/ui/ProjectsList";
import ProjectModal from "@/widgets/project-modal/ui/ProjectModal";
import { ResumeModal } from "@/widgets/resume-modal/ui/ResumeModal";
import { Loader } from "@/shared/ui/Loader";
import { getTechIconAndColor } from "@/shared/lib/tech-icons";

const PROJECTS_NAV_ITEMS = [
  { id: "projects", label: "All Projects" },
];

export function ProjectsCatalogPage() {
  const isDark = true;
  const {
    dynamicHeroConfig,
    initializeData,
    isLoading,
    setShowResumeModal,
  } = usePortfolioStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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

      <div className="min-h-screen font-sans selection:bg-subtle selection:text-primary relative bg-canvas text-secondary">
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
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-brand transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setShowResumeModal(true)}
              className="px-2.5 py-1 rounded-lg bg-card border border-subtle text-secondary hover:text-primary hover:border-subtle-hover transition-colors duration-150 flex items-center gap-1 cursor-pointer"
            >
              <FileText size={11} className="text-brand" />
              <span>Resume</span>
            </button>
            <a
              href={dynamicHeroConfig?.docsUrl || "https://sb.awaluddin.dev/docs"}
              target="_blank"
              rel="noreferrer noopener"
              className="px-2.5 py-1 rounded-lg bg-card border border-subtle text-brand hover:text-primary hover:border-subtle-hover transition-colors duration-150"
            >
              Docs
            </a>
          </div>
        </div>

        {/* Main 2-Column Container */}
        <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12 lg:py-0">
          <div className="lg:flex lg:justify-between lg:gap-12 xl:gap-16">
            {/* Panel Kiri (Sticky) */}
            <LeftPanel
              navItems={PROJECTS_NAV_ITEMS}
              activeSection="projects"
            />

            {/* Panel Kanan (Scrollable) */}
            <main
              id="content"
              className="pt-16 lg:pt-24 lg:w-[60%] xl:w-[65%] lg:py-24 space-y-12"
            >
              {/* Back link & Top Badge */}
              <div className="flex items-center justify-between pb-6 border-b border-subtle">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-brand group transition-colors"
                >
                  <ArrowLeft
                    size={14}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                  <span>Back to Main Portfolio</span>
                </Link>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-brand/10 border border-brand/25 text-brand">
                  <BookOpen size={13} />
                  <span>Full Project Catalog</span>
                </div>
              </div>

              {/* Full Projects Section with Dual-View Mode & Filters */}
              <section id="projects" className="scroll-mt-24">
                <ProjectsSection
                  isDark={isDark}
                  isFeaturedOnly={false}
                  showViewAll={false}
                />
              </section>

              {/* Footer */}
              <footer className="pt-12 pb-8 border-t border-subtle text-xs font-mono text-muted flex flex-col sm:flex-row items-center justify-between gap-4">
                <span>© {new Date().getFullYear()} Awaluddin. All rights reserved.</span>
                <Link
                  href="/"
                  className="hover:text-brand transition-colors flex items-center gap-1"
                >
                  <ArrowLeft size={12} />
                  <span>Return to Home</span>
                </Link>
              </footer>
            </main>
          </div>
        </div>

        {/* Modals */}
        <ProjectModal isDark={isDark} getTechIconAndColor={getTechIconAndColor} />
        <ResumeModal />
      </div>
    </>
  );
}

export default ProjectsCatalogPage;
