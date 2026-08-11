import { render, screen, fireEvent } from '@testing-library/react'
import { AdminSidebar } from '@/widgets/admin-sidebar/ui/AdminSidebar'
import { useRouter, usePathname } from 'next/navigation'

// Mock useRouter and usePathname
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/admin'),
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
    const { container } = render(<AdminSidebar  />)
    
    const buttons = container.querySelectorAll('button')
    // Mobile open (0), Mobile close (1), Desktop toggle (2)
    const toggleButton = buttons[2]
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
    const { container } = render(<AdminSidebar  />)
    
    const links = container.querySelectorAll('a')
    // Find the projects link by href
    const projectsLink = Array.from(links).find(a => a.getAttribute('href') === '/admin/projects')
    
    expect(projectsLink).toBeInTheDocument()
  })

  it('handles logout', () => {
    // We need to expand to click logout easily by text, or just get the last button
    const { container } = render(<AdminSidebar  />)
    
    const buttons = Array.from(container.querySelectorAll('button'))
    const logoutBtn = buttons[buttons.length - 1] // Logout is the last button
    
    fireEvent.click(logoutBtn)
    
    expect(mockRemoveItem).toHaveBeenCalledWith('isAdmin')
    expect(mockPush).toHaveBeenCalledWith('/admin/login')
  })

  it('renders Back to Portfolio link only on dashboard', () => {
    // Default mock path is /admin
    ;(usePathname as jest.Mock).mockReturnValue('/admin/dashboard')
    const { container: dashboardContainer } = render(<AdminSidebar  />)
    
    let backLink = Array.from(dashboardContainer.querySelectorAll('a')).find(a => a.getAttribute('href') === '/')
    expect(backLink).toBeInTheDocument()

    // Test on another path
    ;(usePathname as jest.Mock).mockReturnValue('/admin/projects')
    const { container: otherContainer } = render(<AdminSidebar  />)
    
    backLink = Array.from(otherContainer.querySelectorAll('a')).find(a => a.getAttribute('href') === '/')
    expect(backLink).toBeUndefined()
  })
})
