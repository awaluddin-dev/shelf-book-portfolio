import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from '../src/widgets/hero/ui/Hero';

// Mock dependencies
jest.mock('@/shared/store/portfolioStore', () => ({
  usePortfolioStore: jest.fn(),
}));

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 data-testid="motion-h1" {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p data-testid="motion-p" {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('@/shared/ui/CircuitBoardBg', () => ({
  CircuitBoardBg: () => <div data-testid="circuit-board-bg" />,
}));

jest.mock('@/shared/ui/AnimatedDivider', () => ({
  AnimatedDivider: () => <div data-testid="animated-divider" />,
}));

// Import mocked store
import { usePortfolioStore } from '@/shared/store/portfolioStore';

const mockRenderIcon = jest.fn((iconName, isSavings, size) => (
  <svg data-testid={`icon-${iconName}`} />
));

describe('HeroSection Widget', () => {
  const defaultStoreValues = {
    isLoading: false,
    dynamicHeroConfig: {
      name: 'John Doe',
      role: 'Frontend Engineer',
      openForWork: true,
      availableFrom: 'Next Week',
    },
    dynamicMetrics: [],
    triggerToast: jest.fn(),
    setShowInquiryModal: jest.fn(),
    showConnectionTooltip: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue(defaultStoreValues);
    
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders loading state correctly', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStoreValues,
      isLoading: true,
    });

    render(<HeroSection isDark={true} renderIcon={mockRenderIcon} />);
    
    // The loading state has two placeholder divs
    // Let's verify by checking the skeleton containers
    // We can't query by text, but we can check if it rendered the main container
    expect(screen.getByTestId('circuit-board-bg')).toBeInTheDocument();
    expect(screen.getByTestId('animated-divider')).toBeInTheDocument();
    
    // In loading state, name shouldn't be rendered
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders main content correctly when loaded', () => {
    render(<HeroSection isDark={true} renderIcon={mockRenderIcon} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Open to Opportunities')).toBeInTheDocument();
    expect(screen.getByText('Next Week', { exact: false })).toBeInTheDocument();
  });

  it('renders correctly when closed for work', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStoreValues,
      dynamicHeroConfig: {
        ...defaultStoreValues.dynamicHeroConfig,
        openForWork: false,
      }
    });

    render(<HeroSection isDark={true} renderIcon={mockRenderIcon} />);
    
    expect(screen.getByText('Closed to Opportunities')).toBeInTheDocument();
  });

  it('renders fallbacks for missing config', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStoreValues,
      dynamicHeroConfig: null,
    });

    render(<HeroSection isDark={true} renderIcon={mockRenderIcon} />);
    
    expect(screen.getByText('Awaluddin')).toBeInTheDocument();
    expect(screen.getByText('Backend Engineer — Integrating LLMs into Production Systems')).toBeInTheDocument();
  });

  it('shows tooltip when showConnectionTooltip is true', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStoreValues,
      showConnectionTooltip: true,
    });

    render(<HeroSection isDark={true} renderIcon={mockRenderIcon} />);
    
    expect(screen.getByText('You can choose a platform to discuss')).toBeInTheDocument();
  });

  it('handles CTA buttons clicks', () => {
    const mockScrollIntoView = jest.fn();
    // Instead of mocking prototype, mock getElementById to return an element with scrollIntoView
    const mockElement = document.createElement('div');
    mockElement.scrollIntoView = mockScrollIntoView;
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    render(<HeroSection isDark={true} renderIcon={mockRenderIcon} />);
    
    const projectsBtn = screen.getByText('View Projects');
    fireEvent.click(projectsBtn);
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    const downloadBtn = screen.getByText('Download CV');
    fireEvent.click(downloadBtn);
    expect(defaultStoreValues.triggerToast).toHaveBeenCalledWith('Downloading CV...');
  });

  it('handles Inquiries button click', () => {
    render(<HeroSection isDark={true} renderIcon={mockRenderIcon} />);
    
    const inquiriesBtn = screen.getByRole('button', { name: /Inquiries/i });
    fireEvent.click(inquiriesBtn);
    expect(defaultStoreValues.setShowInquiryModal).toHaveBeenCalledWith(true);
  });

  it('renders active metrics when available', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStoreValues,
      dynamicMetrics: [
        { icon: 'speed', isSavings: true, value: '100ms', label: 'API Latency' },
        { icon: 'users', isSavings: false, val: '5k+', label: 'Active Users' },
      ],
    });

    render(<HeroSection isDark={true} renderIcon={mockRenderIcon} />);
    
    expect(screen.getByText('100ms')).toBeInTheDocument();
    expect(screen.getByText('API Latency')).toBeInTheDocument();
    expect(screen.getByText('5k+')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(mockRenderIcon).toHaveBeenCalledWith('speed', true, 16);
    expect(mockRenderIcon).toHaveBeenCalledWith('users', false, 16);
  });
  
  it('handles gracefully when document.getElementById returns null', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);
    render(<HeroSection isDark={true} renderIcon={mockRenderIcon} />);
    
    const projectsBtn = screen.getByText('View Projects');
    expect(() => fireEvent.click(projectsBtn)).not.toThrow();
  });
});
