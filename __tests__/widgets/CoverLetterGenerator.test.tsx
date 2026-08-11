import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CoverLetterGenerator } from '@/widgets/cover-letter/CoverLetterGenerator';
import { usePortfolioStore } from '@/shared/store/portfolioStore';
import { useCoverLetter } from '@/hooks/useCoverLetter';

jest.mock('@/shared/store/portfolioStore', () => ({
  usePortfolioStore: jest.fn(),
}));

jest.mock('@/hooks/useCoverLetter', () => ({
  useCoverLetter: jest.fn(),
}));

describe('CoverLetterGenerator', () => {
  const mockStore = {
    coverLetterJobDesc: '',
    setCoverLetterJobDesc: jest.fn(),
    setShowInquiryModal: jest.fn(),
    setDraftInquirySource: jest.fn(),
    setShowConnectionTooltip: jest.fn(),
    setCoverLetterText: jest.fn(),
    setCoverLetterStatus: jest.fn(),
    setCoverLetterError: jest.fn(),
  };

  const mockHook = {
    text: '',
    status: 'idle',
    error: null,
    generate: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue(mockStore);
    (useCoverLetter as jest.Mock).mockReturnValue(mockHook);
  });

  it('renders correctly initially', () => {
    render(<CoverLetterGenerator />);
    expect(screen.getByText('Cover Letter Generator')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Paste the full job description here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Cover Letter/i })).toBeDisabled();
  });

  it('enables generate button when JD is long enough', () => {
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      ...mockStore,
      coverLetterJobDesc: 'This is a sufficiently long job description.',
    });
    render(<CoverLetterGenerator />);
    
    const btn = screen.getByRole('button', { name: /Generate Cover Letter/i });
    expect(btn).not.toBeDisabled();
    
    fireEvent.click(btn);
    expect(mockHook.generate).toHaveBeenCalledWith('This is a sufficiently long job description.');
  });

  it('displays loading state correctly', () => {
    (useCoverLetter as jest.Mock).mockReturnValue({
      ...mockHook,
      status: 'loading',
    });
    render(<CoverLetterGenerator />);
    expect(screen.getByText(/Crafting a tailored cover letter/i)).toBeInTheDocument();
  });

  it('displays streaming state and text correctly', () => {
    (useCoverLetter as jest.Mock).mockReturnValue({
      ...mockHook,
      status: 'streaming',
      text: 'Dear Hiring Manager',
    });
    render(<CoverLetterGenerator />);
    expect(screen.getByText('Dear Hiring Manager')).toBeInTheDocument();
  });

  it('displays error state correctly', () => {
    (useCoverLetter as jest.Mock).mockReturnValue({
      ...mockHook,
      status: 'error',
      error: 'Failed to generate',
    });
    render(<CoverLetterGenerator />);
    expect(screen.getByText('Failed to generate')).toBeInTheDocument();
    
    const retryBtn = screen.getByText('Try again');
    fireEvent.click(retryBtn);
    expect(mockHook.generate).toHaveBeenCalled();
  });

  it('handles reset action', () => {
    (useCoverLetter as jest.Mock).mockReturnValue({
      ...mockHook,
      status: 'done',
      text: 'My cover letter',
    });
    render(<CoverLetterGenerator />);
    
    const resetBtn = screen.getByLabelText('Start over');
    fireEvent.click(resetBtn);
    
    expect(mockHook.reset).toHaveBeenCalled();
    expect(mockStore.setCoverLetterJobDesc).toHaveBeenCalledWith('');
    expect(mockStore.setCoverLetterText).toHaveBeenCalledWith('');
  });

  it('handles Draft Inquiry', () => {
    const onClose = jest.fn();
    (useCoverLetter as jest.Mock).mockReturnValue({
      ...mockHook,
      status: 'done',
      text: 'My cover letter text',
    });
    
    render(<CoverLetterGenerator onClose={onClose} />);
    
    const draftBtn = screen.getByText('Draft Inquiry');
    fireEvent.click(draftBtn);
    
    expect(mockStore.setDraftInquirySource).toHaveBeenCalledWith('My cover letter text');
    expect(mockStore.setShowInquiryModal).toHaveBeenCalledWith(true);
    expect(onClose).toHaveBeenCalled();
  });
});
