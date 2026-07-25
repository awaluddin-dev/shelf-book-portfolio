import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminTestimoni from '@/views/admin-testimoni/ui/AdminTestimoni'
import { ThemeProvider } from '@/shared/ui/ThemeProvider'

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('AdminTestimoni', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    const fakeToken = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))
    localStorage.setItem('token', 'header.' + fakeToken + '.sig')
    localStorage.setItem('isAdmin', 'true')

    global.fetch = jest.fn((url, options) => {
      if (url.includes('/api/status')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: { status: 'available' } })
        } as any)
      }
      if (url.includes('/api/testimonials')) {
        if (options && options.method === 'PATCH') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true })
          } as any)
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            data: { 
              testimonials: [
                {
                  id: 't1',
                  name: 'John Doe',
                  role: 'CEO',
                  company: 'Example Inc',
                  testimonial: 'Great work!',
                  status: 'pending'
                },
                {
                  id: 't2',
                  name: 'Jane Smith',
                  role: 'CTO',
                  company: 'Tech Corp',
                  testimonial: 'Amazing!',
                  status: 'accepted'
                }
              ] 
            } 
          })
        } as any)
      }
      return Promise.reject(new Error('not mocked'))
    })
  })

  const renderComponent = () => render(
    <ThemeProvider>
      <AdminTestimoni />
    </ThemeProvider>
  )

  it('renders testimonials data', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('CEO @ Example Inc')).toBeInTheDocument()
    expect(screen.getByText('CTO @ Tech Corp')).toBeInTheDocument()
  })

  it('allows accepting a pending testimonial', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const acceptBtns = screen.getAllByTitle('Accept')
    expect(acceptBtns.length).toBeGreaterThan(0)
    
    fireEvent.click(acceptBtns[0])

    await waitFor(() => {
      expect(screen.getByText('Testimonial successfully accepted')).toBeInTheDocument()
    })
  })

  it('allows rejecting a pending testimonial from the modal', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Click on row to open modal
    fireEvent.click(screen.getByText('John Doe'))

    await waitFor(() => {
      expect(screen.getByText('"Great work!"')).toBeInTheDocument()
    })

    const rejectBtn = screen.getByText('Reject')
    fireEvent.click(rejectBtn)

    await waitFor(() => {
      expect(screen.getByText('Testimonial successfully rejected')).toBeInTheDocument()
    })
  })
})
