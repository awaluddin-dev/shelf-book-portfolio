/* eslint-disable react/display-name */
import { render, screen, waitFor } from '@testing-library/react'
import Home from '@/views/home/ui/Home'
import { ThemeProvider } from '@/shared/ui/ThemeProvider'

// Mock sub-components
jest.mock('@/widgets/hero/ui/Hero', () => () => <div data-testid="hero-section" />)
jest.mock('@/widgets/projects-list/ui/ProjectsList', () => () => <div data-testid="projects-section" />)
jest.mock('@/widgets/proficiency/ui/Proficiency', () => () => <div data-testid="proficiency-section" />)
jest.mock('@/widgets/experience/ui/Experience', () => () => <div data-testid="experience-section" />)
jest.mock('@/features/contact/ui/ContactModal', () => () => <div data-testid="contact-modal" />)
jest.mock('@/widgets/project-modal/ui/ProjectModal', () => () => <div data-testid="project-modal" />)
jest.mock('@/widgets/testimonial-modal/ui/TestimonialModal', () => () => <div data-testid="testimonial-modal" />)

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



describe('Home Page View', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all sections correctly', async () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    )

    await waitFor(() => {
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

  it('renders navigation links and sections', async () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Status:')).toBeInTheDocument()
      expect(screen.getAllByText('Resume').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Activity').length).toBeGreaterThan(0)
    })
  })
})
