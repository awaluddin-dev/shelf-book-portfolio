import { render, screen } from '@testing-library/react'
import ProficiencySection from '@/widgets/proficiency/ui/Proficiency'

// Mock sub-components
jest.mock('@/shared/ui/AnimatedDivider', () => ({
  AnimatedDivider: () => <div data-testid="animated-divider" />
}))
jest.mock('@/shared/ui/P5Background', () => ({
  __esModule: true,
  default: () => <div data-testid="p5-background" />
}))
jest.mock('@/entities/skill/ui/SkillTree', () => ({
  __esModule: true,
  default: () => <div data-testid="skill-tree" />
}))

jest.mock('recharts', () => ({
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: any) => <div>{children}</div>,
  Cell: () => <div />
}))

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    button: ({ children, className, onClick }: any) => (<button className={className} onClick={onClick}>{children}</button>),
    div: ({ children, className, onClick }: any) => (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    ),
    li: ({ children, className }: any) => (
      <li className={className}>
        {children}
      </li>
    ),
    h2: ({ children, className }: any) => (
      <h2 className={className}>
        {children}
      </h2>
    ),
    h3: ({ children, className }: any) => (
      <h3 className={className}>
        {children}
      </h3>
    ),
    span: ({ children, className }: any) => (
      <span className={className}>
        {children}
      </span>
    ),
    p: ({ children, className }: any) => (
      <p className={className}>
        {children}
      </p>
    ),
    section: ({ children, className, id }: any) => (
      <section className={className} id={id}>
        {children}
      </section>
    )
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}))

jest.mock('@/shared/store/portfolioStore', () => ({
  usePortfolioStore: () => ({
    dynamicPillarsV2: [
      {
        id: 'p1',
        pillarNumber: '01',
        title: 'Core Backend & Distributed Systems',
        description: 'High-concurrency services, event-driven orchestration.',
        icon: 'Server',
        skills: [
          { name: 'Go (Golang)', status: 'PROD' },
          { name: 'Kafka', status: 'PROD' },
          { name: 'pgvector', status: 'R&D' }
        ]
      }
    ],
    isLoading: false,
  })
}))

describe('ProficiencySection', () => {
  const mockRenderIcon = jest.fn((name) => <span data-testid={`icon-${name}`} />)

  const defaultProps = {
    renderIcon: mockRenderIcon,
    isDark: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
  })

  it('renders correctly with default props', () => {
    render(<ProficiencySection {...defaultProps} />)
    expect(screen.getByText('Production Systems Architecture')).toBeInTheDocument()
    expect(screen.getByText('Engineering Capability Matrix')).toBeInTheDocument()
    expect(screen.getByText('In Production')).toBeInTheDocument()
    expect(screen.getByText('Active R&D')).toBeInTheDocument()
  })

  it('renders proficiency pillars and skills from store', () => {
    render(<ProficiencySection {...defaultProps} />)
    expect(screen.getByText('Core Backend & Distributed Systems')).toBeInTheDocument()
    expect(screen.getByText('High-concurrency services, event-driven orchestration.')).toBeInTheDocument()
    expect(screen.getByText('Go (Golang)')).toBeInTheDocument()
    expect(screen.getByText('Kafka')).toBeInTheDocument()
    expect(screen.getByText('pgvector')).toBeInTheDocument()
    expect(screen.getAllByText('PROD').length).toBeGreaterThan(0)
    expect(screen.getAllByText('R&D').length).toBeGreaterThan(0)
  })

  it('renders AnimatedDivider', () => {
    render(<ProficiencySection {...defaultProps} />)
    expect(screen.getByTestId('animated-divider')).toBeInTheDocument()
  })
})
