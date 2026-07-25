import { render, screen, fireEvent } from '@testing-library/react'
import ProficiencySection from '@/views/home/ui/sections/ProficiencySection'

// Mock sub-components
jest.mock('@/shared/ui/AnimatedDivider', () => ({
  AnimatedDivider: () => <div data-testid="animated-divider" />
}))
jest.mock('@/shared/ui/P5Background', () => () => <div data-testid="p5-background" />)
jest.mock('@/entities/skill/ui/SkillTree', () => () => <div data-testid="skill-tree" />)

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}))

describe('ProficiencySection', () => {
  const mockRenderIcon = jest.fn((name) => <span data-testid={`icon-${name}`} />)
  const mockSetSelectedRoadmapIndex = jest.fn()

  const defaultProps = {
    dynamicProficiency: [],
    activeRoadmap: [
      {
        quarter: 'Q1 2024',
        status: 'In Progress',
        tech: 'React Server Components',
        description: 'Test description',
        depth: 'Deep',
        icon: 'test-icon',
        topics: ['Topic 1', 'Topic 2'],
        projects: ['Project 1']
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
    activeCurrentFocus: true,
    renderIcon: mockRenderIcon,
    selectedRoadmapIndex: 0,
    setSelectedRoadmapIndex: mockSetSelectedRoadmapIndex,
    isDark: true,
    activeProficiency: [
      {
        title: 'Frontend',
        skills: [
          { name: 'React', subtext: 'Hooks, Context', status: 'Production-ready' },
          { name: 'Vue', subtext: 'Composition API', status: 'In Use' },
          { name: 'Svelte', subtext: 'Stores', status: 'Building' }
        ]
      }
    ],
    isLoading: false
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with default props', () => {
    render(<ProficiencySection {...defaultProps} />)
    expect(screen.getByText('Technical Proficiency')).toBeInTheDocument()
    expect(screen.getByText('Right Now')).toBeInTheDocument()
    expect(screen.getByText('Upcoming Tech & Specializations')).toBeInTheDocument()
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

  it('renders current focus content', () => {
    render(<ProficiencySection {...defaultProps} />)
    expect(screen.getByText('Writing')).toBeInTheDocument()
    expect(screen.getByText('Current Work')).toBeInTheDocument()
    expect(screen.getByText('Currently Learning')).toBeInTheDocument()
  })

  it('renders roadmap items', () => {
    render(<ProficiencySection {...defaultProps} />)
    // Mobile and desktop buttons might duplicate text, check if present
    expect(screen.getAllByText('React Server Components').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Q1 2024').length).toBeGreaterThan(0)
  })

  it('handles roadmap selection click', () => {
    render(<ProficiencySection {...defaultProps} />)
    // Both desktop and mobile have buttons
    const buttons = screen.getAllByRole('button')
    // Click a button to change index (assuming the second one corresponds to the next item)
    // The first two buttons are Q1 and Q2 on desktop
    fireEvent.click(screen.getAllByText('Q2 2024')[0].closest('button')!)
    
    expect(mockSetSelectedRoadmapIndex).toHaveBeenCalledWith(1) // Q2 is index 1
  })

  it('renders selected roadmap details', () => {
    render(<ProficiencySection {...defaultProps} selectedRoadmapIndex={0} />)
    
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Deep')).toBeInTheDocument()
    expect(screen.getByText('Topic 1')).toBeInTheDocument()
    expect(screen.getByText('Project 1')).toBeInTheDocument()
    expect(screen.getByTestId('icon-test-icon')).toBeInTheDocument()
  })

  it('renders SkillTree and AnimatedDivider', () => {
    render(<ProficiencySection {...defaultProps} />)
    expect(screen.getByTestId('skill-tree')).toBeInTheDocument()
    expect(screen.getByTestId('animated-divider')).toBeInTheDocument()
  })
})
