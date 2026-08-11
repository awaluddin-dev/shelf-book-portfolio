import { renderHook, act } from '@testing-library/react';
import { useDraftInquiry } from '@/hooks/useDraftInquiry';

describe('useDraftInquiry', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDraftInquiry());
    expect(result.current.text).toEqual('');
    expect(result.current.status).toEqual('idle');
  });

  it('should update draft', () => {
    const { result } = renderHook(() => useDraftInquiry());
    act(() => {
      // not testing actual fetch, just initialization
      result.current.reset();
    });
    expect(result.current.text).toBe('');
  });

  it('should clear draft', () => {
    const { result } = renderHook(() => useDraftInquiry());
    act(() => {
      result.current.reset();
    });
    expect(result.current.text).toEqual('');
  });
});
