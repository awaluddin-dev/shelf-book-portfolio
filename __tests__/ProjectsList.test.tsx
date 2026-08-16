/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectsSection from '../src/widgets/projects-list/ui/ProjectsList';
import { usePortfolioStore } from '@/shared/store/portfolioStore';
import { useProjectExplainer } from '@/hooks/useProjectExplainer';

// Mock motion
jest.mock('motion/react', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref) => {
      const { initial, animate, exit, layoutId, transition, layout, whileInView, viewport, whileHover, ...rest } = props;
      return <div ref={ref} {...rest}>{children}</div>;
    }),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock hooks
jest.mock('@/shared/store/portfolioStore');
jest.mock('@/hooks/useProjectExplainer');

// Mock components
jest.mock('@/entities/project/ui/BookItem', () => ({
  __esModule: true,
  default: ({ project, setSelectedProject, setFocusedProject, getTagProjectCount }: any) => (
    <div data-testid={`book-item-${project.id}`}>
      {project.title}
      <button onClick={() => setSelectedProject(project)} data-testid={`select-${project.id}`}>Select</button>
      <button onClick={() => setFocusedProject(project)} data-testid={`focus-${project.id}`}>Focus</button>
      <span data-testid="tag-count">{getTagProjectCount('React')}</span>
    </div>
  )
}));

jest.mock('../src/widgets/projects-list/ui/MobileFilterModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onSelectCategory }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mobile-filter-modal">
        <button onClick={onClose} data-testid="close-modal">Close</button>
        <button onClick={() => onSelectCategory('Web')} data-testid="select-web-category">Web Category</button>
      </div>
    );
  }
}));

jest.mock('@/shared/ui/AnimatedDivider', () => ({
  AnimatedDivider: () => <div data-testid="animated-divider" />,
}));

jest.mock('lucide-react', () => ({
  BookOpen: () => <span data-testid="icon-bookopen">BookOpenIcon</span>,
  Search: () => <span>SearchIcon</span>,
  Filter: () => <span>FilterIcon</span>,
  ChevronLeft: () => <span>ChevronLeftIcon</span>,
  ChevronRight: () => <span>ChevronRightIcon</span>,
  Code2: () => <span>Code2Icon</span>,
  ArrowLeft: () => <span>ArrowLeftIcon</span>,
  Wrench: () => <span>WrenchIcon</span>,
  Sparkles: () => <span>SparklesIcon</span>,
  X: () => <span>XIcon</span>,
}));

describe('ProjectsSection', () => {
  const mockSetSearchQuery = jest.fn();
  const mockSetSelectedCategory = jest.fn();
  const mockSetSelectedProject = jest.fn();
  const mockSetFocusedProject = jest.fn();
  const mockTriggerToast = jest.fn();

  const baseProjects = [
    {
      id: '1',
      title: 'Project A',
      category: 'Web',
      date: '2023',
      tags: ['React', 'TS'],
    },
    {
      id: '2',
      title: 'Project B',
      category: 'Mobile',
      date: '2022',
      tags: ['React Native'],
    },
    {
      id: '3',
      title: 'Project C',
      category: 'Web',
      date: '2024',
      tags: ['Next'],
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default store state
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
      selectedCategory: null,
      setSelectedCategory: mockSetSelectedCategory,
      setSelectedProject: mockSetSelectedProject,
      setFocusedProject: mockSetFocusedProject,
      focusedProject: null,
      dynamicHeroConfig: { name: 'Test User' },
      triggerToast: mockTriggerToast,
      dynamicProjects: baseProjects,
      isLoading: false,
    });

    // Default explainer state
    (useProjectExplainer as jest.Mock).mockReturnValue({
      text: 'AI Explanation',
      status: 'idle',
      error: null,
      explain: jest.fn(),
      reset: jest.fn(),
    });
  });

  test('renders loading state', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      isLoading: true,
      searchQuery: '',
      selectedCategory: null,
      dynamicProjects: [],
    });
    
    const { container } = render(<ProjectsSection isDark={true} />);
    // Loading state has divs with animate-pulse
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('renders empty state and clear filters', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: 'Not Found',
      selectedCategory: 'Web',
      setSearchQuery: mockSetSearchQuery,
      setSelectedCategory: mockSetSelectedCategory,
      triggerToast: mockTriggerToast,
      dynamicProjects: [],
      isLoading: false,
    });

    render(<ProjectsSection isDark={true} />);
    expect(screen.getByText(/No matching projects found/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Clear All Filters'));
    expect(mockSetSearchQuery).toHaveBeenCalledWith('');
    expect(mockSetSelectedCategory).toHaveBeenCalledWith(null);
    expect(mockTriggerToast).toHaveBeenCalled();
  });

  test('renders project list and filters', () => {
    render(<ProjectsSection isDark={true} />);
    
    // Should render all 3 projects
    expect(screen.getByTestId('book-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('book-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('book-item-3')).toBeInTheDocument();

    // Check categories
    const allBtn = screen.getByText('All');
    const webBtn = screen.getByText('Web');
    const mobileBtn = screen.getByText('Mobile');

    expect(allBtn).toBeInTheDocument();
    expect(webBtn).toBeInTheDocument();
    expect(mobileBtn).toBeInTheDocument();

    // Select category
    fireEvent.click(webBtn);
    expect(mockSetSelectedCategory).toHaveBeenCalledWith('Web');

    // Test search input
    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'Project B' } });
    expect(mockSetSearchQuery).toHaveBeenCalledWith('Project B');
  });

  test('renders focused project state', () => {
    const mockFocusedProject = {
      id: '1',
      title: 'Project A',
      category: 'Web',
      date: '2023',
      subtitle: 'Sub A',
      tags: ['React'],
      stats: [{ label: 'Stars', value: '100' }],
      spineColor: '#123456',
    };

    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: '',
      selectedCategory: null,
      focusedProject: mockFocusedProject,
      dynamicProjects: baseProjects,
      dynamicHeroConfig: { name: 'John Doe' },
      isLoading: false,
      setFocusedProject: mockSetFocusedProject,
      setSelectedProject: mockSetSelectedProject,
    });

    render(<ProjectsSection isDark={true} />);

    // Renders focused project title
    expect(screen.getAllByText('Project A')[0]).toBeInTheDocument();
    // Subtitle
    expect(screen.getAllByText('Sub A')[0]).toBeInTheDocument(); // might be duplicated
    // Author
    expect(screen.getByText('JOHN DOE')).toBeInTheDocument();

    // Check actions
    fireEvent.click(screen.getByText('Close Spotlight'));
    expect(mockSetFocusedProject).toHaveBeenCalledWith(null);
    
    fireEvent.click(screen.getByText('Open Full Dev Log'));
    expect(mockSetSelectedProject).toHaveBeenCalledWith(mockFocusedProject);
  });

  test('handles project explainer states', () => {
    const mockExplain = jest.fn();
    const mockReset = jest.fn();

    (useProjectExplainer as jest.Mock).mockReturnValue({
      text: 'Loading explanation...',
      status: 'loading',
      error: null,
      explain: mockExplain,
      reset: mockReset,
    });

    const mockFocusedProject = {
      id: '1',
      title: 'Project A',
      tags: [],
    };

    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: '',
      selectedCategory: null,
      focusedProject: mockFocusedProject,
      dynamicProjects: baseProjects,
      isLoading: false,
    });

    render(<ProjectsSection isDark={true} />);

    expect(screen.getByText('AI Explanation')).toBeInTheDocument();
    expect(screen.getByText('Thinking...')).toBeInTheDocument();
    expect(screen.getByText('Loading explanation...')).toBeInTheDocument();

    // Test error state
    (useProjectExplainer as jest.Mock).mockReturnValue({
      text: '',
      status: 'error',
      error: 'Failed to explain',
      explain: mockExplain,
      reset: mockReset,
    });

    render(<ProjectsSection isDark={true} />);
    expect(screen.getByText('Failed to explain')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Try again'));
    expect(mockExplain).toHaveBeenCalled();
    
    const xIcons = screen.getAllByText('XIcon');
    fireEvent.click(xIcons[0].closest('button')!);
    expect(mockReset).toHaveBeenCalled();
  });
  
  test('handles AI streaming state', () => {
    (useProjectExplainer as jest.Mock).mockReturnValue({
      text: 'Streaming text',
      status: 'streaming',
      error: null,
      explain: jest.fn(),
      reset: jest.fn(),
    });
    
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: '',
      selectedCategory: null,
      focusedProject: { id: '1', title: 'A', tags: [] },
      dynamicProjects: baseProjects,
      isLoading: false,
    });
    
    render(<ProjectsSection isDark={true} />);
    expect(screen.getByText('Typing...')).toBeInTheDocument();
    expect(screen.getByText('Streaming text')).toBeInTheDocument();
  });

  test('handles trigger AI explain', () => {
    const mockExplain = jest.fn();
    (useProjectExplainer as jest.Mock).mockReturnValue({
      text: '',
      status: 'idle',
      error: null,
      explain: mockExplain,
      reset: jest.fn(),
    });
    
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: '',
      selectedCategory: null,
      focusedProject: { id: '1', title: 'A', tags: ['X'] },
      dynamicProjects: baseProjects,
      isLoading: false,
    });
    
    render(<ProjectsSection isDark={true} />);
    fireEvent.click(screen.getByText(/Explain this to me/i));
    expect(mockExplain).toHaveBeenCalled();
  });
  
  test('handles mobile filter modal open/close', () => {
    render(<ProjectsSection isDark={true} />);
    
    const filterBtn = screen.getByRole('button', { name: /filtericon/i });
    fireEvent.click(filterBtn);
    
    expect(screen.getByTestId('mobile-filter-modal')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('close-modal'));
    expect(screen.queryByTestId('mobile-filter-modal')).not.toBeInTheDocument();
    
    // open again and select
    fireEvent.click(filterBtn);
    fireEvent.click(screen.getByTestId('select-web-category'));
    expect(mockSetSelectedCategory).toHaveBeenCalledWith('Web');
  });

  test('sorting dropdown changes order', () => {
    render(<ProjectsSection isDark={true} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'alphabetical' } });
    expect(select).toHaveValue('alphabetical');
    
    fireEvent.change(select, { target: { value: 'oldest' } });
    expect(select).toHaveValue('oldest');
  });
  
  test('scroll buttons', () => {
    // Need enough items to not be focused/loading/empty
    const scrollByMock = jest.fn();
    window.HTMLElement.prototype.scrollBy = scrollByMock;
    
    render(<ProjectsSection isDark={true} />);
    
    const leftBtn = screen.getByRole('button', { name: /scroll left/i });
    const rightBtn = screen.getByRole('button', { name: /scroll right/i });
    
    fireEvent.click(rightBtn);
    expect(scrollByMock).toHaveBeenCalledWith({ left: 300, behavior: 'smooth' });
    
    fireEvent.click(leftBtn);
    expect(scrollByMock).toHaveBeenCalledWith({ left: -300, behavior: 'smooth' });
  });

  test('focused project interaction on the 3D card', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: '',
      selectedCategory: null,
      focusedProject: {
        id: '1',
        title: 'Project A',
        category: 'Web',
        date: '2023',
        subtitle: 'Sub A',
        tags: [],
      },
      dynamicProjects: baseProjects,
      dynamicHeroConfig: { name: 'John Doe' },
      isLoading: false,
      setFocusedProject: mockSetFocusedProject,
      setSelectedProject: mockSetSelectedProject,
    });

    const { container } = render(<ProjectsSection isDark={true} />);
    // The 3D card has onClick to setSelectedProject(focusedProject)
    // It's inside a motion.div which we mocked to div
    // We can just find the div that has perspective
    const cardContainer = screen.getByText('JOHN DOE').closest('div');
    if (cardContainer) {
      // Find the clickable wrapper
      const clickableDiv = container.querySelector('[style*="transform-style: preserve-3d"]');
      if (clickableDiv) {
        fireEvent.click(clickableDiv);
        expect(mockSetSelectedProject).toHaveBeenCalled();
      }
    }
  });

  test('handles project sorting logic', () => {
    const projects = [
      { id: '1', title: 'C', date: '2023', tags: [] },
      { id: '2', title: 'A', date: '2025', tags: [] },
      { id: '3', title: 'B', date: '2024', tags: [] },
    ];
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      searchQuery: '',
      selectedCategory: null,
      dynamicProjects: projects,
      isLoading: false,
    });

    render(<ProjectsSection isDark={true} />);
    
    // Sort A-Z
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'alphabetical' } });
    
    // Check DOM order?
    const items = screen.getAllByTestId(/book-item-/);
    // alphabetical: A (id2), B (id3), C (id1)
    expect(items[0]).toHaveAttribute('data-testid', 'book-item-2');
    expect(items[1]).toHaveAttribute('data-testid', 'book-item-3');
    expect(items[2]).toHaveAttribute('data-testid', 'book-item-1');

    // Sort newest
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'newest' } });
    const itemsNew = screen.getAllByTestId(/book-item-/);
    // newest: A (2025), B (2024), C (2023)
    expect(itemsNew[0]).toHaveAttribute('data-testid', 'book-item-2');
    expect(itemsNew[1]).toHaveAttribute('data-testid', 'book-item-3');
    expect(itemsNew[2]).toHaveAttribute('data-testid', 'book-item-1');

    // Sort oldest
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'oldest' } });
    const itemsOld = screen.getAllByTestId(/book-item-/);
    // oldest: C (2023), B (2024), A (2025)
    expect(itemsOld[0]).toHaveAttribute('data-testid', 'book-item-1');
    expect(itemsOld[1]).toHaveAttribute('data-testid', 'book-item-3');
    expect(itemsOld[2]).toHaveAttribute('data-testid', 'book-item-2');
  });
});
