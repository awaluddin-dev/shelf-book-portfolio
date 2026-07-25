import { render, screen } from '@testing-library/react'
import { AnimatedDivider } from '@/shared/ui/AnimatedDivider'

// A dummy icon component for testing
const MockIcon = ({ size, className }: { size?: number, className?: string }) => (
  <svg data-testid="mock-icon" width={size} height={size} className={className} />
)

// Mock framer-motion to render normally without animations in tests
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

describe('AnimatedDivider', () => {
  it('renders the icon correctly', () => {
    render(<AnimatedDivider icon={MockIcon} />)
    
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
  })

  it('renders a quote when provided', () => {
    const quote = 'This is a test quote'
    render(<AnimatedDivider icon={MockIcon} quote={quote} />)
    
    // Check if quote text is rendered
    expect(screen.getByText(`"${quote}"`)).toBeInTheDocument()
  })

  it('does not render quote container if no quote is provided', () => {
    const { container } = render(<AnimatedDivider icon={MockIcon} />)
    
    // Make sure no text matches quote styling
    const quoteContainer = container.querySelector('.bg-neu-text')
    expect(quoteContainer).not.toBeInTheDocument()
  })
})
