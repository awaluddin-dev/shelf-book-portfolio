import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import SkillTree from '@/entities/skill/ui/SkillTree'

// Mock framer-motion
jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react')
  return {
    ...actual,
    motion: {
      div: ({ children, className, 'data-testid': testId, onClick, onMouseEnter, onMouseLeave, style, animate, initial }: any) => (
        <div 
          className={className} 
          data-testid={testId} 
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={style}
          data-animate={JSON.stringify(animate)}
        >
          {children}
        </div>
      ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  }
})

// Mock P5Background since p5 has ESM issues in Jest
jest.mock('@/shared/ui/P5Background', () => {
  return function MockP5Background() {
    return <div data-testid="p5-background" />
  }
})

describe('SkillTree', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    // Setup window resize mock
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state when isLoading is true', () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ json: async () => ({}) })
    render(<SkillTree isDark={true} isLoading={true} />)
    
    // Just looking for the structure of the skeleton which has specific classes
    // We can query by role or just check for the animate-pulse class container
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('fetches and renders skill nodes correctly', async () => {
    const mockSkills = [
      { id: 'nodejs', title: 'Node.js', category: 'Core Backend', level: 'Production', x: 10, y: 10, details: 'Test desc', connections: ['typescript'] },
      { id: 'typescript', title: 'TypeScript', category: 'Core Backend', level: 'Production', x: 20, y: 20, details: 'TS desc', connections: '["nodejs"]' }
    ]
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ data: { skills: mockSkills } })
    })

    render(<SkillTree isDark={true} />)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/skills')
      expect(screen.getByText('Node.js')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })
  })

  it('handles mobile resize', async () => {
    const mockSkills = [
      { id: 'nodejs', title: 'Node.js', category: 'Core Backend', level: 'Production', x: 10, y: 10, details: 'Test desc', connections: [] },
    ]
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockSkills
    })

    render(<SkillTree isDark={true} />)
    
    await waitFor(() => {
      expect(screen.getByText('Node.js')).toBeInTheDocument()
    })

    // Trigger resize to mobile
    Object.defineProperty(window, 'innerWidth', { value: 500 })
    fireEvent(window, new Event('resize'))
    
    // Re-render essentially triggers checkMobile which uses the new width
    // Verify it doesn't crash on mobile resize and remains in document
    await waitFor(() => {
      expect(screen.getByText('Node.js')).toHaveClass('text-[14px]')
    })
  })

  it('handles node hover interactions', async () => {
    const mockSkills = [
      { id: 'nodejs', title: 'Node.js', category: 'Core Backend', level: 'Production', x: 10, y: 10, details: 'Test desc', connections: ['typescript'] },
      { id: 'typescript', title: 'TypeScript', category: 'Core Backend', level: 'Production', x: 20, y: 20, details: 'TS desc', connections: ['nodejs'] },
      { id: 'go', title: 'Go', category: 'Core Backend', level: 'Production', x: 30, y: 30, details: 'Go desc', connections: [] }
    ]
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockSkills
    })

    render(<SkillTree isDark={true} />)
    
    await waitFor(() => {
      expect(screen.getByText('Node.js')).toBeInTheDocument()
    })
    
    // Find the 'g' element that represents the node
    const nodeText = screen.getByText('Node.js')
    const nodeGroup = nodeText.parentElement as HTMLElement
    
    // Hover on Node.js
    fireEvent.mouseEnter(nodeGroup)
    
    // Since nodejs connects to typescript, typescript should be active
    const tsText = screen.getByText('TypeScript')
    // and 'go' should be inactive
    const goText = screen.getByText('Go')
    
    // 'Node.js' and 'TypeScript' should NOT have opacity-30, but 'Go' SHOULD have opacity-30
    await waitFor(() => {
      expect(tsText).not.toHaveClass('opacity-30')
      expect(goText).toHaveClass('opacity-30')
    })
  })
})
