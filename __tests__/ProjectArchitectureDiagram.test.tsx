import { render, screen, fireEvent } from '@testing-library/react'
import ProjectArchitectureDiagram from '@/entities/project/ui/ProjectArchitectureDiagram'

// Mock react-zoom-pan-pinch
jest.mock('react-zoom-pan-pinch', () => ({
  TransformWrapper: ({ children }: any) => <div data-testid="transform-wrapper">{children}</div>,
  TransformComponent: ({ children }: any) => <div data-testid="transform-component">{children}</div>,
  useControls: () => ({
    zoomIn: jest.fn(),
    zoomOut: jest.fn(),
    resetTransform: jest.fn(),
  }),
}))

// Mock framer-motion
jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react')
  return {
    ...actual,
    motion: {
      div: ({ children, className, 'data-testid': testId, onClick, onMouseEnter, onMouseLeave, style, onKeyDown }: any) => (
        <div 
          className={className} 
          data-testid={testId} 
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onKeyDown={onKeyDown}
          style={style}
        >
          {children}
        </div>
      ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  }
})

describe('ProjectArchitectureDiagram', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders image view when imageUrl is provided', () => {
    render(<ProjectArchitectureDiagram imageUrl="/test-img.png" />)
    
    expect(screen.getByAltText('Architecture Diagram')).toBeInTheDocument()
    // Fullscreen button
    expect(screen.getByTitle('Open Fullscreen')).toBeInTheDocument()
  })

  it('opens and closes fullscreen viewer', () => {
    render(<ProjectArchitectureDiagram imageUrl="/test-img.png" />)
    
    const fullscreenBtn = screen.getByTitle('Open Fullscreen')
    fireEvent.click(fullscreenBtn)
    
    // Check if fullscreen header is visible
    expect(screen.getByText(/Drag to pan/)).toBeInTheDocument()
    
    // Close fullscreen by simulating escape key
    // The fixed overlay has an onKeyDown handler
    const overlay = screen.getByText(/Drag to pan/).parentElement?.parentElement as HTMLElement
    fireEvent.keyDown(overlay, { key: 'Escape' })
    
    expect(screen.queryByText(/Drag to pan/)).not.toBeInTheDocument()
  })

  it('renders nothing when no imageUrl is provided', () => {
    const { container } = render(<ProjectArchitectureDiagram imageUrl="" />)
    expect(container.firstChild).toBeNull()
  })
})
