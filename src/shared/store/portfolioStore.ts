import { create } from "zustand";
import { fetchWithRetry, warmupDatabase } from "@/shared/lib/fetchUtils";

type AnyOrNullType = any; // NOSONAR

interface PortfolioState {
  // --- UI State ---
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  selectedProject: AnyOrNullType;
  setSelectedProject: (project: AnyOrNullType) => void;

  focusedProject: AnyOrNullType;
  setFocusedProject: (project: AnyOrNullType) => void;

  selectedTestimonial: AnyOrNullType;
  setSelectedTestimonial: (testimonial: AnyOrNullType) => void;

  isBannerMinimized: boolean;
  setIsBannerMinimized: (isMinimized: boolean) => void;

  showInquiryModal: boolean;
  setShowInquiryModal: (show: boolean) => void;

  inquiryMessage: string;
  setInquiryMessage: (msg: string) => void;
  draftInquirySource: string | null;
  setDraftInquirySource: (source: string | null) => void;

  showConnectionTooltip: boolean;
  setShowConnectionTooltip: (show: boolean) => void;

  toastMessage: string | null;
  triggerToast: (msg: string) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  // --- Cover Letter Global State ---
  showCoverLetterModal: boolean;
  setShowCoverLetterModal: (show: boolean) => void;
  coverLetterText: string;
  setCoverLetterText: (text: string | ((prev: string) => string)) => void;
  coverLetterStatus: 'idle' | 'loading' | 'streaming' | 'done' | 'error';
  setCoverLetterStatus: (status: 'idle' | 'loading' | 'streaming' | 'done' | 'error') => void;
  coverLetterError: string | null;
  setCoverLetterError: (err: string | null) => void;
  coverLetterJobDesc: string;
  setCoverLetterJobDesc: (desc: string) => void;

  // --- AI Chat State ---
  isChatOpen: boolean;
  setIsChatOpen: (show: boolean) => void;

  // --- API Data State ---
  dynamicRoadmap: any[];
  dynamicProficiency: any[];
  dynamicHeroConfig: AnyOrNullType;
  dynamicMetrics: any[];
  dynamicProjects: any[];
  dynamicWork: any[];
  testimonialsList: any[];
  contributionData: any[][];
  timelineData: any[];
  repoData: any[];
  languageData: any[];
  portfolioStatus: "available" | "busy";

  // --- Initialization ---
  initializeData: () => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  // --- UI State ---
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),

  focusedProject: null,
  setFocusedProject: (project) => set({ focusedProject: project }),

  selectedTestimonial: null,
  setSelectedTestimonial: (testimonial) =>
    set({ selectedTestimonial: testimonial }),

  isBannerMinimized: false,
  setIsBannerMinimized: (isMinimized) =>
    set({ isBannerMinimized: isMinimized }),

  showInquiryModal: false,
  setShowInquiryModal: (show) => set({ showInquiryModal: show }),

  inquiryMessage: "",
  setInquiryMessage: (msg) => set({ inquiryMessage: msg }),
  draftInquirySource: null,
  setDraftInquirySource: (source) => set({ draftInquirySource: source }),

  showConnectionTooltip: false,
  setShowConnectionTooltip: (show) => {
    set({ showConnectionTooltip: show });
    if (show) {
      setTimeout(() => set({ showConnectionTooltip: false }), 5000);
    }
  },

  toastMessage: null,
  triggerToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      set({ toastMessage: null });
    }, 3000);
  },

  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),

  // --- Cover Letter Global State ---
  showCoverLetterModal: false,
  setShowCoverLetterModal: (show) => set({ showCoverLetterModal: show }),
  coverLetterText: "",
  setCoverLetterText: (text) => set((state) => ({ 
    coverLetterText: typeof text === "function" ? text(state.coverLetterText) : text 
  })),
  coverLetterStatus: "idle",
  setCoverLetterStatus: (status) => set({ coverLetterStatus: status }),
  coverLetterError: null,
  setCoverLetterError: (error) => set({ coverLetterError: error }),
  coverLetterJobDesc: "",
  setCoverLetterJobDesc: (desc) => set({ coverLetterJobDesc: desc }),

  // --- AI Chat State ---
  isChatOpen: false,
  setIsChatOpen: (show) => set({ isChatOpen: show }),

  // --- API Data State ---
  dynamicRoadmap: [],
  dynamicProficiency: [],
  dynamicHeroConfig: null,
  dynamicMetrics: [],
  dynamicProjects: [],
  dynamicWork: [],
  testimonialsList: [],
  contributionData: [],
  timelineData: [],
  repoData: [],
  languageData: [],
  portfolioStatus: "available",

  // --- Initialization ---
  initializeData: async () => {
    try {
      await warmupDatabase((attempt) => {
        if (attempt === 1) {
          set({
            toastMessage: "Waking up database (cold start)... Please wait.",
          });
          setTimeout(() => set({ toastMessage: null }), 3000);
        }
      });

      const fetchRoadmap = async () => {
        try {
          const res = await fetchWithRetry("/api/learning");
          const resData = await res.json();
          const payload = resData.data || resData;
          const arr =
            payload.roadmap || (Array.isArray(payload) ? payload : []);
          if (arr.length > 0) {
            arr.sort((a: any, b: any) => {
              if (!a.quarter || !b.quarter) return 0;
              const partsA = a.quarter.split(" ");
              const partsB = b.quarter.split(" ");
              const yA = Number.parseInt(partsA[1], 10) || 0;
              const yB = Number.parseInt(partsB[1], 10) || 0;
              if (yA !== yB) return yA - yB;
              return partsA[0].localeCompare(partsB[0]);
            });
            set({ dynamicRoadmap: arr });
          }
        } catch (e) {
          console.error(e);
        }
      };

      const fetchProficiency = async () => {
        try {
          const res = await fetchWithRetry("/api/proficiency");
          const resData = await res.json();
          const payload = resData.data || resData;
          const arr =
            payload.proficiency || (Array.isArray(payload) ? payload : []);
          if (arr.length > 0) set({ dynamicProficiency: arr });
        } catch (e) {
          console.error(e);
        }
      };

      const fetchHero = async () => {
        try {
          const res = await fetchWithRetry("/api/hero", { cache: "no-store" });
          const resData = await res.json();
          const payload = resData.data || resData;
          if (payload.heroConfig)
            set({ dynamicHeroConfig: payload.heroConfig });
          const metricsArr =
            payload.metrics || (Array.isArray(payload) ? payload : []);
          if (metricsArr.length > 0) set({ dynamicMetrics: metricsArr });
        } catch (e) {
          console.error(e);
        }
      };

      const fetchProjects = async () => {
        try {
          const res = await fetchWithRetry("/api/projects");
          const resData = await res.json();
          const payload = resData.data || resData;
          const arr =
            payload.projects || (Array.isArray(payload) ? payload : []);
          if (arr.length > 0) set({ dynamicProjects: arr });
        } catch (e) {
          console.error(e);
        }
      };

      const sortWorkExp = (a: any, b: any) => {
        const isPresentA =
          a.years.toLowerCase().includes("present") ||
          a.years.toLowerCase().includes("current") ||
          a.years.toLowerCase().includes("now");
        const isPresentB =
          b.years.toLowerCase().includes("present") ||
          b.years.toLowerCase().includes("current") ||
          b.years.toLowerCase().includes("now");
        if (isPresentA && !isPresentB) return -1;
        if (!isPresentA && isPresentB) return 1;
        const startA = a.years.split("-")[0].trim();
        const startB = b.years.split("-")[0].trim();
        const dateA =
          new Date(startA).getTime() ||
          Number.parseInt(startA.match(/\d{4}/)?.[0] || "0", 10);
        const dateB =
          new Date(startB).getTime() ||
          Number.parseInt(startB.match(/\d{4}/)?.[0] || "0", 10);
        return dateB - dateA;
      };

      const fetchWork = async () => {
        try {
          const res = await fetchWithRetry("/api/work");
          const resData = await res.json();
          const payload = resData.data || resData;
          const arr =
            payload.workExperience ||
            payload.workExperiences ||
            (Array.isArray(payload) ? payload : []);
          if (arr.length > 0) {
            arr.sort(sortWorkExp);
            set({ dynamicWork: arr });
          }
        } catch (e) {
          console.error(e);
        }
      };

      const fetchTestimonials = async () => {
        try {
          const res = await fetch("/api/testimonials");
          const data = await res.json();
          const payload = data.data || data;
          let arr =
            payload.testimonials || (Array.isArray(payload) ? payload : []);
          arr = arr.filter((t: any) => t.status === "accepted" || !t.status);
          set({ testimonialsList: arr });
        } catch (e) {
          console.error(e);
        }
      };

      const fetchGithub = async () => {
        try {
          const res = await fetch("/api/github/contributions/awaluddin-dev");
          const data = await res.json();
          const payload = data.data || data;
          if (payload?.calendar) {
            set({
              contributionData: payload.calendar,
              timelineData: payload.timeline || [],
              repoData: payload.repositories || [],
              languageData: payload.languages || [],
            });
          } else {
            set({ contributionData: Array.isArray(payload) ? payload : [] });
          }
        } catch (e) {
          console.error(e);
        }
      };

      const fetchStatus = async () => {
        try {
          const res = await fetch("/api/status");
          const data = await res.json();
          set({ portfolioStatus: data.status });
        } catch (e) {
          console.error(e);
        }
      };

      await Promise.all([
        fetchRoadmap(),
        fetchProficiency(),
        fetchHero(),
        fetchProjects(),
        fetchWork(),
        fetchTestimonials(),
        fetchGithub(),
        fetchStatus(),
      ]);

      set({ isLoading: false });
    } catch (e) {
      console.error("Initialization error:", e);
      set({ isLoading: false });
    }
  },
}));
