/* eslint-disable sonarjs/cognitive-complexity, sonarjs/no-nested-functions */
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  Quote,
  Activity,
  Code2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageCircle,
  MessageSquare,
  GitCommit,
  BarChart2,
} from "lucide-react";
import { AnimatedDivider } from "@/shared/ui/AnimatedDivider";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { cn, secureMathRandom } from "@/shared/lib/utils";
import { Testimonial } from "@/shared/types";

import { usePortfolioStore } from "@/shared/store/portfolioStore";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { legendLevels } from "@/shared/lib/helpers";

interface ExperienceSectionProps {
  isDark: boolean;
}

export default function ExperienceSection({
  isDark,
}: Readonly<ExperienceSectionProps>) {
  const { 
    dynamicWork: activeWork,
    testimonialsList,
    setSelectedTestimonial,
    contributionData,
    timelineData,
    repoData,
    isLoading
  } = usePortfolioStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedWorkIndex, setSelectedWorkIndex] = useState<number | null>(null);
  const [windowStartIndex, setWindowStartIndex] = useState<number>(0);

  const timelineWork = useMemo(() => {
    return [...activeWork].reverse();
  }, [activeWork]);

  useEffect(() => {
    if (timelineWork.length > 0 && selectedWorkIndex === null) {
      setSelectedWorkIndex(timelineWork.length - 1);
      setWindowStartIndex(Math.max(0, timelineWork.length - MAX_VISIBLE));
    }
  }, [timelineWork, selectedWorkIndex]);
  const MAX_VISIBLE = 4;

  const handleSelectWorkNode = (index: number) => {
    setSelectedWorkIndex(index);
    if (
      index === windowStartIndex + MAX_VISIBLE - 1 &&
      index < activeWork.length - 1
    ) {
      setWindowStartIndex(windowStartIndex + 1);
    }
    if (index === windowStartIndex && index > 0) {
      setWindowStartIndex(windowStartIndex - 1);
    }
  };
  const [chartType, setChartType] = useState<"temporal" | "heatmap" | "repository">("temporal");
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  // State removed
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | null>(null);
  const [activeTooltipDate, setActiveTooltipDate] = useState<string | null>(null);
  
  const heatmapRef = useRef<HTMLDivElement>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const autoScrollRaf = useRef<number | null>(null);
  const isHovered = useRef(false);
  const isAnimatingScroll = useRef(false);

  // Setup infinite loop scrolling logic
  useEffect(() => {
    if (testimonialsRef.current && (testimonialsList?.length || 0) > 0) {
      setTimeout(() => {
        if (testimonialsRef.current) {
          testimonialsRef.current.scrollLeft = testimonialsRef.current.scrollWidth / 3;
        }
      }, 300);
    }
  }, [testimonialsList]);

  // Auto-scroll loop
  useEffect(() => {
    const el = testimonialsRef.current;
    if (!el) return;

    const loop = () => {
      if (!isDragging.current && !isHovered.current && !isAnimatingScroll.current) {
        el.scrollLeft += 0.5; // Auto scroll speed
        
        // Infinite wrap logic
        const third = el.scrollWidth / 3;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          el.scrollLeft -= third;
        }
      }
      autoScrollRaf.current = requestAnimationFrame(loop);
    };

    autoScrollRaf.current = requestAnimationFrame(loop);
    return () => {
      if (autoScrollRaf.current) cancelAnimationFrame(autoScrollRaf.current);
    };
  }, []);

  const handleTestimonialsScroll = () => {
    const el = testimonialsRef.current;
    if (!el || isDragging.current) return;
    const third = el.scrollWidth / 3;
    if (el.scrollLeft < 20) {
      el.scrollLeft += third;
    } else if (el.scrollLeft > el.scrollWidth - el.clientWidth - 20) {
      el.scrollLeft -= third;
    }
  };

  const scrollTestimonials = (dir: "left" | "right") => {
    if (testimonialsRef.current) {
      isAnimatingScroll.current = true;
      const scrollAmount = window.innerWidth > 640 ? 440 + 40 : window.innerWidth * 0.85 + 24; // card width + margin
      testimonialsRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
      setTimeout(() => {
        isAnimatingScroll.current = false;
      }, 600); // Pause auto-scroll while smooth scrolling completes
    }
  };

  const heatmapData = useMemo(() => {
    if (!timelineData || timelineData.length === 0) return [];
    
    // Simulate 52 weeks x 7 days based on monthly timeline data
    const totalCommits = timelineData.reduce((sum: number, item: any) => sum + (item.commits || 0), 0);
    const weeks = [];
    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const monthIndex = Math.min(timelineData.length - 1, Math.floor(w / 4.33));
        const monthData = timelineData[monthIndex];
        
        const monthWeight = monthData && totalCommits > 0 ? (monthData.commits / totalCommits) * 12 : 1;
        let intensity = 0;
        const rand = secureMathRandom();
        
        if (monthData && monthData.commits > 0) {
           if (rand < 0.2 * monthWeight) intensity = 4;
           else if (rand < 0.4 * monthWeight) intensity = 3;
           else if (rand < 0.7 * monthWeight) intensity = 2;
           else if (rand < 0.9 * monthWeight) intensity = 1;
        }
        
        days.push({
          date: `Day ${w * 7 + d + 1}`,
          intensity,
          commits: intensity === 0 ? 0 : Math.floor(secureMathRandom() * 5 * intensity) + 1,
          month: monthData?.month || ''
        });
      }
      weeks.push(days);
    }
    return weeks;
  }, [timelineData]);

  // Drag-to-scroll handlers
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    if (!testimonialsRef.current) return;
    testimonialsRef.current.style.cursor = 'grabbing';
    
    if ('pageX' in e) {
      startX.current = e.pageX - testimonialsRef.current.offsetLeft;
    } else {
      startX.current = e.touches[0].pageX - testimonialsRef.current.offsetLeft;
    }
    startScrollLeft.current = testimonialsRef.current.scrollLeft;
  };

  const onDragEnd = () => {
    isDragging.current = false;
    if (testimonialsRef.current) {
      testimonialsRef.current.style.cursor = 'grab';
    }
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !testimonialsRef.current) return;
    e.preventDefault();
    let currentX;
    if ('pageX' in e) {
      currentX = e.pageX - testimonialsRef.current.offsetLeft;
    } else {
      currentX = e.touches[0].pageX - testimonialsRef.current.offsetLeft;
    }
    const walk = (currentX - startX.current) * 1.5; // Drag speed multiplier
    testimonialsRef.current.scrollLeft = startScrollLeft.current - walk;
    
    // Check boundaries manually during drag to loop seamlessly
    const el = testimonialsRef.current;
    const third = el.scrollWidth / 3;
    if (el.scrollLeft < 10) {
      el.scrollLeft += third;
      startScrollLeft.current += third;
    } else if (el.scrollLeft > el.scrollWidth - el.clientWidth - 10) {
      el.scrollLeft -= third;
      startScrollLeft.current -= third;
    }
  };

  const handleTouchStart = useCallback((dayDate: string) => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

    touchTimeoutRef.current = setTimeout(() => {
      setActiveTooltipDate(dayDate);
    }, 200);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      setActiveTooltipDate(null);
    }, 1500);
  }, []);

  const handleTouchMove = useCallback(() => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
  }, []);

  const weeks = contributionData;

  const heatmapStats = useMemo(() => {
    let total = 0;
    let currentStreak = 0;
    let max = 0;
    let activeDays = 0;
    let totalDays = 0;

    weeks.forEach((week) => {
      if (!Array.isArray(week)) return;
      week.forEach((day) => {
        if (!day) return;
        totalDays++;
        if (day.count > 0) {
          total += day.count;
          currentStreak++;
          activeDays++;
        } else {
          if (currentStreak > max) max = currentStreak;
          currentStreak = 0;
        }
      });
    });
    if (currentStreak > max) max = currentStreak;

    const intensity = totalDays > 0 ? (activeDays / totalDays) * 100 : 0;

    return {
      total,
      maxStreak: max,
      avgIntensity: intensity.toFixed(1),
    };
  }, [weeks]);

  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string; monthNum: number }[] = [];
    let prevMonth = -1;
    weeks.forEach((week, index) => {
      if (!Array.isArray(week)) return;
      const firstValidDay = week.find((d) => d !== null);
      if (firstValidDay) {
        const currentMonth = firstValidDay.month;
        if (currentMonth !== prevMonth) {
          const monthName = new Date(2026, currentMonth, 1).toLocaleDateString(
            "en-US",
            { month: "short" },
          );
          labels.push({ index, label: monthName, monthNum: currentMonth });
          prevMonth = currentMonth;
        }
      }
    });
    return labels;
  }, [weeks]);

  const monthsData = useMemo(() => {
    const months: { label: string; monthNum: number; weeks: typeof weeks }[] = [];
    let currentMonthWeeks: typeof weeks = [];
    let currentMonthLabel = "";
    let currentMonthNum = -1;

    weeks.forEach((week, index) => {
      const monthLabel = monthLabels.find((lbl: any) => lbl.index === index);
      if (monthLabel) {
        if (currentMonthWeeks.length > 0) {
          months.push({
            label: currentMonthLabel,
            monthNum: currentMonthNum,
            weeks: currentMonthWeeks,
          });
        }
        currentMonthWeeks = [week];
        currentMonthLabel = monthLabel.label;
        currentMonthNum = monthLabel.monthNum;
      } else {
        currentMonthWeeks.push(week);
      }
    });
    if (currentMonthWeeks.length > 0) {
      months.push({
        label: currentMonthLabel,
        monthNum: currentMonthNum,
        weeks: currentMonthWeeks,
      });
    }
    return months;
  }, [weeks, monthLabels]);
  const customTooltipStyle = {
    backgroundColor: isDark ? "#1a1b1e" : "#e0e5ec",
    border: "none",
    borderRadius: "16px",
    boxShadow: isDark
      ? "0 10px 25px rgba(0,0,0,0.5)"
      : "4px 4px 10px rgba(163,177,198,0.5)",
    color: isDark ? "#27ec6f" : "#1a1a1a",
    fontFamily: "monospace",
    fontSize: "12px",
  };

  const customLegendStyle = {
    fontSize: "11px",
    fontFamily: "monospace",
    paddingTop: "10px",
  };

  return (
    <>
      {/* Experience Section */}
      <section id="experience" className="scroll-mt-20">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
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

            {/* Git Activity & Contribution Dashboard */}
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
                    {chartType === "temporal" && "Git Activity & Contribution Frequency"}
                    {chartType === "heatmap" && "Annual Coding Contribution Heatmap"}
                    {chartType === "repository" && "Top Repositories by Activity"}
                  </h3>
                </div>

                {/* Chart Toggle */}
                <div className="flex bg-neu-bg p-1.5 rounded-2xl shadow-neu-inset gap-1">
                  <button
                    onClick={() => setChartType("temporal")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setChartType("temporal");
                    }}
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
                    onClick={() => setChartType("heatmap")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setChartType("heatmap");
                    }}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                      chartType === "heatmap"
                        ? "bg-neu-accent text-white shadow-neu-sm"
                        : "text-neu-text-muted hover:text-neu-accent",
                    )}
                  >
                    <Activity size={14} /> Heatmap
                  </button>
                  <button
                    onClick={() => setChartType("repository")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setChartType("repository");
                    }}
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

              {/* Chart Display Area */}
              <div className="h-72 w-full flex items-center justify-center">
                {(() => {
                  if (isLoading) {
                    return (
                      <div className="w-full h-full flex flex-col justify-between p-4 animate-pulse">
                        <div className="flex justify-between items-center mb-2">
                          <div className="h-3 w-24 bg-gray-300/30 dark:bg-zinc-700/40 rounded"></div>
                          <div className="h-3 w-16 bg-gray-300/30 dark:bg-zinc-700/40 rounded"></div>
                        </div>
                        <div className="flex-1 w-full border-b border-l border-gray-300/30 dark:border-zinc-700/30 relative flex items-end">
                          <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
                            <div className="w-full h-[1px] bg-gray-300/10 dark:bg-zinc-700/10"></div>
                            <div className="w-full h-[1px] bg-gray-300/10 dark:bg-zinc-700/10"></div>
                            <div className="w-full h-[1px] bg-gray-300/10 dark:bg-zinc-700/10"></div>
                            <div className="w-full h-[1px] bg-gray-300/10 dark:bg-zinc-700/10"></div>
                          </div>
                          {chartType === "temporal" ? (
                            <svg
                              className="absolute inset-0 w-full h-full opacity-20 text-neu-accent"
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                            >
                              <path
                                d="M0,80 Q20,40 40,60 T80,20 T100,50 L100,100 L0,100 Z"
                                fill="currentColor"
                              />
                            </svg>
                          ) : (
                            <div className="absolute inset-0 flex items-end justify-around px-4 pt-10 gap-2">
                              <div className="w-8 bg-neu-accent/20 rounded-t h-[40%]"></div>
                              <div className="w-8 bg-neu-accent/20 rounded-t h-[75%]"></div>
                              <div className="w-8 bg-neu-accent/20 rounded-t h-[55%]"></div>
                              <div className="w-8 bg-neu-accent/20 rounded-t h-[90%]"></div>
                              <div className="w-8 bg-neu-accent/20 rounded-t h-[30%]"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between mt-2 px-6">
                          <div className="h-3 w-10 bg-gray-300/20 dark:bg-zinc-700/30 rounded"></div>
                          <div className="h-3 w-10 bg-gray-300/20 dark:bg-zinc-700/30 rounded"></div>
                          <div className="h-3 w-10 bg-gray-300/20 dark:bg-zinc-700/30 rounded"></div>
                          <div className="h-3 w-10 bg-gray-300/20 dark:bg-zinc-700/30 rounded"></div>
                        </div>
                      </div>
                    );
                  }
                  if (!mounted) {
                    return (
                      <div className="text-neu-text-muted font-mono text-xs">
                        Initializing chart engine...
                      </div>
                    );
                  }
                  if (chartType === "temporal") {
                    return (
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
                          <Tooltip contentStyle={customTooltipStyle} />
                          <Legend
                            iconType="circle"
                            wrapperStyle={customLegendStyle}
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
                    );
                  }
                  
                  if (chartType === "heatmap") {
                    return (
                      <div className="w-full h-full flex flex-col pt-2">
                        {/* Heatmap Stats */}
                        <div className="flex flex-wrap gap-4 text-xs font-mono mb-4 justify-end">
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

                        {/* Heatmap Grid Wrapper */}
                        <div
                          ref={heatmapRef as any}
                          className="w-full relative rounded-2xl overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        >
                          <div className="min-w-[740px] flex flex-col">
                    <div className="flex w-full">
                      {/* Weekday labels */}
                      <div className="relative text-[9px] font-mono text-neu-text-muted w-8 pr-2 select-none flex-shrink-0 h-[146px] sm:h-[136px]">
                        <span className="absolute top-[55px] sm:top-[53px] left-3 leading-[12px] sm:leading-[10px]">
                          Mon
                        </span>
                        <span className="absolute top-[85px] sm:top-[79px] left-3 leading-[12px] sm:leading-[10px]">
                          Wed
                        </span>
                        <span className="absolute top-[115px] sm:top-[105px] left-3 leading-[12px] sm:leading-[10px]">
                          Fri
                        </span>
                      </div>

                      {/* Columns of weeks grouped by month */}
                      <div className="flex-1 flex gap-[3px] justify-between items-stretch">
                        {(monthsData || []).map(
                          (monthGroup: any, mIdx: number) => (
                            <div key={mIdx} className="flex shrink-0 gap-[3px]">
                              <div className="flex gap-[3px] shrink-0">
                                {(monthGroup.weeks || []).map(
                                  (week: any, wIdxInMonth: number) => {
                                    const isFirstWeekOfMonth =
                                      wIdxInMonth === 0;
                                    const isColInHoveredMonth =
                                      hoveredMonth !== null &&
                                      week.some(
                                        (day: any) =>
                                          day.month === hoveredMonth,
                                      );

                                    const getHoveredColClass = () => {
                                      if (isColInHoveredMonth)
                                        return "bg-neu-accent/[0.04] dark:bg-neu-accent/[0.08] ring-1 ring-neu-accent/15 scale-[1.02] z-10";
                                      if (hoveredMonth !== null)
                                        return "opacity-30";
                                      return "";
                                    };

                                    return (
                                      <div
                                        key={wIdxInMonth}
                                        className={cn(
                                          "flex flex-col gap-[3px] shrink-0 relative pt-10 px-[1px] rounded-md transition-all duration-300",
                                          getHoveredColClass(),
                                        )}
                                      >
                                        {isFirstWeekOfMonth && (
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
                                              "absolute top-0 left-0 text-[10px] sm:text-[10px] font-mono text-neu-text-muted whitespace-nowrap cursor-pointer transition-all duration-200 hover:text-neu-accent select-none",
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
                                            const levelColors = isDark
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

                                            const isCellFilteredOut =
                                              selectedLevelFilter !== null &&
                                              day.level !== selectedLevelFilter;
                                            const isCellFilteredIn =
                                              selectedLevelFilter !== null &&
                                              day.level === selectedLevelFilter;

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
                                                  levelColors[day.level],
                                                  isCellFilteredOut
                                                    ? "opacity-15 scale-90"
                                                    : "",
                                                  isCellFilteredIn ||
                                                    activeTooltipDate ===
                                                      day.date
                                                    ? "ring-2 ring-neu-accent scale-110 z-10"
                                                    : "",
                                                )}
                                              >
                                                {/* Premium Mini Tooltip */}
                                                <div
                                                  className={cn(
                                                    "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-black/95 dark:bg-neutral-900 text-white text-[9px] font-mono whitespace-nowrap transition-all duration-150 z-50 shadow-lg border border-white/10 pointer-events-none",
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

                {/* Legend */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mt-6 pt-4 border-t border-gray-300/10 dark:border-gray-700/10 select-none">
                  <div className="relative group/legend-info flex flex-col gap-1 text-[10px] font-mono text-neu-text-muted max-w-xl">
                    <span className="font-bold text-neu-text text-[11px] mb-0.5 flex items-center gap-1.5 cursor-help pl-1 sm:pl-0">
                      ℹ Understanding Activity Levels
                      <span className="text-[9px] bg-neu-accent/15 text-neu-accent px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        Inspect Info
                      </span>
                    </span>
                    <p className="leading-relaxed pl-1 sm:pl-0">
                      Each tile represents a single day of the year. The shade
                      of color shows daily coding intensity. Click legend levels
                      to filter.
                    </p>

                    {/* Interactive descriptive tooltip that explains color coding and ranges in detail */}
                    <div className="absolute bottom-full left-0 translate-x-0 mb-3 p-4 w-[calc(100vw-32px)] max-w-[320px] sm:w-auto sm:max-w-none rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-100 shadow-2xl opacity-0 pointer-events-none group-hover/legend-info:opacity-100 group-hover/legend-info:translate-y-0 translate-y-2 transition-all duration-300 z-50 ease-out">
                      <h5 className="font-bold text-xs text-neu-accent mb-2 flex items-center gap-1.5 border-b border-zinc-200 dark:border-white/5 pb-1.5">
                        <Activity size={14} /> Coding Intensity Ranges
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[10px] font-mono">
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <span className="w-3.5 h-3.5 rounded-[4px] bg-gray-200 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700"></span>
                            <span className="text-zinc-500 dark:text-zinc-400">
                              Level 0: Empty
                            </span>
                          </span>
                          <span className="font-bold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                            0 commits
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <span className="w-3.5 h-3.5 rounded-[4px] bg-indigo-100 dark:bg-emerald-950"></span>
                            <span className="text-zinc-500 dark:text-zinc-400">
                              Level 1
                            </span>
                          </span>
                          <span className="font-bold text-indigo-500 dark:text-emerald-500 whitespace-nowrap">
                            1st Quartile
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <span className="w-3.5 h-3.5 rounded-[4px] bg-indigo-300 dark:bg-emerald-800"></span>
                            <span className="text-zinc-500 dark:text-zinc-400">
                              Level 2
                            </span>
                          </span>
                          <span className="font-bold text-indigo-600 dark:text-emerald-400 whitespace-nowrap">
                            2nd Quartile
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <span className="w-3.5 h-3.5 rounded-[4px] bg-indigo-500 dark:bg-emerald-500"></span>
                            <span className="text-zinc-500 dark:text-zinc-400">
                              Level 3
                            </span>
                          </span>
                          <span className="font-bold text-indigo-700 dark:text-emerald-300 whitespace-nowrap">
                            3rd Quartile
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <span className="w-3.5 h-3.5 rounded-[4px] bg-indigo-600 dark:bg-emerald-400"></span>
                            <span className="text-zinc-500 dark:text-zinc-400">
                              Level 4
                            </span>
                          </span>
                          <span className="font-bold text-indigo-800 dark:text-emerald-200 whitespace-nowrap">
                            4th Quartile
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-white/5 text-[9px] text-zinc-400 leading-normal">
                        ℹ Colors correspond to GitHub&apos;s relative quartile
                        distribution. Data is pulled live via GitHub GraphQL
                        API.
                      </div>
                      <div className="absolute top-full left-1/2 sm:left-6 -translate-x-1/2 -mt-[5px] w-2.5 h-2.5 rotate-45 bg-white/95 dark:bg-zinc-900/95 border-r border-b border-zinc-200 dark:border-white/10"></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 lg:ml-auto text-[10px] font-mono text-neu-text-muted bg-neu-bg/50 shadow-neu-inset p-2 rounded-xl border border-white/5 w-fit">
                    {selectedLevelFilter !== null ? (
                      <button
                        onClick={() => setSelectedLevelFilter(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setSelectedLevelFilter(null);
                        }}
                        className="text-[10px] font-mono text-neu-accent hover:underline cursor-pointer flex items-center gap-1 active:scale-95 transition-transform mr-2"
                      >
                        ✕ Clear Filter
                      </button>
                    ) : (
                      <span className="opacity-75 mr-1">Intensity:</span>
                    )}
                    <span>Less</span>
                    {legendLevels.map((lvl) => {
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
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setSelectedLevelFilter(
                                selectedLevelFilter === lvl.level
                                  ? null
                                  : lvl.level,
                              );
                            }
                          }}
                          className={cn(
                            "w-4 h-4 rounded-[4px] cursor-pointer transition-all duration-200 relative group/legend flex items-center justify-center border border-transparent",
                            isDark ? lvl.darkBg : lvl.lightBg,
                            active
                              ? "ring-2 ring-neu-accent scale-125 shadow-md border-white/10"
                              : "hover:scale-115 hover:ring-1 hover:ring-neu-text-muted",
                          )}
                          title={lvl.label}
                        >
                          {/* Legend tooltip */}
                          <div className="absolute bottom-full mb-2 px-2.5 py-1.5 rounded-lg bg-black/95 dark:bg-neutral-900 text-white text-[9px] font-mono whitespace-nowrap opacity-0 pointer-events-none group-hover/legend:opacity-100 transition-opacity z-50 shadow-xl border border-white/10">
                            {lvl.label}
                          </div>
                        </button>
                      );
                    })}
                    <span>More</span>
                  </div>
                </div>
              </div>
            );
          }

                  return (
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
                          tickFormatter={(value) => value.split(" ")[0]}
                        />
                        <YAxis
                          stroke={isDark ? "#b2e4bc" : "#4b5563"}
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip contentStyle={customTooltipStyle} />
                        <Legend
                          iconType="circle"
                          wrapperStyle={customLegendStyle}
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
                  );
                })()}
              </div>

              {/* Dynamic summary phrase */}
              <p className="text-xs font-mono text-neu-text-muted text-center pt-2 leading-relaxed">
                {chartType === "temporal"
                  ? "✓ Consistently high development velocity maintained throughout late 2025 and early 2026."
                  : "✓ Highly balanced workload distribution across multiple critical repos and microservices."}
              </p>
            </div>

            {/* Most Used Languages Section has been moved to Proficiency.tsx */}

            {/* Timeline Graph Visualization */}
            <motion.div
              className="mt-10 p-5 sm:p-8 rounded-3xl glass-card-inset space-y-6 max-w-full overflow-hidden relative"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-300/30 dark:border-zinc-800/30 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-neu-accent mb-1">
                    <Briefcase size={18} />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
                      Career Timeline
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-neu-text tracking-tight">
                    Professional Experience
                  </h2>
                </div>
              </div>

              <div className="relative min-h-[400px]">
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
                          timelineWork.length > 1
                            ? `${(Math.max(0, Math.min(selectedWorkIndex! - windowStartIndex, MAX_VISIBLE - 1)) / (Math.min(timelineWork.length - windowStartIndex, MAX_VISIBLE) - 1)) * 100}%`
                            : "0%",
                      }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />

                    {/* Milestones wrapper */}
                    {(timelineWork || []).map((item: any, globalIndex: number) => {
                      const isSelected = selectedWorkIndex === globalIndex;
                      const isPast = globalIndex <= selectedWorkIndex!;

                      const localIndex = globalIndex - windowStartIndex;
                      const isVisible = localIndex >= 0 && localIndex < MAX_VISIBLE;

                      const visibleCount = Math.min(timelineWork.length, MAX_VISIBLE);
                      let percent = 50;
                      if (visibleCount > 1) {
                        percent = (localIndex / (visibleCount - 1)) * 100;
                      }

                      const isPresent = item.years?.toLowerCase().includes("present");

                      return (
                        <motion.button
                          key={globalIndex as number}
                          onClick={() => isVisible && handleSelectWorkNode(globalIndex)}
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
                          transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        >
                          {/* Years Label & Present Badge */}
                          <div className="absolute bottom-[100%] mb-3 flex flex-col items-center gap-1">
                            <span
                              className={cn(
                                "font-mono text-[11px] font-bold tracking-wider transition-colors duration-300 uppercase whitespace-nowrap",
                                isSelected
                                  ? "text-neu-accent font-extrabold"
                                  : "text-neu-text-muted group-hover:text-neu-text",
                              )}
                            >
                              {item.years}
                            </span>
                            {isPresent && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 leading-none">
                                CURRENT
                              </span>
                            )}
                          </div>

                          {/* Interactive Circle Node */}
                          <div className="relative flex items-center justify-center h-8 w-8">
                            {isSelected && (
                              <motion.div
                                layoutId="activeWorkRing"
                                className="absolute w-8 h-8 rounded-full border-2 border-neu-accent bg-neu-accent/10"
                                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                              />
                            )}
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10",
                                (() => {
                                  if (isSelected) return "bg-neu-accent border-neu-accent scale-110 shadow-lg";
                                  if (isPast) return "bg-neu-bg border-neu-accent";
                                  return "bg-neu-bg border-gray-400 dark:border-zinc-700 group-hover:border-neu-text";
                                })(),
                              )}
                            >
                              <div
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  (() => {
                                    if (isSelected) return "bg-neu-bg";
                                    if (isPast) return "bg-gradient-to-r from-pink-500 to-cyan-500";
                                    return "bg-transparent";
                                })(),
                                )}
                              />
                            </div>
                          </div>

                          {/* Company Name below */}
                          <span
                            className={cn(
                              "absolute top-[100%] mt-3 text-xs font-bold tracking-tight text-center transition-colors duration-300 w-full",
                              isSelected ? "text-neu-text" : "text-neu-text-muted group-hover:text-neu-text",
                            )}
                          >
                            {item.company}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile simplified timeline view */}
                <div className="flex md:hidden flex-wrap gap-2 justify-center mb-6">
                  {(timelineWork || []).map((item: any, index: number) => {
                    const isSelected = selectedWorkIndex === index;
                    const isPresent = item.years?.toLowerCase().includes("present");
                    return (
                      <button
                        key={index as number}
                        onClick={() => handleSelectWorkNode(index)}
                        className={cn(
                          "px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border cursor-pointer",
                          isSelected
                            ? "glass-card-inset text-neu-accent border-neu-accent/30"
                            : "glass-card border-transparent text-neu-text-muted hover:text-neu-text",
                        )}
                      >
                        <span className="opacity-60">{item.years.split(' ')[0]}:</span>
                        <span>{item.company}</span>
                        {isPresent && (
                          <span className="ml-1 text-[9px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold leading-none">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Details panel for the selected work item */}
                <AnimatePresence mode="wait">
                  {timelineWork.length > 0 && selectedWorkIndex !== null && timelineWork[selectedWorkIndex] && (
                    <motion.div
                      key={`work-details-${selectedWorkIndex}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="mt-6 p-6 sm:p-8 rounded-3xl glass-card-inset border border-gray-300/30 dark:border-gray-800/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                    >
                      {/* Left: Role Info & Impact Box */}
                      <div className="lg:col-span-5 space-y-5">
                        <div className="flex flex-col gap-1">
                          <h4 className="text-xl sm:text-2xl font-display font-extrabold text-neu-text tracking-tight uppercase">
                            {timelineWork[selectedWorkIndex].role}
                          </h4>
                          <div className="flex items-center flex-wrap gap-2 font-mono text-sm text-neu-text-muted mt-1">
                            <span>{timelineWork[selectedWorkIndex].company}</span>
                            <span className="opacity-50">|</span>
                            <span>{timelineWork[selectedWorkIndex].duration}</span>
                            {timelineWork[selectedWorkIndex].teaser && (
                              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-neu-accent/10 text-neu-accent border border-neu-accent/20 tracking-tight uppercase">
                                ✦ {timelineWork[selectedWorkIndex].teaser}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(Array.isArray(timelineWork[selectedWorkIndex].stack) ? timelineWork[selectedWorkIndex].stack : (timelineWork[selectedWorkIndex].stack || "").split(',')).map((tech: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-neu-accent/10 border border-neu-accent/20 rounded-md text-[10px] font-mono text-neu-accent uppercase">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                        
                        <div className="p-4 rounded-xl bg-neu-bg border border-white/10 dark:border-zinc-800/50 shadow-neu-inset flex flex-col justify-center mt-6">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neu-accent mb-1.5 flex items-center gap-1">
                            <Sparkles size={12} className="text-neu-accent animate-pulse" /> Business Impact
                          </span>
                          <p className="text-xs sm:text-sm font-sans font-extrabold text-neu-text leading-snug">
                            {timelineWork[selectedWorkIndex].fullImpact}
                          </p>
                        </div>
                      </div>

                      {/* Right: Detailed Accomplishments */}
                      <div className="lg:col-span-7">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neu-text-muted mb-2 block">
                          Core Contributions & Technical Delivery
                        </span>
                        <ul className="space-y-3">
                          {timelineWork[selectedWorkIndex].bullets.map((bullet: string, bIdx: number) => (
                            <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neu-text-muted leading-relaxed font-light">
                              <span className="text-neu-accent font-bold mt-1 shrink-0">✦</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
        {/* Animated divider with a section-specific icon and quote tooltip */}
        <AnimatedDivider
          icon={MessageCircle}
          quote="The words of those I've crossed paths with often become the fuel that drives me to keep creating."
        />
      </section>

      {/* Testimonials Section */}
      <motion.section
        id="endorse"
        className="max-w-7xl mx-auto mt-24 mb-24 overflow-visible scroll-mt-20"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-neu-accent mb-2">
              <MessageSquare size={18} className="animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Endorsements
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
              What Colleagues & Clients Say
            </h2>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <p className="text-sm font-mono text-neu-text-muted max-w-sm md:text-right">
              Verifiable recommendations from colleagues, partners, and clients
              who have worked with me.
            </p>
          </div>
        </div>

        <div className="relative w-full py-16 -my-8 px-0 md:px-0">
          <div className="flex justify-between items-center px-4 mb-4 z-20 relative">
            <button
              onClick={() => scrollTestimonials("left")}
              className="p-3.5 rounded-full glass-card hover:shadow-neu-sm transition-all text-neu-text-muted hover:text-neu-accent active:scale-95 flex items-center justify-center border border-white/5 bg-neu-bg/80 backdrop-blur-md"
              aria-label="Scroll Left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollTestimonials("right")}
              className="p-3.5 rounded-full glass-card hover:shadow-neu-sm transition-all text-neu-text-muted hover:text-neu-accent active:scale-95 flex items-center justify-center border border-white/5 bg-neu-bg/80 backdrop-blur-md"
              aria-label="Scroll Right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div 
            ref={testimonialsRef}
            onScroll={handleTestimonialsScroll}
            onMouseEnter={() => isHovered.current = true}
            onMouseLeave={() => { isHovered.current = false; onDragEnd(); }}
            onMouseDown={onDragStart}
            onMouseUp={onDragEnd}
            onMouseMove={onDragMove}
            onTouchStart={onDragStart}
            onTouchEnd={onDragEnd}
            onTouchMove={onDragMove}
            style={{ cursor: 'grab' }}
            className="flex select-none overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-12 px-0"
          >
            {[
              ...testimonialsList,
              ...testimonialsList,
              ...testimonialsList,
            ].map((t, index) => (
              <div
                key={`${t.id}-dup-${index}`}
                className={cn(
                  "flex-shrink-0 w-[85vw] sm:w-[440px] max-w-[400px] sm:max-w-none p-5 sm:p-8 rounded-3xl glass-card relative flex flex-col justify-between group transition-all duration-300 ease-out border border-white/5 mr-6 sm:mr-10",
                  index % 2 === 0 ? "-rotate-2" : "rotate-2",
                  "hover:rotate-0 hover:scale-[1.03] hover:-translate-y-2 hover:z-30",
                  "hover:border-blue-500 hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.3)] dark:hover:border-emerald-400 dark:hover:shadow-[0_25px_50px_-12px_rgba(74,222,128,0.3)]",
                )}
              >
                <div>
                  {/* Link Badge (if exists) */}
                  {t.url && (
                    <div className="mb-6 inline-flex px-3 py-1 rounded-full glass-card-inset text-[10px] font-mono text-neu-accent font-semibold tracking-wide hover:bg-neu-accent/20 transition-colors">
                      ✦ Verifiable URL Profile
                    </div>
                  )}

                  {/* Testimonial Quote Content */}
                  <div className="mb-6 relative z-10 flex-1 flex flex-col">
                    <div className="absolute -top-3 -left-2 text-neu-accent/30 group-hover:text-neu-accent/60 transition-colors z-10 pointer-events-none">
                      <Quote size={32} />
                    </div>
                    <div className="p-5 pt-8 rounded-2xl glass-card-inset text-sm text-neu-text-muted leading-relaxed font-sans italic relative bg-neu-bg/40 flex-1 flex flex-col justify-between">
                      <div
                        className={
                          t.testimonial.length > 150 ? "line-clamp-4" : ""
                        }
                      >
                        &ldquo;{t.testimonial}&rdquo;
                      </div>
                      {t.testimonial.length > 150 && (
                        <button
                          onClick={() => setSelectedTestimonial(t)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setSelectedTestimonial(t);
                          }}
                          className="mt-3 text-xs font-bold text-neu-accent hover:underline relative z-20 flex items-center gap-1 self-start"
                        >
                          See more...
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  {/* User Identity Footer of Card */}
                  <div className="pt-4 border-t border-gray-300/30 dark:border-gray-700/30 flex flex-col gap-1">
                    {t.url ? (
                      <a
                        href={t.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold text-neu-text hover:text-neu-accent hover:underline transition-colors relative z-20"
                      >
                        {t.name}
                      </a>
                    ) : (
                      <span className="text-base font-bold text-neu-text">
                        {t.name}
                      </span>
                    )}
                    <div className="text-xs text-neu-text-muted">
                      <span className="italic">{t.role}</span>
                      {" at "}
                      <span className="font-bold">{t.company}</span>
                    </div>
                  </div>

                  {/* Tags associated with endorsement */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {(t.tags || []).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 glass-card-inset text-[10px] font-mono font-medium rounded-lg text-neu-text-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
}
