import { render, screen, fireEvent } from '@testing-library/react'
import TestimonialModal from '@/widgets/testimonial-modal/ui/TestimonialModal'
import { usePortfolioStore } from '@/shared/store/portfolioStore'

jest.mock('@/shared/store/portfolioStore')

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, onClick }: any) => (
      <div className={className} onClick={onClick} data-testid="motion-div">
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}))

describe('TestimonialModal', () => {
  const mockOnClose = jest.fn()
  
  const defaultTestimonial = {
    id: '1',
    name: 'John Doe',
    role: 'CEO',
    testimonial: 'Great work!',
    url: 'https://johndoe.com',
    image: 'john.jpg',
    company: 'Acme',
    tags: []
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      selectedTestimonial: null,
      setSelectedTestimonial: mockOnClose
    })
  })

  it('renders nothing when selectedTestimonial is null', () => {
    render(<TestimonialModal />)
    expect(screen.queryByText('Full Testimonial')).not.toBeInTheDocument()
  })

  it('renders correctly with testimonial', () => {
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      selectedTestimonial: defaultTestimonial,
      setSelectedTestimonial: mockOnClose
    })
    render(<TestimonialModal />)
    
    expect(screen.getByText('Full Testimonial')).toBeInTheDocument()
    expect(screen.getByText(/Great work!/)).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('CEO')).toBeInTheDocument()
  })

  it('renders a link if url is provided', () => {
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      selectedTestimonial: defaultTestimonial,
      setSelectedTestimonial: mockOnClose
    })
    render(<TestimonialModal />)
    const link = screen.getByText('John Doe').closest('a')
    expect(link).toHaveAttribute('href', 'https://johndoe.com')
  })

  it('renders text only if no url is provided', () => {
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      selectedTestimonial: {...defaultTestimonial, url: undefined},
      setSelectedTestimonial: mockOnClose
    })
    render(<TestimonialModal />)
    const nameText = screen.getByText('John Doe')
    expect(nameText.closest('a')).toBeNull()
  })

  it('calls onClose when backdrop is clicked', () => {
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      selectedTestimonial: defaultTestimonial,
      setSelectedTestimonial: mockOnClose
    })
    render(<TestimonialModal />)
    const backdrop = screen.getAllByTestId('motion-div')[0]
    fireEvent.click(backdrop)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when close button is clicked', () => {
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      selectedTestimonial: defaultTestimonial,
      setSelectedTestimonial: mockOnClose
    })
    render(<TestimonialModal />)
    // There's an SVG X icon inside the button
    const closeBtn = screen.getByRole('button')
    fireEvent.click(closeBtn)
    expect(mockOnClose).toHaveBeenCalled()
  })
})
