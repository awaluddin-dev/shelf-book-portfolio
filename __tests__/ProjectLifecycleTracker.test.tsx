import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import ProjectLifecycleTracker from '@/entities/project/ui/ProjectLifecycleTracker'

// Mock framer-motion
jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react')
  return {
    ...actual,
    motion: {
      div: ({ children, className, 'data-testid': testId, onClick, onMouseEnter, onMouseLeave, style }: any) => (
        <div 
          className={className} 
          data-testid={testId} 
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={style}
        >
          {children}
        </div>
      ),
    },
  }
})

describe('ProjectLifecycleTracker', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    ;(global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}))
    
    render(<ProjectLifecycleTracker projectId="p1" spineColor="bg-blue-500" />)
    
    expect(screen.getByText('Loading Lifecycle...')).toBeInTheDocument()
  })

  it('renders empty state if no phases found', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ data: [] })
    })

    render(<ProjectLifecycleTracker projectId="p1" spineColor="bg-blue-500" />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Lifecycle...')).not.toBeInTheDocument()
    })
    
    expect(screen.getByText('No lifecycle phases defined for this project')).toBeInTheDocument()
  })

  it('fetches and renders lifecycle phases correctly', async () => {
    const mockPhases = [
      { id: 'ph1', projectId: 'p1', stage: 'Planning', title: 'Initial Plan', description: 'Desc 1', date: 'Jan 2024', order: 1 },
      { id: 'ph2', projectId: 'p1', stage: 'Design Phase', title: 'Architecture', description: 'Desc 2', date: 'Feb 2024', order: 2 },
      { id: 'ph3', projectId: 'p1', stage: 'Execution', title: 'Coding', description: 'Desc 3', date: 'Mar 2024', order: 3 },
      { id: 'ph4', projectId: 'p1', stage: 'Testing', title: 'QA', description: 'Desc 4', date: 'Apr 2024', order: 4, evidentUrl: 'https://example.com' },
    ]
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockPhases
    })

    render(<ProjectLifecycleTracker projectId="p1" spineColor="bg-blue-500" />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Lifecycle...')).not.toBeInTheDocument()
    })
    
    expect(screen.getByText('Initial Plan')).toBeInTheDocument()
    expect(screen.getByText('Architecture')).toBeInTheDocument()
    expect(screen.getByText('Coding')).toBeInTheDocument()
    expect(screen.getByText('QA')).toBeInTheDocument()
    
    // Check if external link is rendered
    expect(screen.getByText('View Evidence')).toHaveAttribute('href', 'https://example.com')
  })

  it('handles hover states correctly', async () => {
    const mockPhases = [
      { id: 'ph1', projectId: 'p1', stage: 'Planning', title: 'Initial Plan', description: 'Desc 1', date: 'Jan 2024', order: 1 },
    ]
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockPhases
    })

    render(<ProjectLifecycleTracker projectId="p1" spineColor="bg-blue-500" />)
    
    await waitFor(() => {
      expect(screen.getByText('Initial Plan')).toBeInTheDocument()
    })
    
    const phaseContainer = screen.getByText('Initial Plan').parentElement?.parentElement as HTMLElement
    
    // Hover on
    fireEvent.mouseEnter(phaseContainer)
    expect(screen.getByText('Initial Plan')).toHaveClass('text-neu-text')
    
    // Hover off
    fireEvent.mouseLeave(phaseContainer)
    expect(screen.getByText('Initial Plan')).toHaveClass('text-neu-text-muted')
  })
})
