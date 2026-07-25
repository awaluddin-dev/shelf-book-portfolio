import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, GitFork, Cpu, Globe, Rocket, ArrowRight, Activity, TrendingUp, Layers, PenTool, ExternalLink, BriefcaseBusiness, Briefcase, BrainCircuit, Milestone, User } from 'lucide-react';
import { AnimatedDivider } from "@/shared/ui/AnimatedDivider";
import P5Background from '@/shared/ui/P5Background';
import SkillTree from '@/entities/skill/ui/SkillTree';
import { cn } from '@/shared/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { legendLevels } from '@/shared/lib/helpers';

interface ProficiencySectionProps {
  dynamicProficiency: any[];
  activeRoadmap: any[];
  activeCurrentFocus: boolean;
  renderIcon: (iconName: string, isSavings: boolean, customSize?: number) => React.ReactNode;
  selectedRoadmapIndex: number | null;
  setSelectedRoadmapIndex: (idx: number | null) => void;
  isDark: boolean;
  activeProficiency: any[];
  isLoading: boolean;
}

export default function ProficiencySection({
  dynamicProficiency,
  activeRoadmap,
  activeCurrentFocus,
  renderIcon,
  selectedRoadmapIndex,
  setSelectedRoadmapIndex,
  isDark,
  activeProficiency,
  isLoading
}: ProficiencySectionProps) {
  return (
    <>
      {/* Combined Section 2: Stack, Learning, Philosophy & Career */}
      <section id="proficiency" className="scroll-mt-20">
        {/* Technical Proficiency Sub-section */}
        <motion.div
          className="max-w-7xl mx-auto mb-24"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
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

            {/* Legend with Tooltips */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 font-mono text-xs glass-card-inset px-4 py-2.5 rounded-2xl border border-white/5 select-none self-start md:self-auto z-10">
              <div className="relative group cursor-help flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-neu-text font-medium text-[11px] sm:text-xs">
                  Production-ready
                </span>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-xl bg-zinc-950/95 dark:bg-white/95 text-zinc-100 dark:text-zinc-900 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none text-left text-[11.5px] font-sans leading-relaxed border border-white/10 dark:border-zinc-200/50 z-50">
                  <p className="font-semibold text-emerald-400 dark:text-emerald-600 mb-0.5">
                    Production-ready
                  </p>
                  <p className="text-zinc-300 dark:text-zinc-600">
                    Used in real-world production environments
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-950/95 dark:border-t-white/95" />
                </div>
              </div>

              <div className="relative group cursor-help flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-neu-text font-medium text-[11px] sm:text-xs">
                  In Use
                </span>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-xl bg-zinc-950/95 dark:bg-white/95 text-zinc-100 dark:text-zinc-900 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none text-left text-[11.5px] font-sans leading-relaxed border border-white/10 dark:border-zinc-200/50 z-50">
                  <p className="font-semibold text-blue-400 dark:text-blue-600 mb-0.5">
                    In Use
                  </p>
                  <p className="text-zinc-300 dark:text-zinc-600">
                    Actively used in current projects
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-950/95 dark:border-t-white/95" />
                </div>
              </div>

              <div className="relative group cursor-help flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-neu-text font-medium text-[11px] sm:text-xs">
                  Building
                </span>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-xl bg-zinc-950/95 dark:bg-white/95 text-zinc-100 dark:text-zinc-900 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none text-left text-[11.5px] font-sans leading-relaxed border border-white/10 dark:border-zinc-200/50 z-50">
                  <p className="font-semibold text-purple-400 dark:text-purple-600 mb-0.5">
                    Building
                  </p>
                  <p className="text-zinc-300 dark:text-zinc-600">
                    Currently learning through active projects
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-950/95 dark:border-t-white/95" />
                </div>
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
                          {/* Colored status dot */}
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
        </motion.div>

        {/* Professional Insights & Focus Section */}
        <motion.div
          className="max-w-7xl mx-auto mb-24"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
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
            {/* Writing Card */}
            <div className="p-5 sm:p-8 rounded-3xl glass-card group hover:shadow-neu-sm transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 glass-card-inset rounded-lg text-neu-accent">
                    <PenTool size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-neu-text">Writing</h3>
                </div>
                <p className="text-neu-text-muted font-medium mb-4 leading-relaxed">
                  &quot;I Rewrote a Fintech Platform Alone — No Handover, No
                  Team, No Docs&quot;
                </p>
              </div>
              <a
                href="https://dev.to/awaluddin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-neu-accent hover:underline mt-2"
              >
                Read on dev.to <ArrowRight size={16} />
              </a>
            </div>

            {/* Current Work Card */}
            <div className="p-5 sm:p-8 rounded-3xl glass-card group hover:shadow-neu-sm transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 glass-card-inset rounded-lg text-neu-accent">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-xl font-bold text-neu-text">
                  Current Work
                </h3>
              </div>
              <p className="text-neu-text-muted leading-relaxed">
                <strong className="text-neu-text font-medium">
                  At Astra Group
                </strong>
                {", shipping Node.js microservices for enterprise fleet and driver management. "}
                <strong className="text-neu-text font-medium">
                  Parallel focus:
                </strong>
                {" building AuraFlow AI as primary portfolio project for remote backend roles."}
              </p>
            </div>

            {/* Currently Learning Card */}
            <div className="p-5 sm:p-8 rounded-3xl glass-card group hover:shadow-neu-sm transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 glass-card-inset rounded-lg text-neu-accent">
                  <BrainCircuit size={20} />
                </div>
                <h3 className="text-xl font-bold text-neu-text">
                  Currently Learning
                </h3>
              </div>
              <p className="text-neu-text-muted leading-relaxed">
                Deepening LangGraph multi-agent patterns. Studying how LLMs work
                under the hood — to integrate them better, not to train them.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Learning Roadmap Sub-section (Moved below Professional Insights & Focus) */}
        <motion.div
          className="max-w-7xl mx-auto mb-24"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
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

          {/* Timeline Graph Visualization */}
          <div className="p-6 sm:p-10 rounded-3xl glass-card mb-10 overflow-hidden">
            {/* Timeline track (Horizontal on desktop, vertical list on narrow screens) */}
            <div className="relative my-8 px-4 hidden md:block">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-gray-300 dark:bg-zinc-800/80 -translate-y-1/2 rounded-full" />

              {/* Dynamic filled progress track */}
              <motion.div
                className="absolute top-1/2 left-0 h-[3px] bg-neu-accent -translate-y-1/2 rounded-full origin-left"
                initial={{ width: "0%" }}
                animate={{
                  width: `${(selectedRoadmapIndex! / (activeRoadmap.length - 1)) * 100}%`,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />

              {/* Milestones wrapper */}
              <div className="relative flex justify-between">
                {(activeRoadmap || []).map((item: any, index: number) => {
                  const isSelected = selectedRoadmapIndex! === index;
                  const isPast = index <= selectedRoadmapIndex!;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedRoadmapIndex(index)}
                      className="flex flex-col items-center group cursor-pointer relative z-10 focus:outline-none"
                    >
                      {/* Quarter Label */}
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

                      {/* Interactive Circle Node */}
                      <div className="relative flex items-center justify-center">
                        {/* Selected outer pulse ring */}
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

                      {/* Tech Badge name below */}
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

            {/* Mobile simplified timeline view */}
            <div className="flex md:hidden flex-wrap gap-2 justify-center mb-6">
              {(activeRoadmap || []).map((item: any, index: number) => {
                const isSelected = selectedRoadmapIndex! === index;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedRoadmapIndex(index)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border cursor-pointer",
                      isSelected
                        ? "glass-card-inset text-neu-accent border-neu-accent/30"
                        : "glass-card border-transparent text-neu-text-muted hover:text-neu-text",
                    )}
                  >
                    <span className="opacity-60">{item.quarter}:</span>
                    <span>{item.tech}</span>
                  </button>
                );
              })}
            </div>

            {/* Details panel for the selected roadmap item */}
            <AnimatePresence mode="wait">
              {activeRoadmap.length > 0 && activeRoadmap[selectedRoadmapIndex!] && (
                <motion.div
                  key={`roadmap-details-${selectedRoadmapIndex!}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="mt-6 p-6 sm:p-8 rounded-3xl glass-card-inset border border-gray-300/30 dark:border-gray-800/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Tech Info */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3.5 rounded-2xl glass-card text-neu-accent">
                        {renderIcon(
                          activeRoadmap[selectedRoadmapIndex!].icon,
                          false,
                          24,
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-bold tracking-widest text-neu-accent uppercase">
                            {activeRoadmap[selectedRoadmapIndex!].quarter}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase bg-white/50 dark:bg-black/30 border border-gray-300/40 dark:border-zinc-800 text-neu-accent/90">
                            <span className="w-1.5 h-1.5 rounded-full bg-neu-accent mr-1.5" />
                            {activeRoadmap[selectedRoadmapIndex!].status}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-neu-text mt-1">
                          {activeRoadmap[selectedRoadmapIndex!].tech}
                        </h4>
                      </div>
                    </div>

                    <p className="text-sm text-neu-text-muted leading-relaxed">
                      {activeRoadmap[selectedRoadmapIndex!].description}
                    </p>

                    <div className="flex items-center gap-6 pt-2">
                      <div>
                        <span className="block font-mono text-[10px] text-neu-text-muted uppercase tracking-wider">
                          Estimated Depth
                        </span>
                        <span className="text-sm font-semibold text-neu-text">
                          {activeRoadmap[selectedRoadmapIndex!].depth}
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

                  {/* Topics & Target Projects */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Core Topics */}
                    <div className="p-5 rounded-2xl bg-white/20 dark:bg-black/10 border border-white/10">
                      <span className="block font-mono text-[10px] text-neu-accent font-extrabold uppercase tracking-widest mb-3">
                        Core Topics to Master
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-neu-text-muted">
                        {activeRoadmap[selectedRoadmapIndex!].topics.map(
                          (topic: any, i: number) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-neu-accent/80 flex-shrink-0" />
                              <span>{topic}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* Target Projects */}
                    <div className="p-5 rounded-2xl bg-white/20 dark:bg-black/10 border border-white/10">
                      <span className="block font-mono text-[10px] text-neu-accent font-extrabold uppercase tracking-widest mb-3">
                        Planned Prototype Projects
                      </span>
                      <ul className="space-y-2 text-xs text-neu-text-muted font-mono">
                        {(activeRoadmap[selectedRoadmapIndex!].projects || []).map(
                          (proj: any, i: number) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="mt-0.5 text-neu-accent">✦</span>
                              <span className="text-neu-text">{proj}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Skill Tree Section */}
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SkillTree isDark={isDark} isLoading={isLoading} />
        </motion.div>

        {/* Animated divider with a section-specific icon and quote tooltip */}
        <AnimatedDivider 
          icon={User} 
          quote="My professional journey is a continuous loop of learning, building, breaking, and improving." 
        />
      </section>
    </>
  );
}