import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SpeechBubble } from '@/widgets/mascot/ui/SpeechBubble';
import { usePortfolioStore } from '@/shared/store/portfolioStore';

jest.mock('@/shared/store/portfolioStore', () => ({
  usePortfolioStore: jest.fn(),
}));

jest.mock('motion/react', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }: any, ref: any) => <div ref={ref} {...props}>{children}</div>),
      p: React.forwardRef(({ children, ...props }: any, ref: any) => <p ref={ref} {...props}>{children}</p>),
      button: React.forwardRef(({ children, ...props }: any, ref: any) => <button ref={ref} {...props}>{children}</button>),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('SpeechBubble', () => {
  const mockSetShowCoverLetterModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      setShowCoverLetterModal: mockSetShowCoverLetterModal,
    });
  });

  it('should render text correctly', () => {
    render(<SpeechBubble text="Hello world" onClose={jest.fn()} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<SpeechBubble text="Hi" onClose={onClose} />);
    const closeBtn = screen.getByLabelText('Close Mascot');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render cover letter button if showButton is true and handle click', () => {
    render(<SpeechBubble text="Hi" onClose={jest.fn()} showButton={true} />);
    const button = screen.getByText('Cover Letter Generator');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockSetShowCoverLetterModal).toHaveBeenCalledWith(true);
  });

  it('should not render cover letter button if showButton is false', () => {
    render(<SpeechBubble text="Hi" onClose={jest.fn()} showButton={false} />);
    const button = screen.queryByText('Cover Letter Generator');
    expect(button).not.toBeInTheDocument();
  });
});
