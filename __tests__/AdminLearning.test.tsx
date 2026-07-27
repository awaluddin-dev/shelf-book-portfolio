import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminLearning from '@/pages/admin-learning/ui/AdminLearning'
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

describe('AdminLearning', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    const fakeToken = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))
    localStorage.setItem('token', 'header.' + fakeToken + '.sig')
    localStorage.setItem('isAdmin', 'true')

    global.fetch = jest.fn((url) => {
      if (url.toString().includes('/api/learning')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            data: { 
              roadmap: [
                {
                  id: 'l1',
                  tech: 'Agentic AI',
                  quarter: 'Q3 2026',
                  status: 'Planned',
                  icon: 'Terminal',
                  description: 'Learning AI',
                  depth: 'Intermediate',
                  topics: ['RAG'],
                  projects: ['AI App']
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
      <AdminLearning />
    </ThemeProvider>
  )

  it('renders learning data', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Agentic AI')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Q3 2026')).toBeInTheDocument()
    expect(screen.getByText('Intermediate')).toBeInTheDocument()
    expect(screen.getByText('Planned')).toBeInTheDocument()
  })

  it('opens add form and fills fields', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('Agentic AI')).toBeInTheDocument()
    })

    // Click Add
    const addBtn = screen.getByRole('button', { name: /Add Tech Goal/i })
    fireEvent.click(addBtn)

    // Form should be open
    expect(screen.getAllByText('Add Tech Goal')[0]).toBeInTheDocument()

    // Fill fields
    const techInput = screen.getByPlaceholderText('Agentic AI')
    fireEvent.change(techInput, { target: { value: 'New Tech' } })
    expect(screen.getByDisplayValue('New Tech')).toBeInTheDocument()
  })
})
