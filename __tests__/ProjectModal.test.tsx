import { render, screen, fireEvent } from '@testing-library/react'
import ProjectModal from '@/views/home/ui/components/ProjectModal'

// Mock dependencies
jest.mock('react-markdown', () => (props: any) => <div data-testid="react-markdown">{props.children}</div>)
jest.mock('@/shared/ui/MermaidDiagram', () => () => <div data-testid="mermaid-diagram" />)
jest.mock('@/entities/project/ui/ProjectLifecycleTracker', () => () => <div data-testid="project-lifecycle-tracker" />)
jest.mock('@/entities/project/ui/ProjectArchitectureDiagram', () => () => <div data-testid="project-architecture-diagram" />)

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, onClick, onKeyDown }: any) => (
      <div className={className} onClick={onClick} onKeyDown={onKeyDown} data-testid="motion-div">
        {children}
      </div>
    ),
    h2: ({ children, className }: any) => (
      <h2 className={className}>{children}</h2>
    )
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}))

describe('ProjectModal', () => {
  const mockOnClose = jest.fn()
  const mockOnPrevProject = jest.fn()
  const mockOnNextProject = jest.fn()
  const mockOnSelectProject = jest.fn()
  const mockSetIsBannerMinimized = jest.fn()
  const mockGetRelatedProjects = jest.fn(() => [{
    id: '2',
    title: 'Related Project',
    subtitle: 'Subtitle',
    category: 'Related',
    spineColor: 'bg-blue-500'
  }])
  const mockGetTechIconAndColor = jest.fn(() => ({ color: 'bg-red-500', icon: <span>Icon</span> }))
  const mockGetTagProjectCount = jest.fn(() => 2)

  const defaultProps = {
    selectedProject: {
      id: '1',
      title: 'Main Project',
      subtitle: 'Main Subtitle',
      category: 'Main Category',
      date: '2024',
      coverColor: 'bg-red-500',
      spineColor: 'bg-red-700',
      tags: ['React'],
      stats: [{ label: 'Users', value: '1M' }],
      demoUrl: 'https://demo.com',
      github: 'https://github.com',
      reasonToBuild: 'Reason',
      problemSolved: 'Problem',
      markdown: '# Specs'
    },
    onClose: mockOnClose,
    onPrevProject: mockOnPrevProject,
    onNextProject: mockOnNextProject,
    onSelectProject: mockOnSelectProject,
    isBannerMinimized: false,
    setIsBannerMinimized: mockSetIsBannerMinimized,
    isDark: true,
    getRelatedProjects: mockGetRelatedProjects,
    getTechIconAndColor: mockGetTechIconAndColor,
    getTagProjectCount: mockGetTagProjectCount,
    TECHNICAL_IMAGERY: { '1': { featured: 'image.jpg' } }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when selectedProject is null', () => {
    render(<ProjectModal {...defaultProps} selectedProject={null} />)
    expect(screen.queryByText('Main Project')).not.toBeInTheDocument()
  })

  it('renders project details correctly', () => {
    render(<ProjectModal {...defaultProps} />)
    
    expect(screen.getByText('Main Project')).toBeInTheDocument()
    expect(screen.getByText('Main Subtitle')).toBeInTheDocument()
    expect(screen.getByText('Main Category')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('Reason')).toBeInTheDocument()
    expect(screen.getByText('Problem')).toBeInTheDocument()
    expect(screen.getByText('1M')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('# Specs')).toBeInTheDocument()
  })

  it('renders links if provided', () => {
    render(<ProjectModal {...defaultProps} />)
    const demoLink = screen.getByText('View Live Demo').closest('a')
    const githubLink = screen.getByText('Source Code').closest('a')
    
    expect(demoLink).toHaveAttribute('href', 'https://demo.com')
    expect(githubLink).toHaveAttribute('href', 'https://github.com')
  })

  it('calls onClose when background is clicked', () => {
    render(<ProjectModal {...defaultProps} />)
    // First motion div is the backdrop
    const backdrop = screen.getAllByTestId('motion-div')[0]
    fireEvent.click(backdrop)
    expect(mockOnClose).toHaveBeenCalled()
  })
  
  it('calls onClose when close button is clicked', () => {
    render(<ProjectModal {...defaultProps} />)
    const closeBtn = screen.getByTitle('Close')
    fireEvent.click(closeBtn)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onPrevProject and onNextProject', () => {
    render(<ProjectModal {...defaultProps} />)
    const prevBtn = screen.getByTitle('Previous Volume (Left Arrow)')
    const nextBtn = screen.getByTitle('Next Volume (Right Arrow)')
    
    fireEvent.click(prevBtn)
    expect(mockOnPrevProject).toHaveBeenCalled()
    
    fireEvent.click(nextBtn)
    expect(mockOnNextProject).toHaveBeenCalled()
  })

  it('renders related projects and handles selection', () => {
    render(<ProjectModal {...defaultProps} />)
    
    expect(screen.getAllByText('Related Project')[0]).toBeInTheDocument()
    
    const relatedProjectCard = screen.getAllByText('Related Project')[0].closest('div[role="button"]')
    
    fireEvent.click(relatedProjectCard!)
    expect(mockOnSelectProject).toHaveBeenCalledWith(mockGetRelatedProjects()[0])
  })

  it('handles escape key to close', () => {
    render(<ProjectModal {...defaultProps} />)
    const backdrop = screen.getAllByTestId('motion-div')[0]
    fireEvent.keyDown(backdrop, { key: 'Escape', code: 'Escape' })
    expect(mockOnClose).toHaveBeenCalled()
  })
})
