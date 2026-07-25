import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminCurrent from '@/views/admin-current/ui/AdminCurrent'
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

describe('AdminCurrent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    const fakeToken = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))
    localStorage.setItem('token', 'header.' + fakeToken + '.sig')
    localStorage.setItem('isAdmin', 'true')

    global.fetch = jest.fn((url) => {
      if (url.includes('/api/current')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            data: { 
              currentFocus: [
                {
                  id: 'c1',
                  title: 'Writing',
                  icon: 'PenTool',
                  description: 'Writing tech articles.',
                  link: 'https://dev.to',
                  linkText: 'Read on dev.to'
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
      <AdminCurrent />
    </ThemeProvider>
  )

  it('renders current focus data', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Writing')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Writing tech articles.')).toBeInTheDocument()
    expect(screen.getByText('Read on dev.to')).toBeInTheDocument()
    expect(screen.getByText('https://dev.to')).toBeInTheDocument()
  })

  it('opens add form and fills fields', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('Writing')).toBeInTheDocument()
    })

    // Click Add
    const addBtn = screen.getByRole('button', { name: /Add Focus Item/i })
    fireEvent.click(addBtn)

    // Form should be open
    expect(screen.getByText('Add Focus Item')).toBeInTheDocument()

    // Fill fields
    const titleInput = screen.getByPlaceholderText('Writing')
    fireEvent.change(titleInput, { target: { value: 'Coding' } })
    expect(screen.getByDisplayValue('Coding')).toBeInTheDocument()
  })
})
