import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminProjects from '@/views/admin-projects/ui/AdminProjects'
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
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('AdminProjects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    const fakeToken = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))
    localStorage.setItem('token', 'header.' + fakeToken + '.sig')
    localStorage.setItem('isAdmin', 'true')

    global.fetch = jest.fn((url) => {
      if (url.includes('/api/projects')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            data: { 
              projects: [
                {
                  id: 'p1',
                  title: 'Test Project',
                  subtitle: 'A test subtitle',
                  category: 'Testing',
                  date: '2023-01-01',
                  tags: ['React', 'Jest'],
                  stats: [],
                  phases: []
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
      <AdminProjects />
    </ThemeProvider>
  )

  it('renders projects data', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })
    
    expect(screen.getByText('A test subtitle')).toBeInTheDocument()
    expect(screen.getByText('Testing')).toBeInTheDocument()
  })

  it('opens add form and interacts with dynamic fields', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    // Click Add New
    const addBtn = screen.getByRole('button', { name: /Add Project/i })
    fireEvent.click(addBtn)

    // Form should be open
    expect(screen.getByText('Add Project')).toBeInTheDocument()

    // Add Stat
    const addStatBtn = screen.getByRole('button', { name: /Add Stat/i })
    fireEvent.click(addStatBtn)
    
    // Fill stat
    const statLabelInputs = screen.getAllByPlaceholderText('Label')
    fireEvent.change(statLabelInputs[0], { target: { value: 'Users' } })
    
    // Add Phase
    const addPhaseBtn = screen.getByRole('button', { name: /Add Phase/i })
    fireEvent.click(addPhaseBtn)

    // Fill phase
    const phaseTitleInputs = screen.getAllByPlaceholderText('Title')
    fireEvent.change(phaseTitleInputs[0], { target: { value: 'Design Phase' } })
    
    expect(screen.getByDisplayValue('Users')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Design Phase')).toBeInTheDocument()
    
    // Remove Stat
    const trashBtns = screen.getAllByRole('button').filter(btn => btn.querySelector('svg.lucide-trash-2'))
    // 1 stat trash btn + 1 phase trash btn = 2
    fireEvent.click(trashBtns[0]) // delete stat

    await waitFor(() => {
      expect(screen.queryByDisplayValue('Users')).not.toBeInTheDocument()
    })
  })
})
