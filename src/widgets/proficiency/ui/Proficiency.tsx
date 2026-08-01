import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import {
  Cpu,
  TrendingUp,
  Layers,
  BriefcaseBusiness,
  ArrowRight,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { AnimatedDivider } from "@/shared/ui/AnimatedDivider";

import SkillTree from "@/entities/skill/ui/SkillTree";
import { cn } from "@/shared/lib/utils";

import { usePortfolioStore } from "@/shared/store/portfolioStore";

interface ProficiencySectionProps {
  renderIcon: (
    iconName: string,
    isSavings: boolean,
    customSize?: number,
  ) => React.ReactNode;
  isDark: boolean;
}

export default function ProficiencySection({
  renderIcon,
  isDark = true,
}: Readonly<ProficiencySectionProps>) {
  const {
    dynamicProficiency: activeProficiency,
    dynamicRoadmap: activeRoadmap,
    languageData,
    isLoading,
  } = usePortfolioStore();

  const [selectedRoadmapIndex, setSelectedRoadmapIndex] = useState<
    number | null
  >(0);

  // States to link Technical Proficiency grid with Interactive Skill Tree
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  const [hoveredLang, setHoveredLang] = useState<string | null>(null);
  const [windowStartIndex, setWindowStartIndex] = useState<number>(0);
  const MAX_VISIBLE = 4;

  const handleSelectNode = (index: number) => {
    setSelectedRoadmapIndex(index);
    if (
      index === windowStartIndex + MAX_VISIBLE - 1 &&
      index < activeRoadmap.length - 1
    ) {
      setWindowStartIndex(windowStartIndex + 1);
    }
    if (index === windowStartIndex && index > 0) {
      setWindowStartIndex(windowStartIndex - 1);
    }
  };
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


          </div>


          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative">
            {/* Left Column: Proficiency Categories (35%) */}
            <div className="w-full lg:w-[35%] space-y-6">
              {(activeProficiency || []).map((category: any, catIdx: number) => {
                const catLower = (category.title || "").toLowerCase();
                let titleColor = "#38bdf8";
                if (catLower.includes("backend")) titleColor = "#fbbf24";
                else if (catLower.includes("infra") || catLower.includes("data")) titleColor = "#f43f5e";
                else if (catLower.includes("ai") || catLower.includes("automation") || catLower.includes("integration")) titleColor = "#8b5cf6";
                
                return (
                  <div
                    key={catIdx as number}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={cn(
                      "p-6 sm:p-8 rounded-3xl glass-card border border-white/5 dark:border-zinc-800/30 flex flex-col justify-between relative overflow-hidden group/card transition-all duration-300",
                      hoveredCategory === category.id ? "shadow-lg scale-[1.01]" : ""
                    )}
                    style={{
                      borderColor: hoveredCategory === category.id ? `${titleColor}50` : undefined,
                      boxShadow: hoveredCategory === category.id ? `0 0 30px ${titleColor}15` : undefined
                    }}
                  >
                    <div className="relative z-10">
                      <h3 
                        className="font-mono text-xs font-extrabold uppercase tracking-widest border-b border-gray-200/10 dark:border-zinc-800/30 pb-3.5 mb-4"
                        style={{ color: titleColor }}
                      >
                        {category.title}
                      </h3>

                      <div className="flex flex-col">
                        {category.skills?.map((skill: any, skillIdx: number) => (
                          <div
                            key={skillIdx as number}
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              setHoveredSkillId(skill.id);
                              setHoveredCategory(category.id);
                            }}
                            onMouseLeave={(e) => {
                              e.stopPropagation();
                              setHoveredSkillId(null);
                              setHoveredCategory(category.id);
                            }}
                            className="py-4 border-b border-gray-200/5 dark:border-zinc-800/20 last:border-b-0 flex justify-between items-center gap-4 group/item cursor-pointer"
                          >
                            <div className="flex items-start gap-3">
                              {/* Colored status dot */}
                              <span
                                className={cn(
                                  "w-2 h-2 rounded-full mt-1.5 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-125",
                                  skill.status === "Production-ready" && "bg-emerald-500",
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
                                  skill.status === "Production-ready" && "border-emerald-500/20 text-emerald-600 bg-emerald-500/5 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30",
                                  skill.status === "In Use" && "border-blue-500/20 text-blue-600 bg-blue-500/5 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/30",
                                  skill.status === "Building" && "border-purple-500/20 text-purple-600 bg-purple-500/5 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/30",
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
                );
              })}
            </div>

            {/* Right Column: Interactive Skill Tree (Sticky) */}
            <div className="w-full lg:w-[65%] sticky top-24 z-10 glass-card rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/5 dark:border-zinc-800/30 shadow-neu-lg max-h-[calc(100vh-6rem)] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pl-2">
                <div>
                  <p className="text-[11px] font-mono text-neu-text-muted mt-1 max-w-sm leading-relaxed">
                    Hover over categories or skills on the left to highlight their infrastructure dependencies and relationships below.
                  </p>
                </div>
                
                {/* Legend with Tooltips */}
                <div className="relative flex flex-wrap items-center gap-x-5 gap-y-2.5 font-mono text-xs px-4 py-2.5 rounded-2xl select-none self-start md:self-auto z-10 group/legend shadow-sm">
                  {/* Glowing SVG Border mimicking DockNavigation */}
                  <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none rounded-2xl z-0 overflow-visible">
                    <defs>
                      <linearGradient id="legend-glow" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="40">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="transparent" />
                        <stop offset="75%" stopColor="#3b82f6" />
                        <stop offset="85%" stopColor="#8b5cf6" />
                        <stop offset="95%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f59e0b" />
                        <animateTransform attributeName="gradientTransform" type="rotate" from="0 150 20" to="360 150 20" dur="4s" repeatCount="indefinite"/>
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" rx="16" fill="none" stroke="url(#legend-glow)" strokeWidth="3" />
                    <rect x="0" y="0" width="100%" height="100%" rx="16" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1.5" />
                  </svg>
                  <div className="absolute inset-0 bg-neu-bg/80 dark:bg-neu-bg/90 backdrop-blur-xl rounded-2xl -z-10" />

                  <div className="relative group cursor-help flex items-center gap-1.5 z-10">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-neu-text font-medium text-[10px] sm:text-[11px]">
                      Production-ready
                    </span>
                    {/* Tooltip */}
                    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-56 p-3 rounded-xl bg-zinc-950/95 dark:bg-white/95 text-zinc-100 dark:text-zinc-900 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none text-left text-[11px] font-sans leading-relaxed border border-white/10 dark:border-zinc-200/50 z-50">
                      <p className="font-semibold text-emerald-400 dark:text-emerald-600 mb-0.5">Production-ready</p>
                      <p className="text-zinc-300 dark:text-zinc-600">Used in real-world production environments</p>
                      <div className="absolute bottom-[100%] left-1/2 -translate-x-1/2 mb-0 border-4 border-transparent border-b-zinc-950/95 dark:border-b-white/95" />
                    </div>
                  </div>

                  <div className="relative group cursor-help flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-neu-text font-medium text-[10px] sm:text-[11px]">
                      In Use
                    </span>
                    {/* Tooltip */}
                    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-56 p-3 rounded-xl bg-zinc-950/95 dark:bg-white/95 text-zinc-100 dark:text-zinc-900 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none text-left text-[11px] font-sans leading-relaxed border border-white/10 dark:border-zinc-200/50 z-50">
                      <p className="font-semibold text-blue-400 dark:text-blue-600 mb-0.5">In Use</p>
                      <p className="text-zinc-300 dark:text-zinc-600">Actively used in current projects</p>
                      <div className="absolute bottom-[100%] left-1/2 -translate-x-1/2 mb-0 border-4 border-transparent border-b-zinc-950/95 dark:border-b-white/95" />
                    </div>
                  </div>

                  <div className="relative group cursor-help flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-neu-text font-medium text-[10px] sm:text-[11px]">
                      Building
                    </span>
                    {/* Tooltip */}
                    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-56 p-3 rounded-xl bg-zinc-950/95 dark:bg-white/95 text-zinc-100 dark:text-zinc-900 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none text-left text-[11px] font-sans leading-relaxed border border-white/10 dark:border-zinc-200/50 z-50">
                      <p className="font-semibold text-purple-400 dark:text-purple-600 mb-0.5">Building</p>
                      <p className="text-zinc-300 dark:text-zinc-600">Currently learning through active projects</p>
                      <div className="absolute bottom-[100%] left-1/2 -translate-x-1/2 mb-0 border-4 border-transparent border-b-zinc-950/95 dark:border-b-white/95" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 -mx-4 sm:mx-0">
                <SkillTree 
                  isDark={isDark} 
                  isLoading={isLoading} 
                  externalHoveredNodeId={hoveredSkillId}
                  externalHoveredCategory={hoveredCategory}
                  activeProficiency={activeProficiency}
                />
              </div>
            </div>

          </div>

          {/* Most Used Languages Section (Moved to Bottom) */}
          {languageData && languageData.length > 0 && (
            <motion.div
              className="mt-8 p-6 sm:p-8 rounded-3xl glass-card border border-white/5 dark:border-zinc-800/30 relative overflow-hidden max-w-7xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between border-b border-gray-200/10 dark:border-zinc-800/30 pb-3.5">
                  <h3 className="font-mono text-xs font-extrabold uppercase tracking-widest text-neu-accent">
                    Most Used Languages
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    Live from GitHub
                  </span>
                </div>
              </div>

              {/* Donut Chart & Language Cards */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-full md:w-1/3 flex justify-center items-center h-[240px] relative">
                  <PieChart width={240} height={240}>
                    <Pie
                      data={languageData}
                      cx={120}
                      cy={120}
                      innerRadius={0}
                      outerRadius={105}
                      paddingAngle={2}
                      dataKey="percentage"
                      stroke="none"
                      isAnimationActive={true}
                    >
                      {languageData.map((entry, index) => {
                        const isHovered = hoveredLang === entry.name;
                        const isOtherHovered =
                          hoveredLang !== null && !isHovered;
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            fillOpacity={isHovered ? 0.4 : 0.15}
                            stroke={entry.color}
                            strokeWidth={1}
                            className="cursor-pointer focus:outline-none"
                            style={{
                              outline: "none",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              opacity: isOtherHovered ? 0.3 : 1,
                              filter: isHovered
                                ? `brightness(1.2) drop-shadow(0px 0px 8px ${entry.color})`
                                : "none",
                              transform: isHovered
                                ? "scale(1.05)"
                                : "scale(1)",
                              transformOrigin: "120px 120px",
                            }}
                            onMouseEnter={() => setHoveredLang(entry.name)}
                            onMouseLeave={() => setHoveredLang(null)}
                          />
                        );
                      })}
                    </Pie>
                  </PieChart>
                </div>

                <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
                  {languageData.map((lang, idx) => {
                    const isHovered = hoveredLang === lang.name;
                    const isOtherHovered = hoveredLang !== null && !isHovered;
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -2 }}
                        onMouseEnter={() => setHoveredLang(lang.name)}
                        onMouseLeave={() => setHoveredLang(null)}
                        className={cn(
                          "relative flex flex-col gap-1 p-3 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer group",
                          isHovered
                            ? "border-neu-accent bg-neu-accent/5 scale-[1.02]"
                            : "bg-neu-bg/40 border-gray-200/50 dark:border-zinc-800/30",
                          isOtherHovered ? "opacity-40" : "opacity-100",
                        )}
                        style={{
                          backgroundColor: isHovered
                            ? undefined
                            : `${lang.color}15`,
                          borderColor: isHovered
                            ? undefined
                            : `${lang.color}30`,
                        }}
                      >
                        {idx === 0 && (
                          <div
                            className="absolute -top-2 -right-2 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 flex items-center gap-1"
                            style={{ backgroundColor: lang.color }}
                          >
                            TOP 1
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full shadow-sm"
                              style={{ backgroundColor: lang.color }}
                            />
                            <span className="text-xs font-bold text-neu-text group-hover:text-neu-accent transition-colors">
                              {lang.name}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-neu-text-muted">
                          {lang.percentage.toFixed(1)}%
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Combined Focus & Roadmap Section (Tab Switcher Layout) */}
        <motion.div
          className="max-w-7xl mx-auto mb-24"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="p-5 sm:p-8 rounded-3xl glass-card-inset space-y-6 max-w-full overflow-hidden">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-300/30 dark:border-zinc-800/30 pb-6">
              <div>
                <div className="flex items-center gap-2 text-neu-accent mb-1">
                  <Layers size={18} />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
                    Focus & Roadmap
                  </span>
                </div>
                <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
                  Current & Future Directions
                </h2>
              </div>
            </div>

            <div className="relative min-h-[400px]">
              {/* Timeline Graph Visualization */}

              {/* Timeline track (Horizontal on desktop, vertical list on narrow screens) */}
              <div className="relative mt-8 mb-16 px-12 hidden md:block">
                <div className="relative h-20 w-full">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-gray-300 dark:bg-zinc-800/80 -translate-y-1/2 rounded-full" />

                  {/* Dynamic filled progress track */}
                  <motion.div
                    className="absolute top-1/2 left-0 h-[3px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-gradient-x -translate-y-1/2 rounded-full origin-left"
                    initial={{ width: "0%" }}
                    animate={{
                      width:
                        activeRoadmap.length > 1
                          ? `${(Math.max(0, Math.min(selectedRoadmapIndex! - windowStartIndex, MAX_VISIBLE - 1)) / (Math.min(activeRoadmap.length - windowStartIndex, MAX_VISIBLE) - 1)) * 100}%`
                          : "0%",
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />

                  {/* Milestones wrapper */}
                  {(activeRoadmap || []).map(
                    (item: any, globalIndex: number) => {
                      const isSelected = selectedRoadmapIndex! === globalIndex;
                      const isPast = globalIndex <= selectedRoadmapIndex!;

                      const localIndex = globalIndex - windowStartIndex;
                      const isVisible =
                        localIndex >= 0 && localIndex < MAX_VISIBLE;

                      const visibleCount = Math.min(
                        activeRoadmap.length,
                        MAX_VISIBLE,
                      );
                      let percent = 50;
                      if (visibleCount > 1) {
                        percent = (localIndex / (visibleCount - 1)) * 100;
                      }

                      const isDone =
                        item.status?.toLowerCase() === "completed" ||
                        item.status?.toLowerCase() === "done" ||
                        item.status?.toLowerCase() === "success";

                      return (
                        <motion.button
                          key={globalIndex as number}
                          onClick={() =>
                            isVisible && handleSelectNode(globalIndex)
                          }
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer z-10 focus:outline-none w-32"
                          initial={false}
                          animate={{
                            left: `${percent}%`,
                            opacity: isVisible ? 1 : 0,
                            scale: isVisible ? 1 : 0.8,
                          }}
                          style={{
                            pointerEvents: isVisible ? "auto" : "none",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 20,
                          }}
                        >
                          {/* Quarter Label & Done Badge */}
                          <div className="absolute bottom-[100%] mb-3 flex flex-col items-center gap-1">
                            <span
                              className={cn(
                                "font-mono text-[11px] font-bold tracking-wider transition-colors duration-300 uppercase whitespace-nowrap",
                                isSelected
                                  ? "text-neu-accent font-extrabold"
                                  : "text-neu-text-muted group-hover:text-neu-text",
                              )}
                            >
                              {item.quarter}
                            </span>
                            {isDone && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 leading-none">
                                DONE
                              </span>
                            )}
                          </div>

                          {/* Interactive Circle Node */}
                          <div className="relative flex items-center justify-center h-8 w-8">
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
                                (() => {
                                  if (isSelected)
                                    return "bg-neu-accent border-neu-accent scale-110 shadow-lg";
                                  if (isPast)
                                    return "bg-neu-bg border-neu-accent";
                                  return "bg-neu-bg border-gray-400 dark:border-zinc-700 group-hover:border-neu-text";
                                })(),
                              )}
                            >
                              <div
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  (() => {
                                    if (isSelected) return "bg-neu-bg";
                                    if (isPast)
                                      return "bg-gradient-to-r from-pink-500 to-cyan-500";
                                    return "bg-transparent";
                                  })(),
                                )}
                              />
                            </div>
                          </div>

                          {/* Tech Badge name below */}
                          <span
                            className={cn(
                              "absolute top-[100%] mt-3 text-xs font-bold tracking-tight text-center transition-colors duration-300 w-full",
                              isSelected
                                ? "text-neu-text"
                                : "text-neu-text-muted group-hover:text-neu-text",
                            )}
                          >
                            {item.tech}
                          </span>
                        </motion.button>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Mobile simplified timeline view */}
              <div className="flex md:hidden flex-wrap gap-2 justify-center mb-6">
                {(activeRoadmap || []).map((item: any, index: number) => {
                  const isSelected = selectedRoadmapIndex! === index; //NOSONAR
                  const isDone =
                    item.status?.toLowerCase() === "completed" ||
                    item.status?.toLowerCase() === "done" ||
                    item.status?.toLowerCase() === "success";
                  return (
                    <button
                      key={index as number}
                      onClick={() => handleSelectNode(index)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border cursor-pointer",
                        isSelected
                          ? "glass-card-inset text-neu-accent border-neu-accent/30"
                          : "glass-card border-transparent text-neu-text-muted hover:text-neu-text",
                      )}
                    >
                      <span className="opacity-60">{item.quarter}:</span>
                      <span>{item.tech}</span>
                      {isDone && (
                        <span className="ml-1 text-[9px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold leading-none">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Details panel for the selected roadmap item */}
              <AnimatePresence mode="wait">
                {activeRoadmap.length > 0 &&
                  activeRoadmap[selectedRoadmapIndex!] && (
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
                              <TrendingUp
                                size={14}
                                className="text-neu-accent"
                              />{" "}
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
                                <li
                                  key={i as number}
                                  className="flex items-center gap-2"
                                >
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
                            {(
                              activeRoadmap[selectedRoadmapIndex!].projects ||
                              []
                            ).map((proj: any, i: number) => (
                              <li
                                key={i as number}
                                className="flex items-start gap-2.5"
                              >
                                <span className="mt-0.5 text-neu-accent">
                                  ✦
                                </span>
                                <span className="text-neu-text">{proj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {/* Right Now Dynamic Section */}
                      {activeRoadmap[selectedRoadmapIndex!]?.currentFocuses &&
                        activeRoadmap[selectedRoadmapIndex!]?.currentFocuses
                          .length > 0 && (
                          <div className="lg:col-span-12 mt-4 pt-8 border-t border-gray-300/10 dark:border-white/10">
                            <div className="flex items-center gap-2 text-neu-accent mb-6">
                              <Layers size={16} />
                              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                                Current Focus (Right Now)
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {activeRoadmap[
                                selectedRoadmapIndex!
                              ]?.currentFocuses.map(
                                (focus: any, idx: number) => {
                                  const IconCmp =
                                    (LucideIcons as any)[focus.icon] ||
                                    LucideIcons.Briefcase;
                                  return (
                                    <div
                                      key={idx}
                                      className="p-5 sm:p-6 rounded-2xl glass-card group hover:shadow-neu-sm transition-all flex flex-col justify-between border border-white/5 bg-white/5 dark:bg-black/20"
                                    >
                                      <div>
                                        <div className="flex items-center gap-3 mb-3">
                                          <div className="p-2 glass-card-inset rounded-lg text-neu-accent">
                                            <IconCmp size={18} />
                                          </div>
                                          <h3 className="text-base font-bold text-neu-text">
                                            {focus.title}
                                          </h3>
                                        </div>
                                        <p className="text-neu-text-muted text-sm font-medium mb-4 leading-relaxed line-clamp-3">
                                          {focus.description}
                                        </p>
                                      </div>
                                      {focus.link && (
                                        <a
                                          href={focus.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1.5 text-xs font-bold text-neu-accent hover:underline mt-auto"
                                        >
                                          {focus.linkText || "View Detail"}{" "}
                                          <ArrowRight size={14} />
                                        </a>
                                      )}
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        )}
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>


        {/* Animated divider with a section-specific icon and quote tooltip */}
        <AnimatedDivider
          icon={BriefcaseBusiness}
          quote="Every system I've built carries the weight of the
                problems it was meant to solve."
        />
      </section>
    </>
  );
}
