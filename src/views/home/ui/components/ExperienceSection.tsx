
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from "@/shared/lib/utils";
import { Briefcase, GitCommit, Code, Activity, ChevronUp, ChevronDown, Sparkles, BarChart2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";

export function ExperienceSection({ activeWork, gh, isLoading, isDark, legendLevels }: any) {
    const [chartType, setChartType] = useState<"temporal" | "repository">("temporal");
    const { timelineData = [], repoData = [], languageData = [], heatmapStats = { total: 0, maxStreak: 0, avgIntensity: 0 }, monthsData = [] } = gh || {};
    
    
  React.useEffect(() => {
    if (heatmapRef.current) {
      heatmapRef.current.scrollLeft = heatmapRef.current.scrollWidth;
    }
  }, [gh]);

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { 
      const timer = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(timer);
    }, []);
    
    const [activeTooltipDate, setActiveTooltipDate] = React.useState<string | null>(null);
    const heatmapRef = React.useRef<HTMLDivElement>(null);
    
    const handleTouchStart = React.useCallback((dayDate: string) => {
        setActiveTooltipDate((prev) => (prev === dayDate ? null : dayDate));
    }, []);
    const handleTouchEnd = React.useCallback(() => {
        // Optional logic
    }, []);
    const handleTouchMove = React.useCallback(() => {
        setActiveTooltipDate(null);
    }, []);
    
    const [selectedLevelFilter, setSelectedLevelFilter] = React.useState<number | null>(null);


    const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
    const [hoveredLang, setHoveredLang] = useState<string | null>(null);
    const [activeExpIdx, setActiveExpIdx] = useState<number | null>(null);

    return (
      <section id="experience" className="scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="w-full space-y-8">
            <div className="mb-10">
              <div className="flex items-center gap-2 text-neu-accent mb-1">
                <Briefcase size={18} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
                  Journey & Chronology
                </span>
              </div>
              <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
                Experience
              </h2>
              <p className="text-xs text-neu-text-muted font-mono mt-1">
                ✦ Chronological timeline of professional roles, core
                contributions, and enterprise projects.
              </p>
            </div>

            <div className="p-5 sm:p-8 rounded-3xl glass-card-inset space-y-6 max-w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-300/30 dark:border-gray-700/30 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-neu-accent mb-1">
                    <Activity size={18} className="animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">
                      Metrics & Analytics
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-neu-text tracking-tight">
                    Git Activity & Contribution Frequency
                  </h3>
                </div>
                <div className="flex bg-neu-bg p-1.5 rounded-2xl shadow-neu-inset gap-1">
                  <button
                    onClick={() => setChartType("temporal")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                      chartType === "temporal"
                        ? "bg-neu-accent text-white shadow-neu-sm"
                        : "text-neu-text-muted hover:text-neu-accent",
                    )}
                  >
                    <GitCommit size={14} /> Commit Timeline
                  </button>
                  <button
                    onClick={() => setChartType("repository")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                      chartType === "repository"
                        ? "bg-neu-accent text-white shadow-neu-sm"
                        : "text-neu-text-muted hover:text-neu-accent",
                    )}
                  >
                    <BarChart2 size={14} /> Repos
                  </button>
                </div>
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                {isLoading ? (
                  <div className="w-full h-full flex flex-col justify-between p-4 animate-pulse">
                    {/* loading skeleton */}
                  </div>
                ) : !mounted ? (
                  <div className="text-neu-text-muted font-mono text-xs">
                    Initializing chart engine...
                  </div>
                ) : chartType === "temporal" ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={1}
                    minHeight={1}
                  >
                    <AreaChart
                      data={timelineData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorCommits"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={isDark ? "#4ade80" : "#4f46e5"}
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor={isDark ? "#4ade80" : "#4f46e5"}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDark ? "#2a2b2f" : "#cbd5e1"}
                        opacity={0.3}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        stroke={isDark ? "#b2e4bc" : "#4b5563"}
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke={isDark ? "#b2e4bc" : "#4b5563"}
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#1a1b1e" : "#e0e5ec",
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: isDark
                            ? "0 10px 25px rgba(0,0,0,0.5)"
                            : "4px 4px 10px rgba(163,177,198,0.5)",
                          color: isDark ? "#27ec6f" : "#1a1a1a",
                          fontFamily: "monospace",
                          fontSize: "12px",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "11px",
                          fontFamily: "monospace",
                          paddingTop: "10px",
                        }}
                      />
                      <Area
                        name="Commits"
                        type="monotone"
                        dataKey="commits"
                        stroke={isDark ? "#4ade80" : "#4f46e5"}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorCommits)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={1}
                    minHeight={1}
                  >
                    <BarChart
                      data={repoData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDark ? "#2a2b2f" : "#cbd5e1"}
                        opacity={0.3}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke={isDark ? "#b2e4bc" : "#4b5563"}
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => v.split(" ")[0]}
                      />
                      <YAxis
                        stroke={isDark ? "#b2e4bc" : "#4b5563"}
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#1a1b1e" : "#e0e5ec",
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: isDark
                            ? "0 10px 25px rgba(0,0,0,0.5)"
                            : "4px 4px 10px rgba(163,177,198,0.5)",
                          color: isDark ? "#27ec6f" : "#1a1a1a",
                          fontFamily: "monospace",
                          fontSize: "12px",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "11px",
                          fontFamily: "monospace",
                          paddingTop: "10px",
                        }}
                      />
                      <Bar
                        name="Total Commits"
                        dataKey="commits"
                        fill={isDark ? "#4ade80" : "#4f46e5"}
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        name="Pull Requests"
                        dataKey="pullRequests"
                        fill={isDark ? "#22c55e" : "#3b82f6"}
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Heatmap */}
              <div className="pt-6 border-t border-gray-300/30 dark:border-gray-700/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider flex items-center gap-2 pl-1 sm:pl-0">
                      <Code size={14} /> Annual Coding Contribution Heatmap
                    </h4>
                    <p className="text-xs font-mono text-neu-text-muted mt-1 pl-1 sm:pl-0">
                      Consistent development activity logged over the past 365
                      days
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-mono">
                    <div className="px-3 py-1 rounded-lg glass-card-sm">
                      <span className="text-neu-text-muted">Total: </span>
                      <span className="text-neu-accent font-bold">
                        {heatmapStats.total.toLocaleString()} contributions
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-lg glass-card-sm">
                      <span className="text-neu-text-muted">Max Streak: </span>
                      <span className="text-green-500 font-bold">
                        {heatmapStats.maxStreak} days
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-lg glass-card-sm">
                      <span className="text-neu-text-muted">Active Days: </span>
                      <span className="text-neu-accent font-bold">
                        {heatmapStats.avgIntensity}%
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  ref={heatmapRef}
                  className="w-full relative p-3 sm:p-5 rounded-2xl glass-card-inset overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  <div className="min-w-[740px] flex flex-col pt-6">
                    <div className="flex w-full">
                      <div className="relative text-xs font-mono text-neu-text-muted w-8 pr-2 select-none flex-shrink-0 h-36 sm:h-36">
                        <span className="absolute top-14 sm:top-14 left-3 leading-[12px] sm:leading-[10px]">
                          Mon
                        </span>
                        <span className="absolute top-20 sm:top-20 left-3 leading-[12px] sm:leading-[10px]">
                          Wed
                        </span>
                        <span className="absolute top-28 sm:top-28 left-3 leading-[12px] sm:leading-[10px]">
                          Fri
                        </span>
                      </div>
                      <div className="flex-1 flex gap-1 justify-between items-stretch">
                        {(monthsData || []).map(
                          (monthGroup: any, mIdx: number) => (
                            <div key={mIdx} className="flex shrink-0 gap-1">
                              <div className="flex gap-1 shrink-0">
                                {(monthGroup.weeks || []).map(
                                  (week: any[], wIdxInMonth: number) => {
                                    const isColInHoveredMonth =
                                      hoveredMonth !== null &&
                                      week.some(
                                        (day) => day?.month === hoveredMonth,
                                      );
                                    return (
                                      <div
                                        key={wIdxInMonth}
                                        className={cn(
                                          "flex flex-col gap-1 shrink-0 relative pt-10 px-px rounded-md transition-all duration-300",
                                          isColInHoveredMonth
                                            ? "bg-neu-accent/[0.04] dark:bg-neu-accent/[0.08] ring-1 ring-neu-accent/15 scale-[1.02] z-10"
                                            : hoveredMonth !== null
                                              ? "opacity-30"
                                              : "",
                                        )}
                                      >
                                        {wIdxInMonth === 0 && (
                                          <span
                                            onMouseEnter={() =>
                                              setHoveredMonth(
                                                monthGroup.monthNum,
                                              )
                                            }
                                            onMouseLeave={() =>
                                              setHoveredMonth(null)
                                            }
                                            className={cn(
                                              "absolute top-0 left-0 text-xs sm:text-xs font-mono text-neu-text-muted whitespace-nowrap cursor-pointer transition-all duration-200 hover:text-neu-accent select-none",
                                              hoveredMonth ===
                                                monthGroup.monthNum
                                                ? "text-neu-accent font-bold"
                                                : "",
                                            )}
                                          >
                                            {monthGroup.label}
                                          </span>
                                        )}
                                        {(week || []).map(
                                          (day: any, dIdx: number) => {
                                            const lc = isDark
                                              ? [
                                                  "bg-zinc-800/60 hover:bg-zinc-700",
                                                  "bg-emerald-950 hover:bg-emerald-900",
                                                  "bg-emerald-800 hover:bg-emerald-700",
                                                  "bg-emerald-500 hover:bg-emerald-400",
                                                  "bg-emerald-400 hover:bg-emerald-300",
                                                ]
                                              : [
                                                  "bg-gray-200 hover:bg-gray-300",
                                                  "bg-indigo-100 hover:bg-indigo-200",
                                                  "bg-indigo-300 hover:bg-indigo-400",
                                                  "bg-indigo-500 hover:bg-indigo-600",
                                                  "bg-indigo-600 hover:bg-indigo-700",
                                                ];
                                            const isOut =
                                              selectedLevelFilter !== null &&
                                              day?.level !==
                                                selectedLevelFilter;
                                            const isIn =
                                              selectedLevelFilter !== null &&
                                              day?.level ===
                                                selectedLevelFilter;
                                            return day === null ? (
                                              <div
                                                key={dIdx}
                                                className="w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-[2px] opacity-0 pointer-events-none"
                                              />
                                            ) : (
                                              <div
                                                key={dIdx}
                                                onTouchStart={() =>
                                                  handleTouchStart(day.date)
                                                }
                                                onTouchEnd={handleTouchEnd}
                                                onTouchCancel={handleTouchEnd}
                                                onTouchMove={handleTouchMove}
                                                className={cn(
                                                  "w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-[2px] transition-all duration-150 cursor-pointer relative group/cell",
                                                  lc[day.level],
                                                  isOut &&
                                                    "opacity-15 scale-90",
                                                  (isIn ||
                                                    activeTooltipDate ===
                                                      day.date) &&
                                                    "ring-2 ring-neu-accent scale-110 z-10",
                                                )}
                                              >
                                                <div
                                                  className={cn(
                                                    "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-black/95 dark:bg-neutral-900 text-white text-xs font-mono whitespace-nowrap transition-all duration-150 z-50 shadow-lg border border-white/10 pointer-events-none",
                                                    activeTooltipDate ===
                                                      day.date
                                                      ? "opacity-100 translate-y-0 scale-100"
                                                      : "opacity-0 translate-y-1 scale-95 group-hover/cell:opacity-100 group-hover/cell:translate-y-0 group-hover/cell:scale-100 group-hover/cell:delay-200",
                                                  )}
                                                >
                                                  <span className="text-neu-accent font-bold">
                                                    {day.count}{" "}
                                                    {day.count === 1
                                                      ? "contribution"
                                                      : "contributions"}
                                                  </span>
                                                  <br />
                                                  <span className="text-gray-400">
                                                    {day.date}
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          },
                                        )}
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mt-6 pt-4 border-t border-gray-300/10 dark:border-gray-700/10 select-none">
                  <div className="flex flex-wrap items-center gap-1.5 lg:ml-auto text-xs font-mono text-neu-text-muted bg-neu-bg/50 shadow-neu-inset p-2 rounded-xl border border-white/5 w-fit">
                    {selectedLevelFilter !== null ? (
                      <button
                        onClick={() => setSelectedLevelFilter(null)}
                        className="text-xs font-mono text-neu-accent hover:underline cursor-pointer flex items-center gap-1 active:scale-95 transition-transform mr-2"
                      >
                        ✕ Clear Filter
                      </button>
                    ) : (
                      <span className="opacity-75 mr-1">Intensity:</span>
                    )}
                    <span>Less</span>
                    {legendLevels.map((lvl: any) => {
                      const active = selectedLevelFilter === lvl.level;
                      return (
                        <button
                          key={lvl.level}
                          onClick={() =>
                            setSelectedLevelFilter(
                              selectedLevelFilter === lvl.level
                                ? null
                                : lvl.level,
                            )
                          }
                          className={cn(
                            "w-4 h-4 rounded-[4px] cursor-pointer transition-all duration-200 relative group/legend flex items-center justify-center border border-transparent",
                            isDark ? lvl.darkBg : lvl.lightBg,
                            active
                              ? "ring-2 ring-neu-accent scale-125 shadow-md border-white/10"
                              : "hover:scale-115 hover:ring-1 hover:ring-neu-text-muted",
                          )}
                          title={lvl.label}
                        />
                      );
                    })}
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>

            {languageData && languageData.length > 0 && (
              <motion.div
                className="mt-8 rounded-3xl glass-card-inset p-4 sm:p-6 md:p-8 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6 border-b border-gray-300/20 dark:border-zinc-800/20 pb-4">
                  <div className="flex items-center gap-2">
                    <Code size={16} className="text-neu-accent" />
                    <h3 className="text-lg font-display font-bold text-neu-text tracking-tight">
                      Most Used Languages
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-neu-text-muted bg-neu-bg/50 px-2 py-1 rounded-md">
                    Live from GitHub
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-6">
                  <div className="w-full md:w-1/3 flex justify-center items-center h-60 relative">
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
                        {languageData.map((entry: any, index: number) => {
                          const isHovered = hoveredLang === entry.name;
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              className="cursor-pointer focus:outline-none"
                              style={{
                                outline: "none",
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                opacity:
                                  hoveredLang !== null && !isHovered ? 0.3 : 1,
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
                    {languageData.map((lang: any) => (
                      <motion.div
                        key={lang.name}
                        whileHover={{ y: -2 }}
                        onMouseEnter={() => setHoveredLang(lang.name)}
                        onMouseLeave={() => setHoveredLang(null)}
                        className={cn(
                          "relative flex flex-col gap-1 p-3 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer group",
                          hoveredLang === lang.name
                            ? "border-neu-accent bg-neu-accent/5 scale-[1.02]"
                            : "bg-neu-bg border-gray-200/50 dark:border-zinc-800/30",
                          hoveredLang !== null && hoveredLang !== lang.name
                            ? "opacity-40"
                            : "opacity-100",
                        )}
                      >
                        {lang.percentage >= languageData[0].percentage && (
                          <div className="absolute -top-2 -right-2 bg-neu-accent text-white font-mono text-xs font-bold px-1.5 py-0.5 rounded shadow-sm z-10 flex items-center gap-1">
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
                        <span className="text-xs font-mono text-neu-text-muted">
                          {lang.percentage.toFixed(1)}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              className="mt-10 rounded-3xl glass-card-inset p-4 sm:p-6 md:p-8 space-y-1 relative"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 pb-4 border-b border-gray-300/20 dark:border-zinc-800/20 text-xs font-mono font-bold tracking-[0.2em] text-neu-text-muted uppercase">
                <div className="col-span-3">Year / Duration</div>
                <div className="col-span-3">Company</div>
                <div className="col-span-4">Role & Tech Stack</div>
                <div className="col-span-2 text-right">
                  Key Impact Highlight
                </div>
              </div>
              {activeWork.map((job: any, idx: number) => {
                const isActive = activeExpIdx === idx;
                const isPresent = (job.years || "")
                  .toLowerCase()
                  .includes("present");
                return (
                  <div
                    key={`${job.company}-${job.role}`}
                    className="block"
                    onMouseEnter={() => setActiveExpIdx(idx)}
                  >
                    <div
                      onClick={() => setActiveExpIdx(isActive ? null : idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveExpIdx(isActive ? null : idx);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className={cn(
                        "grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 px-6 rounded-2xl cursor-pointer transition-all duration-300 group relative border-b border-gray-300/10 dark:border-zinc-800/10 last:border-0",
                        isActive
                          ? "bg-white/80 dark:bg-zinc-800/30 shadow-neu border-transparent"
                          : "hover:bg-white/40 dark:hover:bg-zinc-800/10",
                        isPresent && !isActive
                          ? "bg-neu-accent/5 border border-neu-accent/20"
                          : "",
                      )}
                    >
                      {isPresent && (
                        <div className="absolute -top-2 -left-2 bg-neu-accent text-white font-mono text-xs font-bold px-2 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />{" "}
                          CURRENT
                        </div>
                      )}
                      <div className="col-span-3 flex flex-col justify-center text-left">
                        <span
                          className={cn(
                            "font-mono font-bold text-sm sm:text-base group-hover:text-neu-accent transition-colors",
                            isPresent ? "text-neu-accent" : "text-neu-text",
                          )}
                        >
                          {job.years}
                        </span>
                        <span className="text-xs font-mono text-neu-text-muted mt-0.5 uppercase tracking-wider">
                          {job.duration}
                        </span>
                      </div>
                      <div className="col-span-3 flex flex-col justify-center text-left">
                        <span className="font-display font-extrabold text-base sm:text-lg text-neu-text tracking-tight uppercase">
                          {job.company}
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center text-left">
                        <span className="font-mono text-xs sm:text-sm text-neu-text-muted">
                          <strong className="text-neu-text font-bold font-sans text-sm">
                            {job.role}
                          </strong>
                          {" | "}
                          <span className="text-neu-accent font-medium">
                            {job.stack}
                          </span>
                        </span>
                      </div>
                      <div className="col-span-2 text-right hidden md:block">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-neu-accent/10 text-neu-accent border border-neu-accent/15 tracking-tight">
                          ✦ {job.teaser}
                        </span>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 md:hidden">
                        {isActive ? (
                          <ChevronUp size={16} className="text-neu-accent" />
                        ) : (
                          <ChevronDown
                            size={16}
                            className="text-neu-text-muted"
                          />
                        )}
                      </div>
                    </div>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 bg-white/20 dark:bg-zinc-800/10 rounded-b-2xl border-t border-gray-300/10 dark:border-zinc-800/10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">
                              <div className="lg:col-span-4 p-4 rounded-xl bg-neu-bg border border-white/10 dark:border-zinc-800/50 shadow-neu-inset flex flex-col justify-center">
                                <span className="text-xs font-mono font-bold uppercase tracking-widest text-neu-accent mb-1.5 flex items-center gap-1">
                                  <Sparkles
                                    size={12}
                                    className="text-neu-accent animate-pulse"
                                  />{" "}
                                  Business Impact
                                </span>
                                <p className="text-xs sm:text-sm font-sans font-extrabold text-neu-text leading-snug">
                                  {job.fullImpact}
                                </p>
                              </div>
                              <div className="lg:col-span-8">
                                <span className="text-xs font-mono font-bold uppercase tracking-widest text-neu-text-muted mb-2 block">
                                  Core Contributions & Technical Delivery
                                </span>
                                <ul className="space-y-2.5">
                                  {(job.bullets || []).map(
                                    (bullet: string, bIdx: number) => (
                                      <li
                                        key={bIdx}
                                        className="flex items-start gap-2.5 text-xs sm:text-sm text-neu-text-muted leading-relaxed font-light"
                                      >
                                        <span className="text-neu-accent font-bold mt-1 shrink-0">
                                          ✦
                                        </span>
                                        <span>{bullet}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>
    );
}
