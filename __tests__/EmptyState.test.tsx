import { render, screen } from '@testing-library/react'
import EmptyState from '@/shared/ui/EmptyState'

// Mock motion to render normally without animations in tests
jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react')
  return {
    ...actual,
    motion: {
      div: ({ children, className, 'data-testid': testId, ...rest }: any) => (
        <div className={className} data-testid={testId} {...rest}>{children}</div>
      ),
    },
  }
})

describe('EmptyState', () => {
  it('renders with default message', () => {
    render(<EmptyState />)
    
    expect(screen.getByText('No data available')).toBeInTheDocument()
    expect(document.querySelector('svg')).toBeInTheDocument() // The Search icon
  })

  it('renders with custom message', () => {
    const customMessage = 'No projects found'
    render(<EmptyState message={customMessage} />)
    
    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })
})
