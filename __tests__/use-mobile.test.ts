import { renderHook } from '@testing-library/react'
import { useIsMobile } from '@/shared/lib/hooks/use-mobile'

describe('useIsMobile', () => {
  let matchMediaMock: jest.Mock

  beforeEach(() => {
    matchMediaMock = jest.fn()
    window.matchMedia = matchMediaMock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return true if window.innerWidth is less than 768', () => {
    window.innerWidth = 500
    
    matchMediaMock.mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('should return false if window.innerWidth is 768 or greater', () => {
    window.innerWidth = 800
    
    matchMediaMock.mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
})
