"use client";

import { useState, useEffect, useMemo } from "react";

export interface ContributionDataState {
  weeks: any[][];
  timelineData: any[];
  repoData: any[];
  languageData: any[];
  loading: boolean;
}

/**
 * Fetches GitHub contribution heatmap data for the given username.
 */
export function useContributionData(username = "awaluddin-dev") {
  const [data, setData] = useState<ContributionDataState>({
    weeks: [],
    timelineData: [],
    repoData: [],
    languageData: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/github/contributions/${username}`)
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const payload = res.data || res;
        if (payload && payload.calendar) {
          setData({
            weeks: payload.calendar,
            timelineData: payload.timeline || [],
            repoData: payload.repositories || [],
            languageData: payload.languages || [],
            loading: false,
          });
        } else {
          setData((prev) => ({
            ...prev,
            weeks: Array.isArray(payload) ? payload : [],
            loading: false,
          }));
        }
      })
      .catch(() => {
        if (!cancelled) setData((prev) => ({ ...prev, loading: false }));
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const heatmapStats = useMemo(() => {
    let total = 0;
    let currentStreak = 0;
    let max = 0;
    let activeDays = 0;
    let totalDays = 0;

    data.weeks.forEach((week) => {
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

    return {
      total,
      maxStreak: max,
      avgIntensity:
        totalDays > 0 ? ((activeDays / totalDays) * 100).toFixed(1) : "0",
    };
  }, [data.weeks]);

  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string; monthNum: number }[] = [];
    let prevMonth = -1;
    data.weeks.forEach((week, index) => {
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
  }, [data.weeks]);

  const monthsData = useMemo(() => {
    const months: {
      label: string;
      monthNum: number;
      weeks: any[][];
    }[] = [];
    let currentMonthWeeks: any[][] = [];
    let currentMonthLabel = "";
    let currentMonthNum = -1;

    data.weeks.forEach((week, index) => {
      const monthLabel = monthLabels.find((lbl) => lbl.index === index);
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
  }, [data.weeks, monthLabels]);

  return { ...data, heatmapStats, monthLabels, monthsData };
}
