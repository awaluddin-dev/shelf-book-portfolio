import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminPlayground from '@/pages/admin-playground/ui/AdminPlayground'

const mockSetTheme = jest.fn()

jest.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
    setTheme: mockSetTheme,
  }),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@/widgets/admin-sidebar/ui/AdminSidebar', () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar" />
}))

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(),
  },
})

describe('AdminPlayground', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('isAdmin', 'true')
  })

  it('renders playground correctly', () => {
    render(<AdminPlayground />)
    expect(screen.getByText('Theme Playground')).toBeInTheDocument()
    expect(screen.getByText('Colors')).toBeInTheDocument()
    expect(screen.getByText('Effects (Shadow & Blur)')).toBeInTheDocument()
    expect(screen.getByText('Standard Card')).toBeInTheDocument()
  })

  it('toggles theme when button clicked', () => {
    render(<AdminPlayground />)
    
    // Find toggle button - it's the one before Export CSS in our mocked environment
    const toggleButtons = screen.getAllByRole('button')
    // We expect 4 buttons: toggle, export, neumorphic button, accent button
    fireEvent.click(toggleButtons[0])
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('copies css to clipboard on export click', async () => {
    render(<AdminPlayground />)
    
    const exportBtn = screen.getByRole('button', { name: /Export CSS/i })
    fireEvent.click(exportBtn)
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
    expect(screen.getByText('CSS Copied to clipboard!')).toBeInTheDocument()
  })

  it('updates color on input change', () => {
    render(<AdminPlayground />)
    
    // The inputs are color inputs
    const colorInputs = document.querySelectorAll('input[type="color"]')
    
    // Background color input
    fireEvent.change(colorInputs[0], { target: { value: '#ffffff' } })
    
    // The text showing the color should update, rendering twice (span and div)
    expect(screen.getAllByText('#ffffff')).toHaveLength(2)
  })
})
