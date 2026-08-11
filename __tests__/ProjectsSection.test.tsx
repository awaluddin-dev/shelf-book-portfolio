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

const mockSetSearchQuery = jest.fn()
const mockSetSelectedCategory = jest.fn()
const mockSetSelectedProject = jest.fn()
const mockSetFocusedProject = jest.fn()
const mockTriggerToast = jest.fn()

jest.mock('@/shared/store/portfolioStore', () => ({
  usePortfolioStore: jest.fn(() => ({
    searchQuery: '',
    setSearchQuery: mockSetSearchQuery,
    selectedCategory: null,
    setSelectedCategory: mockSetSelectedCategory,
    setSelectedProject: mockSetSelectedProject,
    setFocusedProject: mockSetFocusedProject,
    focusedProject: null,
    dynamicHeroConfig: {},
    triggerToast: mockTriggerToast,
    dynamicProjects: [{ id: '1', title: 'Test Project', tags: ['React'], category: 'Category 1', date: '2024' }],
    isLoading: false,
  }))
}))

import { usePortfolioStore } from '@/shared/store/portfolioStore'

describe('ProjectsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
      selectedCategory: null,
      setSelectedCategory: mockSetSelectedCategory,
      setSelectedProject: mockSetSelectedProject,
      setFocusedProject: mockSetFocusedProject,
      focusedProject: null,
      dynamicHeroConfig: {},
      triggerToast: mockTriggerToast,
      dynamicProjects: [{ id: '1', title: 'Test Project', tags: ['React'], category: 'Category 1', date: '2024' }],
      isLoading: false,
    })
  })

  it('renders correctly with default props', () => {
    render(<ProjectsSection isDark={true} />)
    expect(screen.getByText('Featured Portfolio & Works')).toBeInTheDocument()
    expect(screen.getByTestId('book-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-filter-modal')).toBeInTheDocument()
    expect(screen.getByTestId('animated-divider')).toBeInTheDocument()
  })

  it('renders loading state correctly', () => {
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
      selectedCategory: null,
      setSelectedCategory: mockSetSelectedCategory,
      setSelectedProject: mockSetSelectedProject,
      setFocusedProject: mockSetFocusedProject,
      focusedProject: null,
      dynamicHeroConfig: {},
      triggerToast: mockTriggerToast,
      dynamicProjects: [],
      isLoading: true,
    })
    const { container } = render(<ProjectsSection isDark={true} />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders focused project correctly', () => {
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
      selectedCategory: null,
      setSelectedCategory: mockSetSelectedCategory,
      setSelectedProject: mockSetSelectedProject,
      setFocusedProject: mockSetFocusedProject,
      focusedProject: {
        id: '2',
        title: 'Focused Project',
        subtitle: 'A focused project subtitle',
        category: 'Focused Category',
        date: '2024',
        tags: ['React'],
        stats: [{ label: 'Users', value: '1M' }]
      },
      dynamicHeroConfig: {},
      triggerToast: mockTriggerToast,
      dynamicProjects: [{ id: '1', title: 'Test Project', tags: ['React'], category: 'Category 1', date: '2024' }],
      isLoading: false,
    })
    render(<ProjectsSection isDark={true} />)
    
    expect(screen.getAllByText('Focused Project')[0]).toBeInTheDocument()
    expect(screen.getAllByText('A focused project subtitle')[0]).toBeInTheDocument()
    expect(screen.getByText('1M')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('renders empty state when no projects match', () => {
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: 'nonexistent',
      setSearchQuery: mockSetSearchQuery,
      selectedCategory: null,
      setSelectedCategory: mockSetSelectedCategory,
      setSelectedProject: mockSetSelectedProject,
      setFocusedProject: mockSetFocusedProject,
      focusedProject: null,
      dynamicHeroConfig: {},
      triggerToast: mockTriggerToast,
      dynamicProjects: [{ id: '1', title: 'Test Project', tags: ['React'], category: 'Category 1', date: '2024' }],
      isLoading: false,
    })
    render(<ProjectsSection isDark={true} />)
    expect(screen.getByText('No matching projects found')).toBeInTheDocument()
    expect(screen.getByText('Clear All Filters')).toBeInTheDocument()
  })

  it('handles search input', () => {
    render(<ProjectsSection isDark={true} />)
    const input = screen.getByPlaceholderText('Search projects...')
    fireEvent.change(input, { target: { value: 'query' } })
    expect(mockSetSearchQuery).toHaveBeenCalledWith('query')
  })

  it('handles category selection', () => {
    render(<ProjectsSection isDark={true} />)
    const catButton = screen.getAllByRole('button', { name: /Category 1/i })[0]
    fireEvent.click(catButton)
    expect(mockSetSelectedCategory).toHaveBeenCalledWith('Category 1')
  })

  it('handles sorting', () => {
    render(<ProjectsSection isDark={true} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'oldest' } })
    // No mockSetSortBy, state is local
    expect((select as HTMLSelectElement).value).toBe('oldest')
  })

  it('handles clear filters', () => {
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: 'query',
      setSearchQuery: mockSetSearchQuery,
      selectedCategory: 'Category 1',
      setSelectedCategory: mockSetSelectedCategory,
      setSelectedProject: mockSetSelectedProject,
      setFocusedProject: mockSetFocusedProject,
      focusedProject: null,
      dynamicHeroConfig: {},
      triggerToast: mockTriggerToast,
      dynamicProjects: [],
      isLoading: false,
    })
    render(<ProjectsSection isDark={true} />)
    const clearBtn = screen.getByText('Clear All Filters')
    fireEvent.click(clearBtn)
    
    expect(mockSetSearchQuery).toHaveBeenCalledWith('')
    expect(mockSetSelectedCategory).toHaveBeenCalledWith(null)
    expect(mockTriggerToast).toHaveBeenCalledWith('Filters reset: Showing all projects')
  })
})
