import { renderHook, waitFor } from '@testing-library/react';
import { usePortfolioData } from '@/views/home/model/usePortfolioData';

describe('usePortfolioData', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches all data and updates state correctly', async () => {
    // Mock the different endpoints
    mockFetch.mockImplementation((url: string) => {
      let data = {};
      if (url === '/api/hero') {
        data = { heroConfig: { name: 'Test' }, metrics: [] };
      } else if (url === '/api/testimonials') {
        data = { testimonials: [{ status: 'accepted' }] };
      } else if (url === '/api/work') {
        data = { workExperiences: [{ years: '2020-Present' }] };
      } else if (url === '/api/current') {
        data = { currentFocus: [{ id: 1 }] };
      } else if (url === '/api/proficiency') {
        data = { proficiency: [{ skill: 'React' }] };
      } else if (url === '/api/learning') {
        data = { roadmap: [{ title: 'Learn Next' }] };
      } else if (url === '/api/projects') {
        data = { projects: [{ name: 'Project 1' }] };
      } else if (url === '/api/status') {
        data = { status: 'busy' };
      }

      return Promise.resolve({
        json: () => Promise.resolve({ data })
      });
    });

    const { result } = renderHook(() => usePortfolioData());

    // Initially it should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.portfolioStatus).toBe('available');

    // Wait for loading to finish
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check if data is mapped correctly
    expect(result.current.heroConfig).toEqual({ name: 'Test' });
    expect(result.current.testimonials.length).toBe(1);
    expect(result.current.workExperiences.length).toBe(1);
    expect(result.current.currentFoci.length).toBe(1);
    expect(result.current.proficiencies.length).toBe(1);
    expect(result.current.roadmaps.length).toBe(1);
    expect(result.current.projects.length).toBe(1);
    expect(result.current.portfolioStatus).toBe('busy');
    expect(mockFetch).toHaveBeenCalledTimes(8); // 7 sections + status
  });

  it('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePortfolioData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // States should be defaults
    expect(result.current.heroConfig).toBeNull();
    expect(result.current.testimonials).toEqual([]);
  });
});
