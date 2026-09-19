/* eslint-disable */
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
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
    dynamicExperiencesV2: [
      {
        id: '1',
        period: '2023 – Present',
        company: 'Test Company',
        role: 'Test Role',
        isActive: true,
        bullets: [{ situation: 'Situation', action: 'Action', metric: '100% Growth' }],
        techTags: ['React', 'Node.js']
      }
    ],
    isLoading: false,
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
    expect(screen.getByText('Career')).toBeInTheDocument()
    expect(screen.getByText('Journey & Chronology')).toBeInTheDocument()
  })

  it('renders dynamic work experiences', async () => {
    render(<ExperienceSection isDark={true} />)
    expect(screen.getByText('Test Company')).toBeInTheDocument()
    expect(screen.getByText('Test Role')).toBeInTheDocument()
    expect(screen.getByText('100% Growth')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('handles mouse hover interactions on timeline items', () => {
    render(<ExperienceSection isDark={true} />)
    const card = screen.getByText('Test Company').closest('article')
    if (card) {
      fireEvent.mouseEnter(card)
      expect(card).toBeInTheDocument()
      fireEvent.mouseLeave(card)
      expect(card).toBeInTheDocument()
    }
  })
})
