import { render, screen, fireEvent } from '@testing-library/react'
import MobileFilterModal from '@/views/home/ui/components/MobileFilterModal'

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, onClick }: any) => (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}))

describe('MobileFilterModal', () => {
  const mockOnClose = jest.fn()
  const mockOnSelectCategory = jest.fn()

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    categories: ['Category 1', 'Category 2'],
    selectedCategory: null,
    onSelectCategory: mockOnSelectCategory
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when closed', () => {
    render(<MobileFilterModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Filter Projects')).not.toBeInTheDocument()
  })

  it('renders correctly when open', () => {
    render(<MobileFilterModal {...defaultProps} />)
    expect(screen.getByText('Filter Projects')).toBeInTheDocument()
    expect(screen.getByText('All Projects')).toBeInTheDocument()
    expect(screen.getByText('Category 1')).toBeInTheDocument()
    expect(screen.getByText('Category 2')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<MobileFilterModal {...defaultProps} />)
    const closeBtns = screen.getAllByRole('button') // The X button and category buttons
    fireEvent.click(closeBtns[0]) // The X button
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onSelectCategory and onClose when All Projects is clicked', () => {
    render(<MobileFilterModal {...defaultProps} />)
    fireEvent.click(screen.getByText('All Projects'))
    expect(mockOnSelectCategory).toHaveBeenCalledWith(null)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onSelectCategory and onClose when a category is clicked', () => {
    render(<MobileFilterModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Category 1'))
    expect(mockOnSelectCategory).toHaveBeenCalledWith('Category 1')
    expect(mockOnClose).toHaveBeenCalled()
  })
})
