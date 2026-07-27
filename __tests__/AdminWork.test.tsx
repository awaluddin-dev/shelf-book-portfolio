import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminWork from '@/pages/admin-work/ui/AdminWork'
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

describe('AdminWork', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    const fakeToken = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))
    localStorage.setItem('token', 'header.' + fakeToken + '.sig')
    localStorage.setItem('isAdmin', 'true')

    global.fetch = jest.fn((url) => {
      if (url.toString().includes('/api/work')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            data: { 
              workExperience: [
                {
                  id: 'w1',
                  company: 'Acme Corp',
                  role: 'Senior Engineer',
                  years: '2022 - Present',
                  duration: '2 yrs',
                  stack: 'React, Node.js',
                  teaser: 'A short teaser',
                  fullImpact: 'A full impact',
                  bullets: ['Bullet 1', 'Bullet 2']
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
      <AdminWork />
    </ThemeProvider>
  )

  it('renders work experience data', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Senior Engineer')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('2022 - Present')).toBeInTheDocument()
  })

  it('opens add form and fills fields', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('Senior Engineer')).toBeInTheDocument()
    })

    // Click Add
    const addBtn = screen.getByRole('button', { name: /Add Experience/i })
    fireEvent.click(addBtn)

    // Form should be open
    expect(screen.getAllByText('Add Experience')[0]).toBeInTheDocument()

    // Fill fields
    const companyInput = screen.getByPlaceholderText('e.g. Acme Corp')
    fireEvent.change(companyInput, { target: { value: 'New Company' } })
    expect(screen.getByDisplayValue('New Company')).toBeInTheDocument()
  })

  it('opens and closes view detail modal', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('Senior Engineer')).toBeInTheDocument()
    })

    const viewBtn = screen.getByTitle('View Detail')
    fireEvent.click(viewBtn)

    expect(screen.getByText('Work Experience Detail')).toBeInTheDocument()
    expect(screen.getByText('Senior Engineer at Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Bullet 1')).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: /Close/i })
    fireEvent.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByText('Work Experience Detail')).not.toBeInTheDocument()
    })
  })
})
