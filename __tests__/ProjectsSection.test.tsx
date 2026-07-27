/* eslint-disable react/display-name */
import { render, screen, fireEvent } from '@testing-library/react'
import ProjectsSection from '@/widgets/projects-list/ui/ProjectsList'

// Mock sub-components
jest.mock('@/shared/ui/AnimatedDivider', () => ({
  AnimatedDivider: () => <div data-testid="animated-divider" />
}))
jest.mock('@/entities/project/ui/BookItem', () => ({ project }: any) => <div data-testid={`book-item-${project.id}`} />)
jest.mock('@/widgets/projects-list/ui/MobileFilterModal', () => () => <div data-testid="mobile-filter-modal" />)

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}))

describe('ProjectsSection', () => {
  const mockSetSearchQuery = jest.fn()
  const mockSetSelectedCategory = jest.fn()
  const mockSetSortBy = jest.fn()
  const mockSetIsFilterModalOpen = jest.fn()
  const mockGetTechIconAndColor = jest.fn(() => ({ color: 'bg-red-500', icon: <span>Icon</span> }))
  const mockGetTagProjectCount = jest.fn(() => 2)
  const mockSetSelectedProject = jest.fn()
  const mockSetFocusedProject = jest.fn()
  const mockTriggerToast = jest.fn()
  const mockSetIsBannerMinimized = jest.fn()
  const mockScrollShelf = jest.fn()

  const defaultProps = {
    searchQuery: '',
    setSearchQuery: mockSetSearchQuery,
    selectedCategory: null,
    setSelectedCategory: mockSetSelectedCategory,
    categories: ['Category 1', 'Category 2'],
    sortBy: 'newest',
    setSortBy: mockSetSortBy,
    isFilterModalOpen: false,
    setIsFilterModalOpen: mockSetIsFilterModalOpen,
    filteredProjects: [{ id: '1', title: 'Test Project' }],
    getTechIconAndColor: mockGetTechIconAndColor,
    getTagProjectCount: mockGetTagProjectCount,
    setSelectedProject: mockSetSelectedProject,
    setFocusedProject: mockSetFocusedProject,
    isDark: true,
    focusedProject: null,
    dynamicHeroConfig: {},
    triggerToast: mockTriggerToast,
    shelfRef: { current: null },
    activeProjects: [{ id: '1', title: 'Test Project' }],
    selectedProject: null,
    isBannerMinimized: false,
    setIsBannerMinimized: mockSetIsBannerMinimized,
    isLoading: false,
    scrollShelf: mockScrollShelf
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with default props', () => {
    render(<ProjectsSection {...defaultProps} />)
    expect(screen.getByText('Featured Portfolio & Works')).toBeInTheDocument()
    expect(screen.getByTestId('book-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-filter-modal')).toBeInTheDocument()
    expect(screen.getByTestId('animated-divider')).toBeInTheDocument()
  })

  it('renders loading state correctly', () => {
    const { container } = render(<ProjectsSection {...defaultProps} isLoading={true} />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders focused project correctly', () => {
    render(<ProjectsSection {...defaultProps} focusedProject={{
      id: '2',
      title: 'Focused Project',
      subtitle: 'A focused project subtitle',
      category: 'Focused Category',
      date: '2024',
      tags: ['React'],
      stats: [{ label: 'Users', value: '1M' }]
    }} />)
    
    expect(screen.getAllByText('Focused Project')[0]).toBeInTheDocument()
    expect(screen.getAllByText('A focused project subtitle')[0]).toBeInTheDocument()
    expect(screen.getByText('1M')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('renders empty state when no projects match', () => {
    render(<ProjectsSection {...defaultProps} filteredProjects={[]} searchQuery="nonexistent" />)
    expect(screen.getByText('No matching projects found')).toBeInTheDocument()
    expect(screen.getByText('Clear All Filters')).toBeInTheDocument()
  })

  it('handles search input', () => {
    render(<ProjectsSection {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search projects...')
    fireEvent.change(input, { target: { value: 'query' } })
    expect(mockSetSearchQuery).toHaveBeenCalledWith('query')
  })

  it('handles category selection', () => {
    render(<ProjectsSection {...defaultProps} />)
    
    // desktop filter buttons are rendered for categories
    const catButton = screen.getAllByRole('button', { name: /Category 1/i })[0]
    fireEvent.click(catButton)
    
    expect(mockSetSelectedCategory).toHaveBeenCalledWith('Category 1')
  })

  it('handles sorting', () => {
    render(<ProjectsSection {...defaultProps} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'oldest' } })
    expect(mockSetSortBy).toHaveBeenCalledWith('oldest')
  })

  it('handles clear filters', () => {
    render(<ProjectsSection {...defaultProps} filteredProjects={[]} />)
    const clearBtn = screen.getByText('Clear All Filters')
    fireEvent.click(clearBtn)
    
    expect(mockSetSearchQuery).toHaveBeenCalledWith('')
    expect(mockSetSelectedCategory).toHaveBeenCalledWith(null)
    expect(mockTriggerToast).toHaveBeenCalledWith('Filters reset: Showing all projects')
  })

  it('handles scroll buttons', () => {
    render(<ProjectsSection {...defaultProps} />)
    const leftBtn = screen.getByLabelText('Scroll Left')
    const rightBtn = screen.getByLabelText('Scroll Right')
    
    fireEvent.click(leftBtn)
    expect(mockScrollShelf).toHaveBeenCalledWith('left')
    
    fireEvent.click(rightBtn)
    expect(mockScrollShelf).toHaveBeenCalledWith('right')
  })
})
