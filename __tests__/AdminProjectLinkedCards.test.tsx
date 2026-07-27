import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AdminProjectLinkedCards } from '@/widgets/admin-project-linked-cards/ui/AdminProjectLinkedCards'

// Mock the router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}))

jest.mock('@/widgets/admin-sidebar/ui/AdminSidebar', () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar" />
}))

describe('AdminProjectLinkedCards', () => {
  const mockRenderForm = jest.fn((formData, setFormData) => (
    <div>
      <input 
        data-testid="form-input" 
        value={formData.title || ''} 
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
    </div>
  ))
  const mockRenderCardDisplay = jest.fn((item) => <div>{item.title}</div>)

  const defaultProps = {
    title: 'Test Cards',
    activePath: '/admin/cards',
    apiEndpoint: '/api/test',
    itemDataExtractor: (data: any) => data.data || [],
    defaultFormData: { title: '' },
    renderForm: mockRenderForm,
    renderCardDisplay: mockRenderCardDisplay
  }

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('isAdmin', 'true')
    localStorage.setItem('token', 'fake-token')
    
    // Mock confirm
    jest.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('renders projects and items, and handles project selection', async () => {
    const mockProjects = [{ id: 'p1', title: 'Project 1' }, { id: 'p2', title: 'Project 2' }]
    const mockItems = [
      { id: '1', projectId: 'p1', title: 'Item 1', order: 1 },
      { id: '2', projectId: 'p2', title: 'Item 2', order: 1 }
    ]

    global.fetch = jest.fn((url: any) => {
      if (url === '/api/projects') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { projects: mockProjects } }) })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockItems }) })
    }) as any

    render(<AdminProjectLinkedCards {...defaultProps} />)

    // Wait for load
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    // Project 1 selected by default, so Item 1 shown, Item 2 not shown
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument()

    // Select Project 2
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'p2' } })

    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
  })

  it('handles add and save successfully', async () => {
    const mockProjects = [{ id: 'p1', title: 'Project 1' }]
    let mockItems = [{ id: '1', projectId: 'p1', title: 'Item 1', order: 1 }]

    global.fetch = jest.fn((url: any, options: any) => {
      if (url === '/api/projects') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { projects: mockProjects } }) })
      }
      if (options?.method === 'POST') {
        mockItems = [...mockItems, { id: '2', projectId: 'p1', title: 'New Item', order: 2 }]
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockItems }) })
    }) as any

    render(<AdminProjectLinkedCards {...defaultProps} onBeforeSave={(data) => ({...data, modified: true})} />)

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    // Click Add New
    const addBtn = screen.getByRole('button', { name: /Add New Item/i })
    fireEvent.click(addBtn)

    const input = screen.getByTestId('form-input')
    fireEvent.change(input, { target: { value: 'New Item' } })

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    await act(async () => {
      fireEvent.click(saveBtn)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ title: 'New Item', projectId: 'p1', modified: true })
    }))

    await waitFor(() => {
      expect(screen.getByText('New Item')).toBeInTheDocument()
    })
  })

  it('handles edit and save successfully', async () => {
    const mockProjects = [{ id: 'p1', title: 'Project 1' }]
    let mockItems = [{ id: '1', projectId: 'p1', title: 'Item 1', order: 1 }]

    global.fetch = jest.fn((url: any, options: any) => {
      if (url === '/api/projects') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { projects: mockProjects } }) })
      }
      if (options?.method === 'PATCH') {
        mockItems = [{ id: '1', projectId: 'p1', title: 'Updated Item 1', order: 1 }]
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockItems }) })
    }) as any

    render(<AdminProjectLinkedCards {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    // Find and click Edit using icon/button
    // We can query by title="Edit" ? Wait, in AdminProjectLinkedCards there are no titles.
    // Let's find Edit button by SVG or just order
    const buttons = screen.getAllByRole('button')
    // buttons: Edit (0), Delete (1), Add New Item (2)
    const editBtn = buttons[0]
    fireEvent.click(editBtn)

    const input = screen.getByTestId('form-input')
    fireEvent.change(input, { target: { value: 'Updated Item 1' } })

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    await act(async () => {
      fireEvent.click(saveBtn)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/test/1', expect.objectContaining({
      method: 'PATCH'
    }))

    await waitFor(() => {
      expect(screen.getByText('Updated Item 1')).toBeInTheDocument()
    })
  })

  it('handles delete', async () => {
    const mockProjects = [{ id: 'p1', title: 'Project 1' }]
    const mockItems = [{ id: '1', projectId: 'p1', title: 'Item 1', order: 1 }]

    global.fetch = jest.fn((url: any, options: any) => {
      if (url === '/api/projects') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { projects: mockProjects } }) })
      }
      if (options?.method === 'DELETE') {
        return Promise.resolve({ ok: true })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockItems }) })
    }) as any

    render(<AdminProjectLinkedCards {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    const buttons = screen.getAllByRole('button')
    // Edit (0), Delete (1), Add New Item (2)
    const deleteBtn = buttons[1]

    await act(async () => {
      fireEvent.click(deleteBtn)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/test/1', expect.objectContaining({ method: 'DELETE' }))

    await waitFor(() => {
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
    })
  })

  it('cancels edit', async () => {
    const mockProjects = [{ id: 'p1', title: 'Project 1' }]
    const mockItems = [{ id: '1', projectId: 'p1', title: 'Item 1', order: 1 }]

    global.fetch = jest.fn((url: any) => {
      if (url === '/api/projects') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { projects: mockProjects } }) })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockItems }) })
    }) as any

    render(<AdminProjectLinkedCards {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0]) // click Edit
    
    // Check form rendered
    expect(screen.getByTestId('form-input')).toBeInTheDocument()

    // Find cancel button (the one next to Save with X icon)
    const formButtons = screen.getAllByRole('button')
    // Usually Save is second to last, Cancel is last
    const cancelBtn = formButtons[formButtons.length - 2] // wait, it depends. formButtons are Save(0), Cancel(1), Add New(2)? No, Add New is hidden.
    
    // Let's query by SVG or text. Save has text. Cancel only has SVG.
    fireEvent.click(cancelBtn)
    
    // Form should close
    expect(screen.queryByTestId('form-input')).not.toBeInTheDocument()
  })
})
