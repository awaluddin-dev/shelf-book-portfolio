import React from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  Download,
  Terminal,
  Github,
  Linkedin,
  PenTool,
  Mail,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { CircuitBoardBg } from "@/shared/ui/CircuitBoardBg";
import { AnimatedDivider } from "@/shared/ui/AnimatedDivider";

interface HeroSectionProps {
  isLoading: boolean;
  isDark: boolean;
  dynamicHeroConfig: any;
  activeMetrics: any[];
  renderIcon: (
    iconName: string,
    isSavings: boolean,
    size: number,
  ) => React.ReactNode;
  triggerToast: (msg: string) => void;
  setShowInquiryModal: (val: boolean) => void;
}

export default function HeroSection({
  isLoading,
  dynamicHeroConfig,
  activeMetrics,
  renderIcon,
  triggerToast,
  setShowInquiryModal,
}: HeroSectionProps) {
  return (
    <>
      <header className="relative z-10 min-h-[70vh] lg:min-h-[80vh] flex flex-col justify-center pt-6 md:pt-9 lg:pt-12 pb-16 md:pb-20 lg:pb-24 w-full overflow-hidden">
        <CircuitBoardBg />

        {/* Main Grid Content - equal-height containers on large screens */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-2 md:mt-4 lg:mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch animate-pulse">
              <div className="lg:col-span-8 flex flex-col gap-8 h-full py-2">
                <div className="h-20 bg-neu-accent/10 rounded-2xl w-2/3"></div>
                <div className="h-32 bg-neu-accent/5 rounded-2xl w-full"></div>
                <div className="h-12 bg-neu-accent/5 rounded-xl w-1/2"></div>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="h-[400px] bg-neu-accent/5 rounded-3xl w-full"></div>
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
                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-neu-text drop-shadow-sm transition-colors duration-300"
                  >
                    {dynamicHeroConfig?.name || "Awaluddin"}
                  </motion.h1>

                  {/* Subheadlines / Narrative Group */}
                  <div className="flex flex-col gap-y-4 md:gap-y-5">
                    {/* Subheadline */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-lg md:text-xl font-display font-bold text-neu-accent transition-colors duration-300"
                    >
                      {dynamicHeroConfig?.role ||
                        "Backend Engineer — Integrating LLMs into Production Systems"}
                    </motion.p>

                    {/* Body */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-sm md:text-base text-neu-text-muted max-w-3xl font-light leading-relaxed transition-colors duration-300"
                    >
                      Node.js & Go engineer building async, event-driven backend
                      systems for enterprise & fintech. I ship LLM integrations
                      into production - not train models in notebooks.
                    </motion.p>
                  </div>

                  {/* Stack Badge Row */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2 mt-5 mb-6 md:mt-6 md:mb-8"
                  >
                    {["Node.js", "Go", "Python", "LangGraph", "PostgreSQL"].map(
                      (tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 text-[11px] md:text-xs font-mono text-neutral-400 bg-white/5 border border-white/10 rounded-full"
                        >
                          {tech}
                        </span>
                      ),
                    )}
                  </motion.div>

                  {/* CTA Buttons - Move CTA Button above Connection Terminal */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2 md:mt-4"
                  >
                    <button
                      onClick={() => {
                        document
                          .getElementById("projects")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-neu-text glass-card border border-neu-accent/30 hover:bg-neu-accent hover:text-white hover:border-neu-accent hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group w-full sm:w-auto px-6"
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
                      className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-neu-text glass-card border border-neu-accent/30 hover:bg-neu-accent hover:text-white hover:border-neu-accent hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group w-full sm:w-auto px-6"
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

              {/* Side CTA & Connection Terminal */}
              <div className="lg:col-span-4 flex flex-col justify-center py-2 gap-6">
                {/* Connection Terminal Card */}
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

                  <div className="w-full h-px bg-white/5 my-2"></div>

                  <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                    <span className="text-neu-text-muted/60 font-bold uppercase tracking-widest mb-1 text-[9px]">
                      Status
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="relative flex h-2 w-2 shrink-0">
                        {dynamicHeroConfig?.openForWork ? (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </>
                        ) : (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </>
                        )}
                      </div>
                      <span
                        className={cn(
                          "font-bold",
                          dynamicHeroConfig?.openForWork
                            ? "text-emerald-500 dark:text-emerald-400"
                            : "text-amber-500 dark:text-amber-400",
                        )}
                      >
                        {dynamicHeroConfig?.openForWork
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
                      Available from:{" "}
                      {dynamicHeroConfig?.availableFrom || "Now"}
                    </span>
                  </div>

                  <div className="w-full h-px bg-white/5 my-2"></div>

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

          {/* Spaced Metric Cards - Unified Terminal Style */}
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
                    activeMetrics.length === 1 ? "grid-cols-1" : "grid-cols-2",
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
                      {/* Top Row: Icon and Numeric info */}
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

                      {/* Bottom Row: Text info */}
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

      <AnimatedDivider
        icon={BookOpen}
        quote="A shelf built from real problems, late nights, and systems
                that had to work."
      />
    </>
  );
}
