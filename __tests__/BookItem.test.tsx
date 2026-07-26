import { render, screen, fireEvent } from '@testing-library/react'
import BookItem from '@/entities/project/ui/BookItem'
import { Project } from '@/shared/types'

// Mock framer-motion
jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react')
  return {
    ...actual,
    motion: {
      div: ({ children, className, 'data-testid': testId, onClick, onMouseMove, onMouseLeave, style }: any) => (
        <div 
          className={className} 
          data-testid={testId} 
          onClick={onClick}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={style}
        >
          {children}
        </div>
      ),
    },
    useMotionValue: () => ({ set: jest.fn(), get: jest.fn() }),
    useTransform: () => ({}),
  }
})

describe('BookItem', () => {
  const mockProject: any = {
    id: 'test-1',
    title: 'Test Project',
    subtitle: 'A test project',
    date: '2024',
    tags: ['React'],
    spineText: 'Test Project Spine',
    spineColor: 'bg-blue-500' // tailwind class
  }

  const mockProjectWithHexColor: Project = {
    ...mockProject,
    id: 'test-2',
    spineColor: '#123456'
  }

  const mockSetSelectedProject = jest.fn()
  const mockSetFocusedProject = jest.fn()
  const mockGetTagProjectCount = jest.fn()

  const defaultProps = {
    project: mockProject,
    setSelectedProject: mockSetSelectedProject,
    setFocusedProject: mockSetFocusedProject,
    isDark: true,
    getTagProjectCount: mockGetTagProjectCount,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock getBoundingClientRect for mouse move calculations
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 200,
      top: 10,
      left: 10,
      bottom: 210,
      right: 110,
      x: 10,
      y: 10,
      toJSON: () => {}
    }))
  })

  it('renders correctly with tailwind color class', () => {
    render(<BookItem {...defaultProps} />)
    
    expect(screen.getByText('Test Project Spine')).toBeInTheDocument()
    
    // Check if the tailwind class is applied
    const spineContainer = screen.getByText('Test Project Spine').parentElement?.parentElement
    expect(spineContainer).toHaveClass('bg-blue-500')
  })

  it('renders correctly with hex color', () => {
    render(<BookItem {...defaultProps} project={mockProjectWithHexColor} />)
    
    const spineContainer = screen.getByText('Test Project Spine').parentElement?.parentElement
    expect(spineContainer).toHaveStyle({ backgroundColor: '#123456' })
    expect(spineContainer).not.toHaveClass('#123456') // hex should not be added as class
  })

  it('calls setFocusedProject on click', () => {
    const { container } = render(<BookItem {...defaultProps} />)
    
    // The outermost motion.div has the onClick handler
    const outerDiv = container.firstChild as HTMLElement
    fireEvent.click(outerDiv)
    
    expect(mockSetFocusedProject).toHaveBeenCalledWith(mockProject)
  })

  it('handles mouse move and leave for 3D effect', () => {
    const { container } = render(<BookItem {...defaultProps} />)
    
    // The inner motion.div has the mouse handlers
    const innerDiv = container.firstChild?.firstChild as HTMLElement
    
    // Just verifying it doesn't crash, since motion values are mocked
    fireEvent.mouseMove(innerDiv, { clientX: 50, clientY: 50 })
    fireEvent.mouseLeave(innerDiv)
    expect(innerDiv).toBeDefined()
  })
})
