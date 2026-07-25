import { render, screen, fireEvent } from '@testing-library/react'
import HeroSection from '@/views/home/ui/sections/HeroSection'

// Mock sub-components
jest.mock('@/shared/ui/CircuitBoardBg', () => ({
  CircuitBoardBg: () => <div data-testid="circuit-board-bg" />
}))
jest.mock('@/shared/ui/AnimatedDivider', () => ({
  AnimatedDivider: ({ quote }: any) => <div data-testid="animated-divider">{quote}</div>
}))

// Mock framer-motion
jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react')
  return {
    ...actual,
    motion: {
      div: ({ children, className, 'data-testid': testId, onClick }: any) => (
        <div className={className} data-testid={testId} onClick={onClick}>
          {children}
        </div>
      ),
      h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
      p: ({ children, className }: any) => <p className={className}>{children}</p>,
    },
  }
})

describe('HeroSection', () => {
  const mockRenderIcon = jest.fn((name) => <span data-testid={`icon-${name}`} />)
  const mockTriggerToast = jest.fn()
  const mockSetShowInquiryModal = jest.fn()

  const defaultProps = {
    isLoading: false,
    isDark: true,
    dynamicHeroConfig: {
      name: 'Test Name',
      role: 'Test Role',
      openForWork: true,
      availableFrom: 'Today'
    },
    activeMetrics: [
      { label: 'Metric 1', value: '100', icon: 'test1', isSavings: false },
      { label: 'Metric 2', val: '200', icon: 'test2', isSavings: true }
    ],
    renderIcon: mockRenderIcon,
    triggerToast: mockTriggerToast,
    setShowInquiryModal: mockSetShowInquiryModal
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
    
    // Setup body mock for scrollIntoView fallback if needed
    document.body.innerHTML = '<div id="projects"></div>'
  })

  it('renders loading state correctly', () => {
    const { container } = render(<HeroSection {...defaultProps} isLoading={true} />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders correctly with default values when config is missing', () => {
    render(<HeroSection {...defaultProps} dynamicHeroConfig={null} activeMetrics={[]} />)
    expect(screen.getByText('Awaluddin')).toBeInTheDocument()
    expect(screen.getByText(/Backend Engineer/i)).toBeInTheDocument()
    expect(screen.getByText('Closed to Opportunities')).toBeInTheDocument()
  })

  it('renders correctly with provided config', () => {
    render(<HeroSection {...defaultProps} />)
    expect(screen.getByText('Test Name')).toBeInTheDocument()
    expect(screen.getByText('Test Role')).toBeInTheDocument()
    expect(screen.getByText('Open to Opportunities')).toBeInTheDocument()
    expect(screen.getByText('Today', { exact: false })).toBeInTheDocument()
  })

  it('handles View Projects button click', () => {
    const scrollIntoViewMock = jest.fn()
    const projectsDiv = document.getElementById('projects')
    if (projectsDiv) {
      projectsDiv.scrollIntoView = scrollIntoViewMock
    }

    render(<HeroSection {...defaultProps} />)
    
    const viewProjectsBtn = screen.getByText(/View Projects/i)
    fireEvent.click(viewProjectsBtn)
    
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('handles Download CV button click', () => {
    render(<HeroSection {...defaultProps} />)
    
    const downloadBtn = screen.getByText(/Download CV/i)
    fireEvent.click(downloadBtn)
    
    expect(mockTriggerToast).toHaveBeenCalledWith('Downloading CV...')
  })

  it('handles Inquiries button click', () => {
    render(<HeroSection {...defaultProps} />)
    
    const inquiriesBtn = screen.getByRole('button', { name: /Inquiries/i })
    fireEvent.click(inquiriesBtn)
    
    expect(mockSetShowInquiryModal).toHaveBeenCalledWith(true)
  })

  it('renders active metrics correctly', () => {
    render(<HeroSection {...defaultProps} />)
    
    expect(screen.getByText('Metric 1')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByTestId('icon-test1')).toBeInTheDocument()
    
    expect(screen.getByText('Metric 2')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByTestId('icon-test2')).toBeInTheDocument()
  })
})
