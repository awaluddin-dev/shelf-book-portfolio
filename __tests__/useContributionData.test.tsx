import { renderHook, waitFor } from '@testing-library/react';
import { useContributionData } from '@/views/home/model/useContributionData';

describe('useContributionData', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches contribution data and calculates stats', async () => {
    // Mock weeks data
    const mockWeeks = [
      [
        { count: 0, date: '2023-01-01', month: 0 },
        { count: 5, date: '2023-01-02', month: 0 },
        { count: 3, date: '2023-01-03', month: 0 },
        null,
      ],
      [
        { count: 10, date: '2023-02-01', month: 1 },
        { count: 0, date: '2023-02-02', month: 1 },
      ]
    ];

    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({
        data: {
          calendar: mockWeeks,
          timeline: [],
          repositories: [],
          languages: [],
        }
      })
    });

    const { result } = renderHook(() => useContributionData('testuser'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weeks).toEqual(mockWeeks);
    
    // Check computed heatmapStats
    // Total count: 5 + 3 + 10 = 18
    expect(result.current.heatmapStats.total).toBe(18);
    // Active days: 3, Total valid days: 5 => 3/5 = 60.0%
    expect(result.current.heatmapStats.avgIntensity).toBe("60.0");
    // Max streak: 2 (from 01-02 to 01-03, assuming linear despite nulls, the logic increments currentStreak for contiguous >0 in array)
    // Actually the logic just increments currentStreak on count > 0 and resets on count == 0.
    // 0 -> streak=0. 5 -> streak=1. 3 -> streak=2. null -> skipped. 10 -> streak=3. 0 -> streak=0, max=3.
    expect(result.current.heatmapStats.maxStreak).toBe(3);
    
    // Check monthLabels
    expect(result.current.monthLabels.length).toBeGreaterThan(0);
    expect(result.current.monthLabels[0].monthNum).toBe(0);
  });

  it('handles empty response gracefully', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({})
    });

    const { result } = renderHook(() => useContributionData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weeks).toEqual([]);
    expect(result.current.heatmapStats.total).toBe(0);
  });

  it('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useContributionData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weeks).toEqual([]);
  });
});
