/* eslint-disable react/display-name */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '@/app/page';

// Mock the next-themes provider hook
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
    isDark: false,
    toggleTheme: jest.fn(),
  }),
}));

// Mock components that use libraries that don't play nicely with Jest's CJS environment
jest.mock('@/shared/ui/P5Background', () => () => <div data-testid="p5-background-mock" />);
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  AreaChart: () => <div>AreaChart</div>,
  Area: () => <div>Area</div>,
  BarChart: () => <div>BarChart</div>,
  Bar: () => <div>Bar</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Legend: () => <div>Legend</div>,
  PieChart: () => <div>PieChart</div>,
  Pie: () => <div>Pie</div>,
  Cell: () => <div>Cell</div>,
}));

// Mock the specific custom hooks to avoid fetching data in tests
jest.mock('@/views/home/model/usePortfolioData', () => ({
  usePortfolioData: () => ({
    loading: false,
    heroConfig: { name: 'Test User', role: 'Test Engineer' },
    metrics: [],
    roadmaps: [],
    proficiencies: [],
    workExperiences: [],
    currentFoci: [],
    projects: [],
    testimonials: [],
  }),
}));

jest.mock('@/views/home/model/useContributionData', () => ({
  useContributionData: () => ({
    loading: false,
    timelineData: [],
    repoData: [],
    languageData: [],
    heatmapStats: { total: 0, currentStreak: 0, longestStreak: 0, topLanguage: '' },
    monthsData: [],
  }),
}));

describe('Home Page', () => {
  it('renders the home page with mocked data', () => {
    // We mock IntersectionObserver because the Home page uses it for scroll spy
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;

    // We also need to mock motion/react if it causes issues, but usually it works fine in jsdom.

    // Mock fetch for SkillTree.tsx
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: { skills: [] } }),
      })
    ) as jest.Mock;
    
    render(<Page />);
    
    // We expect the mocked name 'Test User' to be rendered
    const heading = screen.getByText('Test User');
    expect(heading).toBeInTheDocument();
    
    // Check if role is rendered
    const role = screen.getByText(/Test Engineer/i);
    expect(role).toBeInTheDocument();
  });
});
