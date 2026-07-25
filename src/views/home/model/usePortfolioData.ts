"use client";

import { useState, useEffect } from "react";
import type { Testimonial } from "@/entities/testimonial/model/data";

export interface PortfolioDataState {
  heroConfig: any | null;
  metrics: any[];
  testimonials: Testimonial[];
  workExperiences: any[];
  currentFoci: any[];
  proficiencies: any[];
  roadmaps: any[];
  projects: any[];
  portfolioStatus: "available" | "busy";
  loading: boolean;
  errors: { [key: string]: string | null };
}

/**
 * Consolidated hook that fetches all portfolio data from the API.
 * Each section loads independently — sections with data appear as they arrive.
 */
export function usePortfolioData() {
  const [data, setData] = useState<PortfolioDataState>({
    heroConfig: null,
    metrics: [],
    testimonials: [],
    workExperiences: [],
    currentFoci: [],
    proficiencies: [],
    roadmaps: [],
    projects: [],
    portfolioStatus: "available",
    loading: true,
    errors: {},
  });

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const totalRequests = 7;

    const markLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalRequests && !cancelled) {
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    // Hero
    fetch("/api/hero", { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const payload = res.data || res;
        setData((prev) => ({
          ...prev,
          heroConfig: payload.heroConfig || null,
          metrics: payload.metrics || [],
        }));
      })
      .catch(() => {})
      .finally(markLoaded);

    // Testimonials
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const payload = res.data || res;
        let arr =
          payload.testimonials || (Array.isArray(payload) ? payload : []);
        arr = arr.filter((t: any) => t.status === "accepted" || !t.status);
        setData((prev) => ({ ...prev, testimonials: arr }));
      })
      .catch(() => {})
      .finally(markLoaded);

    // Work
    fetch("/api/work")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const payload = res.data || res;
        let arr =
          payload.workExperience ||
          payload.workExperiences ||
          (Array.isArray(payload) ? payload : []);
        if (arr.length > 0) {
          arr = [...arr].sort((a: any, b: any) => {
            const pA =
              a.years?.toLowerCase().includes("present") ||
              a.years?.toLowerCase().includes("current");
            const pB =
              b.years?.toLowerCase().includes("present") ||
              b.years?.toLowerCase().includes("current");
            if (pA && !pB) return -1;
            if (!pA && pB) return 1;
            const sA = a.years?.split("-")[0]?.trim() || "";
            const sB = b.years?.split("-")[0]?.trim() || "";
            const dA =
              new Date(sA).getTime() || parseInt(sA.match(/\d{4}/)?.[0] || "0");
            const dB =
              new Date(sB).getTime() || parseInt(sB.match(/\d{4}/)?.[0] || "0");
            return dB - dA;
          });
        }
        setData((prev) => ({ ...prev, workExperiences: arr }));
      })
      .catch(() => {})
      .finally(markLoaded);

    // Current Focus
    fetch("/api/current")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const payload = res.data || res;
        const arr =
          payload.currentFocus || (Array.isArray(payload) ? payload : []);
        setData((prev) => ({ ...prev, currentFoci: arr }));
      })
      .catch(() => {})
      .finally(markLoaded);

    // Proficiency
    fetch("/api/proficiency")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const payload = res.data || res;
        const arr =
          payload.proficiency || (Array.isArray(payload) ? payload : []);
        setData((prev) => ({ ...prev, proficiencies: arr }));
      })
      .catch(() => {})
      .finally(markLoaded);

    // Roadmap
    fetch("/api/learning")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const payload = res.data || res;
        const arr = payload.roadmap || (Array.isArray(payload) ? payload : []);
        setData((prev) => ({ ...prev, roadmaps: arr }));
      })
      .catch(() => {})
      .finally(markLoaded);

    // Projects
    fetch("/api/projects")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const payload = res.data || res;
        const arr = payload.projects || (Array.isArray(payload) ? payload : []);
        setData((prev) => ({ ...prev, projects: arr }));
      })
      .catch(() => {})
      .finally(markLoaded);

    // Status (separate)
    fetch("/api/status")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const status = res.status || res.data?.status || "available";
        setData((prev) => ({
          ...prev,
          portfolioStatus: status as "available" | "busy",
        }));
      })
      .catch(() => {})
      .finally(markLoaded);

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
