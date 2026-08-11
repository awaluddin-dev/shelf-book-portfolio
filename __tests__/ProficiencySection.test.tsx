import { render, screen, fireEvent } from '@testing-library/react'
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
    dynamicProficiency: [
      {
        title: 'Frontend',
        skills: [
          { name: 'React', subtext: 'Hooks, Context', status: 'Production-ready' },
          { name: 'Vue', subtext: 'Composition API', status: 'In Use' },
          { name: 'Svelte', subtext: 'Stores', status: 'Building' }
        ]
      }
    ],
    dynamicRoadmap: [
      {
        quarter: 'Q1 2024',
        status: 'In Progress',
        tech: 'React Server Components',
        description: 'Test description',
        depth: 'Deep',
        icon: 'test-icon',
        topics: ['Topic 1', 'Topic 2'],
        projects: ['Project 1']
        , currentFocuses: [{ title: 'Writing', items: ['Current Work', 'Currently Learning'] }]
      },
      {
        quarter: 'Q2 2024',
        status: 'Planned',
        tech: 'GraphQL',
        description: 'Test description 2',
        depth: 'Medium',
        icon: 'test-icon-2',
        topics: ['Topic 3'],
        projects: ['Project 2']
      }
    ],
    languageData: [
      { name: 'TypeScript', percentage: 100, color: '#000' }
    ],
    isLoading: false,
    activeCurrentFocus: {
      writing: 'Writing',
      currentWork: 'Current Work',
      currentlyLearning: 'Currently Learning'
    }
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
    expect(screen.getByText('Technical Proficiency')).toBeInTheDocument()
    expect(screen.getByText(/Current Focus/)).toBeInTheDocument()
    expect(screen.getByText('Most Used Languages')).toBeInTheDocument()
  })

  it('renders proficiency categories and skills', () => {
    render(<ProficiencySection {...defaultProps} />)
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getAllByText('Production-ready')[0]).toBeInTheDocument()
    expect(screen.getByText('Vue')).toBeInTheDocument()
    expect(screen.getAllByText('In Use')[0]).toBeInTheDocument()
    expect(screen.getByText('Svelte')).toBeInTheDocument()
    expect(screen.getAllByText('Building')[0]).toBeInTheDocument()
  })

  it('renders roadmap items', () => {
    render(<ProficiencySection {...defaultProps} />)
    expect(screen.getAllByText('React Server Components').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Q1 2024').length).toBeGreaterThan(0)
  })

  it('handles roadmap selection click', () => {
    render(<ProficiencySection {...defaultProps} />)
    const q2Buttons = screen.getAllByText('Q2 2024')
    if (q2Buttons.length > 0) {
      fireEvent.click(q2Buttons[0].closest('button')!)
      expect(screen.getByText('Test description 2')).toBeInTheDocument()
    }
  })

  it('renders selected roadmap details', () => {
    render(<ProficiencySection {...defaultProps} />)
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Deep')).toBeInTheDocument()
    expect(screen.getByText('Topic 1')).toBeInTheDocument()
    expect(screen.getByText('Project 1')).toBeInTheDocument()
  })

  it('renders SkillTree and AnimatedDivider', () => {
    render(<ProficiencySection {...defaultProps} />)
    expect(screen.getByTestId('skill-tree')).toBeInTheDocument()
    expect(screen.getByTestId('animated-divider')).toBeInTheDocument()
  })
})
