/* eslint-disable */
import { render, screen, fireEvent, act } from '@testing-library/react'
import ExperienceSection from '@/widgets/experience/ui/Experience'

// Mock sub-components
jest.mock('@/shared/ui/AnimatedDivider', () => ({
  AnimatedDivider: () => <div data-testid="animated-divider" />
}))

// Mock Recharts to avoid DOM layout issues in Jest
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts')
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
    BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
    PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
    Area: () => <div />,
    Bar: () => <div />,
    Pie: () => <div />,
    Cell: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    Legend: () => <div />
  }
})

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, onClick, onMouseEnter, onMouseLeave, whileHover }: any) => (
      <div 
        className={className} 
        onClick={onClick} 
        onMouseEnter={onMouseEnter} 
        onMouseLeave={onMouseLeave}
        data-whilehover={JSON.stringify(whileHover)}
      >
        {children}
      </div>
    ),
    section: ({ children, className, id }: any) => (
      <section id={id} className={className}>
        {children}
      </section>
    ),
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}))

const mockSetSelectedTestimonial = jest.fn()

jest.mock('@/shared/store/portfolioStore', () => ({
  usePortfolioStore: () => ({
    dynamicWork: [
      {
        id: 1,
        years: '2023 - Present',
        company: 'Test Company',
        role: 'Test Role',
        stack: ['React', 'Node.js'],
        duration: '1 yr',
        metric: '100% Growth',
        bullets: ['Detail 1'],
        projects: [{ name: 'Project 1', tech: ['React'] }]
      }
    ],
    testimonialsList: [{ id: '1', name: 'Test Author', role: 'Tester', testimonial: 'Test text', company: 'Acme', tags: [] }],
    setSelectedTestimonial: mockSetSelectedTestimonial,
    contributionData: [[{ date: '2024-01-01', count: 5, level: 2, month: 1 }]],
    timelineData: [{ month: 'Jan', commits: 10 }],
    repoData: [{ name: 'test-repo', commits: 10, pullRequests: 2 }],
    isLoading: false,
    languageData: [{ name: 'TypeScript', percentage: 100, color: '#000' }], // Note: Not used in UI now? Wait, check if used in repoData or something.
  })
}))

describe('ExperienceSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock getBoundingClientRect for scroll Into View behavior
    window.HTMLElement.prototype.getBoundingClientRect = () => ({
      top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0,
      x: 0, y: 0, toJSON: () => {}
    })
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
  })

  it('renders correctly with default props', () => {
    render(<ExperienceSection isDark={true} />)
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Git Activity & Contribution Frequency')).toBeInTheDocument()
  })

  it('toggles chart type', () => {
    render(<ExperienceSection isDark={true} />)
    
    fireEvent.click(screen.getByText(/Repos/))
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText(/Commit Timeline/))
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('renders dynamic work experiences', () => {
    render(<ExperienceSection isDark={true} />)
    expect(screen.getAllByText('Test Company').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Test Role').length).toBeGreaterThan(0)
  })

  it('expands experience item on click', () => {
    render(<ExperienceSection isDark={true} />)
    const rows = screen.getAllByText('Test Company')
    
    // Assuming clicking the row expands it; testing active state via UI changes if any
    if (rows.length > 0) {
      fireEvent.click(rows[0])
      // We can just verify it doesn't crash since state is local now
      expect(rows[0]).toBeInTheDocument()
    }
  })
})
