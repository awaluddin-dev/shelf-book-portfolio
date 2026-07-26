import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminDashboard from '@/views/admin-dashboard/ui/AdminDashboard'
import { ThemeProvider } from 'next-themes'

// Mock subcomponents
jest.mock('@/shared/ui/admin/AdminSidebar', () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar" />
}))
jest.mock('@/shared/ui/admin/AdminPageSkeleton', () => ({
  AdminPageSkeleton: () => <div data-testid="admin-skeleton" />
}))
jest.mock('@/shared/ui/Loader', () => ({
  Loader: ({ text }: any) => <div data-testid="loader">{text}</div>
}))

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    
    // Set admin token
    const fakeToken = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))
    localStorage.setItem('token', 'header.' + fakeToken + '.sig')
    localStorage.setItem('isAdmin', 'true')

    global.fetch = jest.fn((url) => {
      if (url.toString().includes('/api/status')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: { status: 'available' } })
        } as any)
      }
      if (url.toString().includes('/api/testimonials')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ status: 'pending' }, { status: 'approved' }] })
        } as any)
      }
      if (url.toString().includes('/api/hero')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            data: { 
              heroConfig: { name: 'Admin', role: 'Dev', openForWork: true, availableFrom: 'Now' },
              metrics: [{ id: 'm1', label: 'metric1', value: '1', icon: 'Code2', isSavings: false }]
            } 
          })
        } as any)
      }
      return Promise.reject(new Error('not mocked'))
    })
  })

  const renderComponent = () => render(
    <ThemeProvider>
      <AdminDashboard />
    </ThemeProvider>
  )

  it('redirects to login if not authenticated', () => {
    localStorage.clear()
    renderComponent()
    expect(mockPush).toHaveBeenCalledWith('/admin/login')
  })

  it('renders loading state and then data', async () => {
    renderComponent()
    
    // Initial skeleton
    expect(screen.getByTestId('admin-skeleton')).toBeInTheDocument()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('admin-skeleton')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Admin')).toBeInTheDocument() // Check hero name input
    expect(screen.getByDisplayValue('Dev')).toBeInTheDocument() // Check hero role input
  })

  it('allows adding and removing metrics', async () => {
    renderComponent()
    
    await waitFor(() => expect(screen.queryByTestId('admin-skeleton')).not.toBeInTheDocument())

    const addMetricBtn = screen.getByRole('button', { name: /Add Metric/i })
    fireEvent.click(addMetricBtn)

    // Should now have 2 metrics
    const deleteBtns = screen.getAllByRole('button', { name: '' }).filter(btn => btn.querySelector('svg.lucide-trash-2'))
    expect(deleteBtns).toHaveLength(2)

    // Remove the first metric
    fireEvent.click(deleteBtns[0])

    const deleteBtnsAfter = screen.getAllByRole('button', { name: '' }).filter(btn => btn.querySelector('svg.lucide-trash-2'))
    expect(deleteBtnsAfter).toHaveLength(1)
  })

  it('saves hero config and shows toast', async () => {
    renderComponent()
    
    await waitFor(() => expect(screen.queryByTestId('admin-skeleton')).not.toBeInTheDocument())

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i })
    
    // Mock save response
    ;(global.fetch as jest.Mock).mockImplementationOnce((url) => {
      if (url.toString().includes('/api/hero')) {
        return Promise.resolve({ ok: true } as any)
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as any)
    })

    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(screen.getByText('Hero Section updated successfully')).toBeInTheDocument()
    })
  })
})
