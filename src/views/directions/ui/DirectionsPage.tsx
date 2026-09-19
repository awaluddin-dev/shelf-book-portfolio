"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  Sparkles,
  Layers,
  BrainCircuit,
  Cpu,
  Cloud,
  Zap,
  Server,
  Terminal,
  ExternalLink,
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  Play,
  Tv,
  PenTool,
  Hourglass,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { usePortfolioStore } from "@/shared/store/portfolioStore";
import { LeftPanel } from "@/widgets/left-panel/ui/LeftPanel";
import { ResumeModal } from "@/widgets/resume-modal/ui/ResumeModal";
import { Loader } from "@/shared/ui/Loader";
import { cn } from "@/shared/lib/utils";

const DIRECTIONS_NAV_ITEMS = [
  { id: "current", label: "Right Now" },
  { id: "roadmap", label: "Quarterly Roadmap" },
  { id: "writing", label: "Dev.to Writing" },
  { id: "media", label: "YouTube Channel" },
];

export function DirectionsPage() {
  const {
    dynamicHeroConfig,
    directionsV2,
    devtoArticles,
    youtubeVideos,
    fetchDirectionsV2,
    fetchDevToArticles,
    fetchYouTubeVideos,
    isLoading,
    setShowResumeModal,
  } = usePortfolioStore();

  const [activeSection, setActiveSection] = useState("current");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchDirectionsV2();
    fetchDevToArticles();
    fetchYouTubeVideos();
  }, [fetchDirectionsV2, fetchDevToArticles, fetchYouTubeVideos]);

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
    const sections = ["current", "roadmap", "writing", "media"];
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

  const renderIcon = (name?: string) => {
    const className = "w-5 h-5 text-brand";
    switch (name) {
      case "BrainCircuit":
        return <BrainCircuit className={className} />;
      case "Layers":
        return <Layers className={className} />;
      case "Cpu":
        return <Cpu className={className} />;
      case "Cloud":
        return <Cloud className={className} />;
      case "Zap":
        return <Zap className={className} />;
      case "Server":
        return <Server className={className} />;
      case "Terminal":
        return <Terminal className={className} />;
      default:
        return <Compass className={className} />;
    }
  };

  const quarters = Object.keys(directionsV2.roadmapByQuarter || {}).sort();

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
              navItems={DIRECTIONS_NAV_ITEMS}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />

            {/* Panel Kanan (Scrollable) */}
            <main
              id="content"
              className="pt-16 lg:pt-24 lg:w-[60%] xl:w-[65%] lg:py-24 space-y-24"
            >
              {/* Top Navigation Back to Portfolio Home */}
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
                  <Compass size={13} className="animate-spin-slow" />
                  <span>Activity & Directions</span>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* SECTION 1: RIGHT NOW (Current Focus & Active Projects) */}
              {/* ----------------------------------------------------------------- */}
              {directionsV2.current && directionsV2.current.length > 0 && (
                <section id="current" className="scroll-mt-24 space-y-8">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 font-mono text-xs text-brand uppercase tracking-wider">
                      <Sparkles size={14} />
                      <span>Active Endeavors</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
                      What I&apos;m Doing Right Now
                    </h2>
                    <p className="text-sm text-secondary leading-relaxed max-w-2xl">
                      Current technical deep dives, active experiments, and architectural
                      prototypes currently on my workbench.
                    </p>
                  </div>

                  <div className="grid gap-5">
                    {directionsV2.current.map((item: any) => (
                      <div
                        key={item.id}
                        className={cn(
                          "group relative rounded-2xl border border-subtle bg-card/60 p-6 backdrop-blur-sm transition-all duration-200 cursor-default",
                          "hover:bg-brand/[0.06] hover:shadow-[inset_0_0_0_1px_rgba(50,130,184,0.3)] hover:border-brand/40 hover:-translate-y-0.5",
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-surface border border-subtle group-hover:border-brand/40 group-hover:text-brand transition-colors">
                              {renderIcon(item.icon)}
                            </div>
                            <div>
                              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-subtle/50 text-brand uppercase tracking-wider">
                                {item.category}
                              </span>
                              <h3 className="text-lg font-display font-bold text-primary group-hover:text-brand transition-colors mt-1">
                                {item.title}
                              </h3>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>In Progress</span>
                          </span>
                        </div>

                        <p className="mt-3.5 text-xs sm:text-sm text-secondary font-normal leading-relaxed">
                          {item.description}
                        </p>

                        {item.depth && (
                          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-muted">
                            <span className="text-brand">Target:</span>
                            <span>{item.depth}</span>
                          </div>
                        )}

                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {item.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface border border-subtle text-muted group-hover:border-brand/20 transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.link && (
                          <div className="mt-4 pt-3 border-t border-subtle flex items-center justify-between">
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex items-center gap-1 text-xs font-mono text-brand hover:underline"
                            >
                              <span>{item.linkText || "View Repository"}</span>
                              <ArrowUpRight size={13} />
                            </a>
                            <span className="text-[11px] font-mono text-muted">
                              {item.quarter}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* SECTION 2: ROADMAP BY QUARTER (Future Directions) */}
              {/* ----------------------------------------------------------------- */}
              {quarters.length > 0 && (
                <section id="roadmap" className="scroll-mt-24 space-y-8">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 font-mono text-xs text-brand uppercase tracking-wider">
                      <Calendar size={14} />
                      <span>Quarterly Timeline</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
                      Future Roadmap & Directions
                    </h2>
                    <p className="text-sm text-secondary leading-relaxed max-w-2xl">
                      Structured milestone trajectory calculated per quarter — spanning
                      distributed systems, AI agents, and open-source infrastructure.
                    </p>
                  </div>

                  <div className="space-y-10 relative before:absolute before:inset-0 before:left-3.5 before:w-px before:bg-subtle/80">
                    {quarters.map((q) => {
                      const items = directionsV2.roadmapByQuarter[q] || [];
                      const isCurrentQuarter =
                        q.toLowerCase().includes("q1 2026") ||
                        q.toLowerCase().includes("current") ||
                        items.some((i: any) => i.status === "in_progress");

                      return (
                        <div key={q} className="relative pl-10 space-y-4">
                          {/* Timeline Marker (Pulse when current quarter) */}
                          <div
                            className={cn(
                              "absolute left-1.5 top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 flex items-center justify-center",
                              isCurrentQuarter
                                ? "bg-status border-status/80 shadow-[0_0_12px_rgba(20,255,236,0.8)] scale-110"
                                : "bg-canvas border-subtle",
                            )}
                          >
                            {isCurrentQuarter && (
                              <span className="absolute inset-0 rounded-full bg-status animate-ping opacity-75" />
                            )}
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                isCurrentQuarter ? "bg-canvas" : "bg-brand",
                              )}
                            />
                          </div>

                          {/* Quarter Badge with Highlight */}
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-colors",
                                isCurrentQuarter
                                  ? "bg-status/15 text-status border-status/40 shadow-[0_0_10px_rgba(20,255,236,0.2)]"
                                  : "bg-brand/10 border-brand/30 text-brand",
                              )}
                            >
                              <Clock size={12} />
                              <span>{q}</span>
                            </div>
                            {isCurrentQuarter && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-status/20 text-status border border-status/40 animate-pulse">
                                Current Focus Quarter
                              </span>
                            )}
                          </div>

                          {/* Items under this Quarter with Career-like Hover Effect */}
                          <div className="grid gap-4">
                            {items.map((item: any) => {
                              const isItemCurrent =
                                isCurrentQuarter ||
                                item.status === "in_progress" ||
                                item.type === "current";

                              return (
                                <article
                                  key={item.id}
                                  className={cn(
                                    "relative transition-all duration-200 p-5 rounded-2xl cursor-default group border border-subtle bg-card/40",
                                    "hover:bg-brand/[0.06] hover:shadow-[inset_0_0_0_1px_rgba(50,130,184,0.3)] hover:border-brand/40",
                                    isItemCurrent && "border-brand/30 bg-card/60",
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-subtle text-brand uppercase">
                                          {item.category}
                                        </span>
                                        {item.depth && (
                                          <span className="text-[11px] font-mono text-muted">
                                            • {item.depth}
                                          </span>
                                        )}
                                      </div>
                                      <h4 className="text-base font-display font-bold text-primary group-hover:text-brand transition-colors">
                                        {item.title}
                                      </h4>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {isItemCurrent ? (
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-status/15 text-status border border-status/40">
                                          <span className="w-1.5 h-1.5 rounded-full bg-status animate-ping" />
                                          <span>Active</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-subtle text-muted">
                                          <Hourglass size={11} />
                                          <span>{item.status || "Planned"}</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <p className="mt-2.5 text-xs sm:text-sm text-secondary font-normal leading-relaxed">
                                    {item.description}
                                  </p>

                                  {item.tags && item.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                      {item.tags.map((tag: string) => (
                                        <span
                                          key={tag}
                                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-subtle text-muted group-hover:border-brand/20 transition-colors"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </article>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* SECTION 3: WRITING (Fetched from Dev.to) */}
              {/* ----------------------------------------------------------------- */}
              {devtoArticles && devtoArticles.length > 0 && (
                <section id="writing" className="scroll-mt-24 space-y-8">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 font-mono text-xs text-brand uppercase tracking-wider">
                      <PenTool size={14} />
                      <span>Technical Articles</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
                        Writings on Dev.to
                      </h2>
                      <a
                        href="https://dev.to/awaluddin"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-brand hover:underline"
                      >
                        <span>dev.to/awaluddin</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <p className="text-sm text-secondary leading-relaxed max-w-2xl">
                      Engineering thoughts, architectural post-mortems, and technical tutorials
                      published directly on dev.to (showing 2 latest articles).
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {devtoArticles.slice(0, 2).map((art: any) => (
                      <a
                        key={art.id}
                        href={art.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={cn(
                          "group flex flex-col justify-between rounded-2xl border border-subtle bg-card/60 p-5 backdrop-blur-sm transition-all duration-200",
                          "hover:bg-brand/[0.06] hover:shadow-[inset_0_0_0_1px_rgba(50,130,184,0.3)] hover:border-brand/40 hover:-translate-y-0.5",
                        )}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                            <span>{art.readablePublishDate || "Published"}</span>
                            <span>{art.readingTimeMinutes} min read</span>
                          </div>
                          <h4 className="text-base font-display font-bold text-primary group-hover:text-brand transition-colors line-clamp-2">
                            {art.title}
                          </h4>
                          <p className="text-xs text-secondary line-clamp-3 leading-relaxed">
                            {art.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-subtle flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs font-mono text-muted">
                            <span className="inline-flex items-center gap-1">
                              <Heart size={12} className="text-rose-400" />
                              <span>{art.publicReactionsCount}</span>
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageSquare size={12} />
                              <span>{art.commentsCount}</span>
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-mono text-brand group-hover:translate-x-0.5 transition-transform">
                            <span>Read Article</span>
                            <ArrowUpRight size={13} />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* SECTION 4: YOUTUBE CHANNEL (Video Content) */}
              {/* ----------------------------------------------------------------- */}
              {youtubeVideos && youtubeVideos.length > 0 && (
                <section id="media" className="scroll-mt-24 space-y-8">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 font-mono text-xs text-brand uppercase tracking-wider">
                      <Tv size={14} />
                      <span>Video Content & Deep Dives</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
                        YouTube Channel
                      </h2>
                      <a
                        href="https://www.youtube.com"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-brand hover:underline"
                      >
                        <span>Visit Channel</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <p className="text-sm text-secondary leading-relaxed max-w-2xl">
                      Featured video and latest screencast walk-throughs on software engineering and architecture.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {youtubeVideos.slice(0, 2).map((video: any, idx: number) => (
                      <a
                        key={video.id}
                        href={video.videoUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={cn(
                          "group rounded-2xl border border-subtle bg-card/60 overflow-hidden transition-all duration-200 flex flex-col justify-between",
                          "hover:bg-brand/[0.06] hover:shadow-[inset_0_0_0_1px_rgba(50,130,184,0.3)] hover:border-brand/40 hover:-translate-y-0.5",
                        )}
                      >
                        <div className="relative aspect-video w-full bg-surface overflow-hidden">
                          {video.thumbnailUrl ? (
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-card">
                              <Tv size={32} className="text-muted" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-primary font-bold">
                            {idx === 0 ? "Featured Video" : "Latest Upload"}
                          </div>
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-brand text-canvas flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                              <Play size={20} className="ml-0.5 fill-current" />
                            </div>
                          </div>
                          {video.duration && (
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-primary">
                              {video.duration}
                            </span>
                          )}
                        </div>

                        <div className="p-4 space-y-2">
                          <h4 className="text-sm font-display font-bold text-primary group-hover:text-brand transition-colors line-clamp-2">
                            {video.title}
                          </h4>
                          {video.description && (
                            <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                              {video.description}
                            </p>
                          )}
                          {video.views && (
                            <div className="text-[11px] font-mono text-muted pt-1">
                              {video.views} views
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}

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

        {/* Back To Top Floating Button */}
        {showBackToTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-brand text-canvas shadow-lg hover:opacity-90 transition-all z-40"
            aria-label="Back to top"
          >
            <ArrowUpRight size={18} className="-rotate-45" />
          </button>
        )}

        {/* Global Modals */}
        <ResumeModal />
      </div>
    </>
  );
}

export default DirectionsPage;
