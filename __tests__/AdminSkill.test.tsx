import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminSkill from '@/views/admin-skill/ui/AdminSkill'
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

describe('AdminSkill', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    const fakeToken = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))
    localStorage.setItem('token', 'header.' + fakeToken + '.sig')
    localStorage.setItem('isAdmin', 'true')

    global.fetch = jest.fn((url) => {
      if (url.toString().includes('/api/skills')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            data: { 
              skills: [
                {
                  id: 's1',
                  title: 'React',
                  category: 'Frontend',
                  level: 'Advanced',
                  details: '5 years of exp',
                  x: 10,
                  y: 20,
                  connections: ['s2']
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
      <AdminSkill />
    </ThemeProvider>
  )

  it('renders skill data', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('Advanced')).toBeInTheDocument()
    expect(screen.getByText('x: 10, y: 20')).toBeInTheDocument()
  })

  it('opens add form and fills fields', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument()
    })

    // Click Add
    const addBtn = screen.getByRole('button', { name: /Add Skill Node/i })
    fireEvent.click(addBtn)

    // Form should be open
    expect(screen.getAllByText('Add Skill Node')[0]).toBeInTheDocument()

    // Fill fields
    const titleInput = screen.getByPlaceholderText('Node.js')
    fireEvent.change(titleInput, { target: { value: 'New Skill' } })
    expect(screen.getByDisplayValue('New Skill')).toBeInTheDocument()
    
    const xInput = screen.getAllByRole('spinbutton')[0]
    fireEvent.change(xInput, { target: { value: '15' } })
    expect(screen.getByDisplayValue('15')).toBeInTheDocument()
  })
})
