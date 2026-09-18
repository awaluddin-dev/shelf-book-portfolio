import { create } from "zustand";
import { fetchWithRetry, warmupDatabase } from "@/shared/lib/fetchUtils";

type AnyOrNullType = any | null; // NOSONAR

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
  coverLetterStatus: "idle" | "loading" | "streaming" | "done" | "error";
  setCoverLetterStatus: (
    status: "idle" | "loading" | "streaming" | "done" | "error",
  ) => void;
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
  dynamicHeroV2: AnyOrNullType;
  dynamicMetricsV2: any[];
  dynamicExperiencesV2: any[];
  dynamicPillarsV2: any[];
  dynamicProjectsV2: any[];
  testimonialsList: any[];
  contributionData: any[][];
  timelineData: any[];
  repoData: any[];
  languageData: any[];
  portfolioStatus: "available" | "busy";
  primaryResume: AnyOrNullType;
  resumeDocuments: any[];
  showResumeModal: boolean;
  setShowResumeModal: (show: boolean) => void;
  fetchResumeDocuments: () => Promise<void>;

  // --- Directions V2 State ---
  directionsV2: {
    current: any[];
    future: any[];
    roadmapByQuarter: Record<string, any[]>;
  };
  devtoArticles: any[];
  youtubeVideos: any[];
  fetchDirectionsV2: () => Promise<void>;
  fetchDevToArticles: () => Promise<void>;
  fetchYouTubeVideos: () => Promise<void>;


  // --- Initialization ---
  initializeData: () => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
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
  setCoverLetterText: (text) =>
    set((state) => ({
      coverLetterText:
        typeof text === "function" ? text(state.coverLetterText) : text,
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
  dynamicHeroV2: null,
  dynamicMetricsV2: [],
  dynamicExperiencesV2: [],
  dynamicPillarsV2: [],
  dynamicProjectsV2: [],
  testimonialsList: [],
  contributionData: [],
  timelineData: [],
  repoData: [],
  languageData: [],
  portfolioStatus: "available",
  primaryResume: null,
  resumeDocuments: [],
  showResumeModal: false,
  setShowResumeModal: (show) => set({ showResumeModal: show }),

  // --- Directions V2 State ---
  directionsV2: { current: [], future: [], roadmapByQuarter: {} },
  devtoArticles: [],
  youtubeVideos: [],

  fetchDirectionsV2: async () => {
    try {
      const res = await fetchWithRetry("/api/v2/directions");
      const resData = await res.json();
      const payload = resData.data || resData;
      if (payload && (payload.current || payload.future)) {
        set({ directionsV2: payload });
      }
    } catch (e) {
      console.error("fetchDirectionsV2 error:", e);
    }
  },

  fetchDevToArticles: async () => {
    try {
      const res = await fetchWithRetry("/api/v2/directions/devto");
      const resData = await res.json();
      const payload = resData.data || resData;
      const list = Array.isArray(payload) ? payload : [];
      if (list.length > 0) {
        set({ devtoArticles: list });
      }
    } catch (e) {
      console.error("fetchDevToArticles error:", e);
    }
  },

  fetchYouTubeVideos: async () => {
    try {
      const res = await fetchWithRetry("/api/v2/directions/youtube");
      const resData = await res.json();
      const payload = resData.data || resData;
      const list = Array.isArray(payload) ? payload : [];
      if (list.length > 0) {
        set({ youtubeVideos: list });
      }
    } catch (e) {
      console.error("fetchYouTubeVideos error:", e);
    }
  },

  fetchResumeDocuments: async () => {
    try {
      const res = await fetch("/api/resume/documents");
      const data = await res.json();
      const list = data.data || (Array.isArray(data) ? data : []);
      set({ resumeDocuments: list });
      const primary = list.find((d: any) => d.isPrimary) || list[0] || null;
      if (primary) {
        set({ primaryResume: primary });
      }
    } catch (e) {
      console.error("fetchResumeDocuments error:", e);
    }
  },

  // --- Initialization ---
  initializeData: async () => {
    try {
      warmupDatabase().then((success) => {
        if (success) {
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

      // --- V2 Fetchers ---
      const fetchHeroV2 = async () => {
        try {
          const res = await fetchWithRetry("/api/v2/hero", { cache: "no-store" });
          const resData = await res.json();
          const payload = resData.data || resData;
          if (payload.heroConfig) {
            set({
              dynamicHeroV2: payload.heroConfig,
              dynamicHeroConfig: payload.heroConfig,
            });
          }
          if (Array.isArray(payload.metrics) && payload.metrics.length > 0) {
            set({
              dynamicMetricsV2: payload.metrics,
              dynamicMetrics: payload.metrics,
            });
          }
        } catch (e) {
          console.error("fetchHeroV2 error:", e);
        }
      };

      const fetchExperienceV2 = async () => {
        try {
          const res = await fetchWithRetry("/api/v2/experience");
          const resData = await res.json();
          const payload = resData.data || resData;
          const list = payload.experiences || (Array.isArray(payload) ? payload : []);
          if (list.length > 0) {
            set({ dynamicExperiencesV2: list });
          }
        } catch (e) {
          console.error("fetchExperienceV2 error:", e);
        }
      };

      const fetchProficiencyV2 = async () => {
        try {
          const res = await fetchWithRetry("/api/v2/proficiency");
          const resData = await res.json();
          const payload = resData.data || resData;
          const list = payload.pillars || (Array.isArray(payload) ? payload : []);
          if (list.length > 0) {
            set({ dynamicPillarsV2: list });
          }
        } catch (e) {
          console.error("fetchProficiencyV2 error:", e);
        }
      };

      const fetchProjectsV2 = async () => {
        try {
          const res = await fetchWithRetry("/api/v2/projects");
          const resData = await res.json();
          const payload = resData.data || resData;
          const list = payload.projects || (Array.isArray(payload) ? payload : []);
          if (list.length > 0) {
            set({
              dynamicProjectsV2: list,
              dynamicProjects: list,
            });
          }
        } catch (e) {
          console.error("fetchProjectsV2 error:", e);
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

      const fetchPrimaryResume = async () => {
        try {
          const res = await fetch("/api/resume/documents");
          const data = await res.json();
          const list = data.data || (Array.isArray(data) ? data : []);
          set({ resumeDocuments: list });
          const primary = list.find((d: any) => d.isPrimary) || list[0] || null;
          if (primary) {
            set({ primaryResume: primary });
          }
        } catch (e) {
          console.error("fetchPrimaryResume error:", e);
        }
      };

      await Promise.all([
        fetchRoadmap(),
        fetchProficiency(),
        fetchHero(),
        fetchProjects(),
        fetchWork(),
        fetchHeroV2(),
        fetchExperienceV2(),
        fetchProficiencyV2(),
        fetchProjectsV2(),
        fetchTestimonials(),
        fetchGithub(),
        fetchStatus(),
        fetchPrimaryResume(),
        get().fetchDirectionsV2(),
        get().fetchDevToArticles(),
        get().fetchYouTubeVideos(),
      ]);

      set({ isLoading: false });
    } catch (e) {
      console.error("Initialization error:", e);
      set({ isLoading: false });
    }
  },
}));
