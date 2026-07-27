import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminArchitecture from '@/pages/admin-architecture/ui/AdminArchitecture'
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

describe('AdminArchitecture', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    const fakeToken = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))
    localStorage.setItem('token', 'header.' + fakeToken + '.sig')
    localStorage.setItem('isAdmin', 'true')

    global.fetch = jest.fn((url) => {
      if (url.toString().includes('/api/architecture')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            data: [
              {
                id: 'a1',
                projectId: 'p1',
                name: 'gateway',
                title: 'NestJS Gateway',
                description: 'API Gateway component.',
                metrics: 'Response: <12ms',
                order: 0
              }
            ] 
          })
        } as any)
      }
      if (url.toString().includes('/api/projects')) {
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
      <AdminArchitecture />
    </ThemeProvider>
  )

  it('renders architecture data and project selector', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })
    
    // Select the project to see the linked items
    const projectSelect = screen.getByRole('combobox')
    fireEvent.change(projectSelect, { target: { value: 'p1' } })

    await waitFor(() => {
      expect(screen.getByText('NestJS Gateway')).toBeInTheDocument()
    })
    
    expect(screen.getByText('gateway')).toBeInTheDocument()
    expect(screen.getByText('API Gateway component.')).toBeInTheDocument()
    expect(screen.getByText('Response: <12ms')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
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
    expect(screen.getAllByText('Add New Item')[0]).toBeInTheDocument()

    // Fill fields
    const nameInput = screen.getByPlaceholderText('Node ID (e.g. gateway)')
    fireEvent.change(nameInput, { target: { value: 'backend' } })
    expect(screen.getByDisplayValue('backend')).toBeInTheDocument()
  })
})
