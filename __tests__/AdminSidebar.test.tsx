import { render, screen, fireEvent } from '@testing-library/react'
import { AdminSidebar } from '@/widgets/admin-sidebar/ui/AdminSidebar'
import { useRouter } from 'next/navigation'

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock motion to render normally without animations in tests
jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react')
  return {
    ...actual,
    motion: {
      aside: ({ children, className, 'data-testid': testId, ...rest }: any) => (
        <aside className={className} data-testid={testId} {...rest}>{children}</aside>
      ),
      span: ({ children, className, 'data-testid': testId, ...rest }: any) => (
        <span className={className} data-testid={testId} {...rest}>{children}</span>
      ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  }
})

describe('AdminSidebar', () => {
  let mockPush: jest.Mock
  let mockRemoveItem: jest.Mock

  beforeEach(() => {
    mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    
    mockRemoveItem = jest.fn()
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: mockRemoveItem,
      },
      writable: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders collapse/expand button', () => {
    // Before expansion, the span with 'Collapse' text should not be visible (handled by AnimatePresence mock conditionally rendering)
    // Wait, AnimatePresence mock just renders children, so the component's internal state determines if it renders.
    const { container } = render(<AdminSidebar activePath="/admin/dashboard" />)
    
    const toggleButton = container.querySelector('button')
    expect(toggleButton).toBeInTheDocument()
    
    // Default is collapsed, so 'Collapse' text shouldn't be there
    expect(screen.queryByText('Collapse')).not.toBeInTheDocument()
    
    // Click toggle
    if (toggleButton) {
      fireEvent.click(toggleButton)
    }
    
    // Now it should be expanded
    expect(screen.getByText('Collapse')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument() // nav item labels appear
  })

  it('navigates to different paths on nav item click', () => {
    const { container } = render(<AdminSidebar activePath="/admin/dashboard" />)
    
    // Dashboard is the first link after toggle
    const buttons = container.querySelectorAll('button')
    // buttons[0] is toggle, buttons[1] is Dashboard, buttons[2] is Projects, etc.
    const projectsBtn = buttons[2]
    
    fireEvent.click(projectsBtn)
    
    expect(mockPush).toHaveBeenCalledWith('/admin/projects')
  })

  it('handles logout', () => {
    // We need to expand to click logout easily by text, or just get the last button
    const { container } = render(<AdminSidebar activePath="/admin/dashboard" />)
    
    const buttons = Array.from(container.querySelectorAll('button'))
    const logoutBtn = buttons[buttons.length - 1] // Logout is the last button
    
    fireEvent.click(logoutBtn)
    
    expect(mockRemoveItem).toHaveBeenCalledWith('isAdmin')
    expect(mockPush).toHaveBeenCalledWith('/admin/login')
  })

  it('renders Back to Portfolio button only on dashboard', () => {
    const { container: dashboardContainer } = render(<AdminSidebar activePath="/admin/dashboard" />)
    
    // We can't find by text easily if collapsed, but it's the second to last button when on dashboard
    let buttons = Array.from(dashboardContainer.querySelectorAll('button'))
    let backBtn = buttons[buttons.length - 2]
    
    fireEvent.click(backBtn)
    expect(mockPush).toHaveBeenCalledWith('/')

    // Test on another path
    mockPush.mockClear()
    const { container: otherContainer } = render(<AdminSidebar activePath="/admin/projects" />)
    
    // If we click the second to last button here, it should be the last nav item, not Back to Portfolio
    buttons = Array.from(otherContainer.querySelectorAll('button'))
    backBtn = buttons[buttons.length - 2]
    
    fireEvent.click(backBtn)
    expect(mockPush).not.toHaveBeenCalledWith('/')
  })
})
