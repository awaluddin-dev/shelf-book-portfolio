import { Project, Testimonial } from '@/shared/types';

export interface HomeState {
  searchQuery: string;
  selectedCategory: string | null;
  selectedProject: Project | null;
  isBannerMinimized: boolean;
  focusedProject: Project | null;
  hoveredSkillNode: any;
  mounted: boolean;
  chartType: 'temporal' | 'repository';
  hoveredMonth: number | null;
  selectedLevelFilter: number | null;
  loadTime: number | null;
  isFilterModalOpen: boolean;
  sortBy: 'newest' | 'oldest' | 'alphabetical';
  isLoading: boolean;
  activeSection: string;
  hoveredDockId: string | null;
  selectedRoadmapIndex: number;
  activeExpIdx: number | null;
  activeTooltipDate: string | null;
  toastMessage: string | null;
  testimonialsList: Testimonial[];
  portfolioStatus: 'available' | 'busy';
  showInquiryModal: boolean;
}

export const initialHomeState: HomeState = {
  searchQuery: '',
  selectedCategory: null,
  selectedProject: null,
  isBannerMinimized: false,
  focusedProject: null,
  hoveredSkillNode: null,
  mounted: false,
  chartType: 'temporal',
  hoveredMonth: null,
  selectedLevelFilter: null,
  loadTime: null,
  isFilterModalOpen: false,
  sortBy: 'newest',
  isLoading: true,
  activeSection: 'hero',
  hoveredDockId: null,
  selectedRoadmapIndex: 0,
  activeExpIdx: 0,
  activeTooltipDate: null,
  toastMessage: null,
  testimonialsList: [],
  portfolioStatus: 'available',
  showInquiryModal: false,
};

export type HomeAction = { type: 'SET_STATE'; payload: Partial<HomeState> };

export function homeReducer(state: HomeState, action: HomeAction): HomeState {
  if (action.type === 'SET_STATE') {
    return { ...state, ...action.payload };
  }
  return state;
}
