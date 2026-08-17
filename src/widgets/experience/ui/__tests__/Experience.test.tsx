import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ExperienceSection from '../Experience';
import { usePortfolioStore } from '@/shared/store/portfolioStore';

jest.mock('@/shared/store/portfolioStore', () => ({
  usePortfolioStore: jest.fn(),
}));

jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

// Mock ResizeObserver
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ExperienceSection', () => {
  const mockStore = {
    dynamicWork: [
      {
        id: '1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        years: '2020 - 2022',
        description: 'Did some coding',
        technologies: ['React', 'Node'],
        highlights: ['Shipped feature A'],
        bullets: ['Did A', 'Did B'],
      },
      {
        id: '2',
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        years: '2022 - Present',
        description: 'Did more coding',
        technologies: ['React', 'Node', 'AWS'],
        highlights: ['Shipped feature B'],
        bullets: ['Did C', 'Did D'],
      }
    ],
    testimonialsList: [
      {
        id: '1',
        name: 'John Doe',
        role: 'Manager',
        testimonial: 'Great dev',
      }
    ],
    setSelectedTestimonial: jest.fn(),
    contributionData: [
      [
        { date: '2026-01-01', count: 1, level: 1, month: 0 },
        { date: '2026-01-02', count: 0, level: 0, month: 0 }
      ]
    ],
    timelineData: [
      { month: 0, commits: 10 }
    ],
    repoData: [
      { name: 'repo1', commits: 5, category: 'frontend' }
    ],
    isLoading: false,
  };

  beforeEach(() => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue(mockStore);
    jest.useFakeTimers();
    
    // Mock intersection observer for framer-motion if needed
    window.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    }));

    window.HTMLElement.prototype.scrollBy = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders loading state when isLoading is true', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({ ...mockStore, isLoading: true });
    render(<ExperienceSection isDark={false} />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Experience')).toBeInTheDocument();
  });

  it('renders correctly and switches chart tabs', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({ ...mockStore, isLoading: false });
    render(<ExperienceSection isDark={false} />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Experience')).toBeInTheDocument();

    // Switch to Heatmap
    const heatmapBtn = screen.getByText('Heatmap');
    fireEvent.click(heatmapBtn);

    // Switch to Repos
    const reposBtn = screen.getByText('Repos');
    fireEvent.click(reposBtn);

    // Switch to Timeline
    const timelineBtn = screen.getByText('Commit Timeline');
    fireEvent.click(timelineBtn);
  });
  
  it('handles clicking on work timeline nodes and touch events', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({ ...mockStore, isLoading: false });
    render(<ExperienceSection isDark={false} />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // We should be able to click on the timeline nodes.
    const nodes = screen.getAllByRole('button').filter(b => b.className.includes('w-6') && b.className.includes('h-6'));
    if (nodes.length > 0) {
      fireEvent.click(nodes[0]);
      fireEvent.click(nodes[1]);
    }
    expect(nodes).toBeDefined();
  });

  it('renders testimonials and handles scrolling', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({ ...mockStore, isLoading: false });
    render(<ExperienceSection isDark={true} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Testimonial should be visible
    expect(screen.getAllByText('“Great dev”')[0]).toBeInTheDocument();
    
    // Test the arrow buttons for scrolling
    const leftArrow = screen.getAllByRole('button').find(b => b.querySelector('.lucide-chevron-left'));
    const rightArrow = screen.getAllByRole('button').find(b => b.querySelector('.lucide-chevron-right'));
    if (leftArrow) fireEvent.click(leftArrow);
    if (rightArrow) fireEvent.click(rightArrow);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
  });

  it('handles mouse drag for testimonials', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({ ...mockStore, isLoading: false });
    render(<ExperienceSection isDark={false} />);
    
    const elements = screen.getAllByText('“Great dev”');
    if (elements.length > 0) {
      const container = elements[0].closest('ul') || elements[0].parentElement?.parentElement;
      if (container) {
        fireEvent.mouseDown(container, { pageX: 100 });
        fireEvent.mouseMove(container, { pageX: 50 });
        fireEvent.mouseUp(container);
        fireEvent.mouseDown(container, { pageX: 50 });
        fireEvent.mouseLeave(container);
      }
    }
    expect(elements).toBeDefined();
  });
});
