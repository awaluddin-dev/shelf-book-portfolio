import { render, screen, fireEvent } from '@testing-library/react'
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
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}))

describe('ExperienceSection', () => {
  const mockSetActiveExpIdx = jest.fn()
  const mockSetSelectedTestimonial = jest.fn()
  const mockSetChartType = jest.fn()
  const mockSetHoveredMonth = jest.fn()
  const mockSetHoveredLang = jest.fn()
  const mockSetSelectedLevelFilter = jest.fn()
  const mockHandleTouchStart = jest.fn()
  const mockHandleTouchEnd = jest.fn()
  const mockHandleTouchMove = jest.fn()

  const defaultProps = {
    dynamicWork: [
      {
        id: 1,
        years: '2023 - Present',
        company: 'Test Company',
        role: 'Test Role',
        stack: ['React', 'Node.js'],
        duration: '1 yr',
        metric: '100% Growth',
        details: ['Detail 1'],
        projects: [{ name: 'Project 1', tech: ['React'] }]
      }
    ],
    activeExpIdx: null,
    setActiveExpIdx: mockSetActiveExpIdx,
    testimonialsList: [{ id: '1', name: 'Test Author', role: 'Tester', testimonial: 'Test text', company: 'Acme', tags: [] }],
    setSelectedTestimonial: mockSetSelectedTestimonial,
    contributionData: {},
    chartType: 'temporal' as const,
    setChartType: mockSetChartType,
    timelineData: [{ month: 'Jan', commits: 10 }],
    repoData: [{ name: 'test-repo', commits: 10, pullRequests: 2 }],
    languageData: [{ name: 'TypeScript', percentage: 100, color: '#000' }],
    hoveredMonth: null,
    setHoveredMonth: mockSetHoveredMonth,
    hoveredLang: null,
    setHoveredLang: mockSetHoveredLang,
    mounted: true,
    isLoading: false,
    isDark: true,
    heatmapStats: { total: 1000, maxStreak: 30, avgIntensity: 80 },
    heatmapRef: { current: null },
    monthsData: [{ label: 'Jan', monthNum: 1, weeks: [[{ date: '2024-01-01', count: 5, level: 2, month: 1 }]] }],
    selectedLevelFilter: null,
    setSelectedLevelFilter: mockSetSelectedLevelFilter,
    handleTouchStart: mockHandleTouchStart,
    handleTouchEnd: mockHandleTouchEnd,
    handleTouchMove: mockHandleTouchMove,
    activeTooltipDate: null,
    legendLevels: [
      { level: 1, label: 'Level 1', darkBg: 'bg-emerald-950', lightBg: 'bg-indigo-100' }
    ],
    activeWork: [
      {
        id: 1,
        years: '2023 - Present',
        company: 'Test Company',
        role: 'Test Role',
        stack: ['React', 'Node.js'],
        duration: '1 yr',
        metric: '100% Growth',
        details: ['Detail 1'],
        projects: [{ name: 'Project 1', tech: ['React'] }]
      }
    ]
  }

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
    render(<ExperienceSection {...defaultProps} />)
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Git Activity & Contribution Frequency')).toBeInTheDocument()
  })

  it('renders loading state for charts', () => {
    const { container } = render(<ExperienceSection {...defaultProps} isLoading={true} />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('toggles chart type', () => {
    render(<ExperienceSection {...defaultProps} />)
    
    fireEvent.click(screen.getByText(/Repos/))
    expect(mockSetChartType).toHaveBeenCalledWith('repository')
    
    fireEvent.click(screen.getByText(/Commit Timeline/))
    expect(mockSetChartType).toHaveBeenCalledWith('temporal')
  })

  it('renders AreaChart when temporal', () => {
    render(<ExperienceSection {...defaultProps} chartType="temporal" />)
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('renders BarChart when repository', () => {
    render(<ExperienceSection {...defaultProps} chartType="repository" />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('renders languages', () => {
    render(<ExperienceSection {...defaultProps} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('100.0%')).toBeInTheDocument()
  })

  it('renders dynamic work experiences', () => {
    render(<ExperienceSection {...defaultProps} />)
    expect(screen.getAllByText('Test Company').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Test Role').length).toBeGreaterThan(0)
  })

  it('expands experience item on click', () => {
    render(<ExperienceSection {...defaultProps} />)
    const rows = screen.getAllByText('Test Company')
    
    // Click the first expandable row
    if (rows.length > 0) {
      fireEvent.click(rows[0])
      expect(mockSetActiveExpIdx).toHaveBeenCalled()
    }
  })
})
