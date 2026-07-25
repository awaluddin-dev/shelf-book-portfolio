import { render, screen, waitFor } from '@testing-library/react'
import Home from '@/views/home/ui/Home'
import { ThemeProvider } from '@/shared/ui/ThemeProvider'

// Mock sub-components
jest.mock('@/views/home/ui/sections/HeroSection', () => () => <div data-testid="hero-section" />)
jest.mock('@/views/home/ui/sections/ProjectsSection', () => () => <div data-testid="projects-section" />)
jest.mock('@/views/home/ui/sections/ProficiencySection', () => () => <div data-testid="proficiency-section" />)
jest.mock('@/views/home/ui/sections/ExperienceSection', () => () => <div data-testid="experience-section" />)
jest.mock('@/features/contact/ui/ContactModal', () => () => <div data-testid="contact-modal" />)
jest.mock('@/views/home/ui/components/ProjectModal', () => () => <div data-testid="project-modal" />)
jest.mock('@/views/home/ui/components/TestimonialModal', () => () => <div data-testid="testimonial-modal" />)

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: {} }),
  })
) as jest.Mock

// Mock window/browser globals
const originalPerformance = window.performance
beforeAll(() => {
  Object.defineProperty(window, 'performance', {
    configurable: true,
    value: {
      timing: {
        navigationStart: 0,
        loadEventEnd: 100,
      },
    },
  })
  Object.defineProperty(window, 'crypto', {
    configurable: true,
    value: {
      getRandomValues: (arr: any) => {
        arr[0] = 12345
        return arr
      },
    },
  })
})
afterAll(() => {
  Object.defineProperty(window, 'performance', {
    configurable: true,
    value: originalPerformance,
  })
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock intersection observer
class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserver as any

// Mock framer-motion useScroll to avoid DOM errors in jsdom
jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useSpring: () => ({ get: () => 0 }),
    motion: {
      div: ({ children, className, ...props }: any) => (
        <div className={className} data-testid="motion-div" {...props}>
          {children}
        </div>
      )
    },
    AnimatePresence: ({ children }: any) => <>{children}</>
  }
})

describe('Home Page View', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    // If fake timers are used implicitly, clear them or just leave this empty
  })

  it('renders all sections correctly', async () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    )

    // Initially it will be in loading state for 1.2s, let's fast forward
    jest.advanceTimersByTime(1500)
    
    await waitFor(() => {
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
      expect(screen.getByTestId('projects-section')).toBeInTheDocument()
      expect(screen.getByTestId('proficiency-section')).toBeInTheDocument()
      expect(screen.getByTestId('experience-section')).toBeInTheDocument()
    })
  })

  it('fetches data on mount', async () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  it('renders the bottom navigation dock', async () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Stack & Insights')).toBeInTheDocument()
      expect(screen.getByLabelText('Experience')).toBeInTheDocument()
      expect(screen.getByLabelText('Endorse')).toBeInTheDocument()
      expect(screen.getByLabelText('Toggle Theme')).toBeInTheDocument()
    })
  })
})
