import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminProficiency from '@/views/admin-proficiency/ui/AdminProficiency'
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

describe('AdminProficiency', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    const fakeToken = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))
    localStorage.setItem('token', 'header.' + fakeToken + '.sig')
    localStorage.setItem('isAdmin', 'true')

    global.fetch = jest.fn((url) => {
      if (url.toString().includes('/api/proficiency') || url.toString().includes('/api/v2/proficiency')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            data: {
              pillars: [
                {
                  id: 'pr1',
                  pillarNumber: '01',
                  title: 'Core Backend',
                  description: 'Backend desc',
                  icon: 'Server',
                  skills: [
                    { id: 's1', name: 'Node.js', status: 'PROD' }
                  ]
                }
              ]
            } 
          })
        } as any)
      }
      return Promise.reject(new Error('not mocked: ' + url.toString()))
    })
  })

  const renderComponent = () => render(
    <ThemeProvider>
      <AdminProficiency />
    </ThemeProvider>
  )

  it('renders proficiency data', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Core Backend')).toBeInTheDocument()
    })
    
    expect(screen.getByText(/1 skills/i)).toBeInTheDocument()
  })

  it('opens add form, adds and removes skills', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('Core Backend')).toBeInTheDocument()
    })

    // Click Add
    const addBtn = screen.getByRole('button', { name: /Add Pillar/i })
    fireEvent.click(addBtn)

    // Form should be open
    expect(screen.getAllByText(/Add Pillar/i)[0]).toBeInTheDocument()

    // Title field
    const titleInput = screen.getByPlaceholderText(/Core Backend/i)
    fireEvent.change(titleInput, { target: { value: 'Frontend' } })
    expect(screen.getByDisplayValue('Frontend')).toBeInTheDocument()

    // Add Skill
    const addSkillBtn = screen.getByRole('button', { name: /Add Skill/i })
    fireEvent.click(addSkillBtn)

    // Skill inputs should appear
    const skillNameInput = screen.getByPlaceholderText('e.g. Go (Golang)')
    fireEvent.change(skillNameInput, { target: { value: 'React' } })
    expect(screen.getByDisplayValue('React')).toBeInTheDocument()

    const statusSelect = screen.getAllByRole('combobox').pop()!
    fireEvent.change(statusSelect, { target: { value: 'R&D' } })
    expect(screen.getByDisplayValue('R&D')).toBeInTheDocument()

    // Remove skill
    const removeBtn = document.querySelector('.bg-red-500') as HTMLButtonElement
    fireEvent.click(removeBtn)

    // Wait for remove to take effect
    await waitFor(() => {
      expect(screen.queryByDisplayValue('React')).not.toBeInTheDocument()
    })
  })
})
