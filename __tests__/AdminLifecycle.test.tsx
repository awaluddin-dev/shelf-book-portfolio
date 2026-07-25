import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminLifecycle from '@/views/admin-lifecycle/ui/AdminLifecycle'
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

describe('AdminLifecycle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    const fakeToken = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))
    localStorage.setItem('token', 'header.' + fakeToken + '.sig')
    localStorage.setItem('isAdmin', 'true')

    global.fetch = jest.fn((url) => {
      if (url.includes('/api/lifecycle')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            data: [
              {
                id: 'l1',
                projectId: 'p1',
                stage: 'Planning & Spec',
                date: 'Jan 2026',
                title: 'Initial Architecture Design',
                description: 'Designed the core architecture.',
                evidentUrl: 'https://link-to-pdf.com',
                order: 1
              }
            ] 
          })
        } as any)
      }
      if (url.includes('/api/projects')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            data: [
              { id: 'p1', title: 'Test Project' }
            ]
          })
        } as any)
      }
      return Promise.reject(new Error('not mocked'))
    })
  })

  const renderComponent = () => render(
    <ThemeProvider>
      <AdminLifecycle />
    </ThemeProvider>
  )

  it('renders lifecycle data and project selector', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })
    
    // Select the project to see the linked items
    const projectSelect = screen.getByRole('combobox')
    fireEvent.change(projectSelect, { target: { value: 'p1' } })

    await waitFor(() => {
      expect(screen.getByText('Initial Architecture Design')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Planning & Spec')).toBeInTheDocument()
    expect(screen.getByText('Jan 2026')).toBeInTheDocument()
    expect(screen.getByText('Designed the core architecture.')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /View Evidence/i })).toHaveAttribute('href', 'https://link-to-pdf.com')
  })

  it('opens add form and fills fields', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    // Select the project
    const projectSelect = screen.getByRole('combobox')
    fireEvent.change(projectSelect, { target: { value: 'p1' } })

    // Click Add
    const addBtn = screen.getByRole('button', { name: /Add New Item/i })
    fireEvent.click(addBtn)

    // Form should be open
    expect(screen.getByText('Add New Item')).toBeInTheDocument()

    // Fill fields
    const titleInput = screen.getByPlaceholderText('Title (e.g. Initial Architecture Design)')
    fireEvent.change(titleInput, { target: { value: 'New Milestone' } })
    expect(screen.getByDisplayValue('New Milestone')).toBeInTheDocument()

    const urlInput = screen.getByPlaceholderText('Evidence URL (e.g. https://link-to-pdf.com) - Optional')
    fireEvent.change(urlInput, { target: { value: 'https://test.com' } })
    expect(screen.getByDisplayValue('https://test.com')).toBeInTheDocument()
  })
})
