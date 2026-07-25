import { render, screen, waitFor, fireEvent } from '@testing-library/react'
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
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders image view when architectureImage is provided', () => {
    const project = { id: 'p1', architectureImage: '/test-img.png' }
    
    render(<ProjectArchitectureDiagram project={project} isDark={true} />)
    
    expect(screen.getByAltText('Architecture Diagram')).toBeInTheDocument()
    expect(screen.getByText('Excalidraw Export')).toBeInTheDocument()
    // Fullscreen button
    expect(screen.getByTitle('Open Fullscreen')).toBeInTheDocument()
    // It does not fetch nodes
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('opens and closes fullscreen viewer', () => {
    const project = { id: 'p1', architectureImage: '/test-img.png' }
    
    render(<ProjectArchitectureDiagram project={project} isDark={true} />)
    
    const fullscreenBtn = screen.getByTitle('Open Fullscreen')
    fireEvent.click(fullscreenBtn)
    
    // Check if fullscreen header is visible
    expect(screen.getByText('Drag to pan • Scroll / Pinch to zoom • Click outside to close')).toBeInTheDocument()
    
    // Close fullscreen by simulating escape key
    // The fixed overlay has an onKeyDown handler
    const overlay = screen.getByText('Drag to pan • Scroll / Pinch to zoom • Click outside to close').parentElement?.parentElement as HTMLElement
    fireEvent.keyDown(overlay, { key: 'Escape' })
    
    expect(screen.queryByText('Drag to pan • Scroll / Pinch to zoom • Click outside to close')).not.toBeInTheDocument()
  })

  it('fetches and renders node view when architectureImage is not provided', async () => {
    const project = { id: 'p2' }
    const mockNodes = [
      { id: 'n1', projectId: 'p2', order: 1, name: 'Node 1', title: 'Test Title 1', description: 'Desc 1', metrics: '100ms' }
    ]
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ data: mockNodes })
    })

    render(<ProjectArchitectureDiagram project={project} isDark={true} />)
    
    // Initially shows loading
    expect(screen.getByText('Loading Architecture...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Architecture...')).not.toBeInTheDocument()
    })
    
    expect(global.fetch).toHaveBeenCalledWith('/api/architecture')
    expect(screen.getByText('Node 1')).toBeInTheDocument()
    expect(screen.getByText('Hover over any component node to inspect technical metrics.')).toBeInTheDocument()
  })

  it('handles node hover interactions', async () => {
    const project = { id: 'p2' }
    const mockNodes = [
      { id: 'n1', projectId: 'p2', order: 1, name: 'Node 1', title: 'Test Title 1', description: 'Desc 1', metrics: '100ms' }
    ]
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockNodes // checking the non-data wrapper array logic
    })

    const { container } = render(<ProjectArchitectureDiagram project={project} isDark={true} />)
    
    await waitFor(() => {
      expect(screen.getByText('Node 1')).toBeInTheDocument()
    })
    
    const nodeElement = screen.getByText('Node 1').parentElement as HTMLElement
    
    fireEvent.mouseEnter(nodeElement)
    
    expect(screen.getByText('Node: Node 1')).toBeInTheDocument()
    expect(screen.getByText('Desc 1')).toBeInTheDocument()
    expect(screen.getByText('100ms')).toBeInTheDocument()
    
    fireEvent.mouseLeave(nodeElement)
    expect(screen.getByText('Hover over any component node to inspect technical metrics.')).toBeInTheDocument()
  })

  it('renders empty state when no nodes and no image', async () => {
    const project = { id: 'p3' }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => []
    })

    render(<ProjectArchitectureDiagram project={project} isDark={true} />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading Architecture...')).not.toBeInTheDocument()
    })
    
    expect(screen.getByText(/No architecture diagram defined for this project/i)).toBeInTheDocument()
  })
})
