/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatWidget } from '../ChatWidget';
import { useChat } from '@/hooks/useChat';
import { usePortfolioStore } from '@/shared/store/portfolioStore';

// Mock dependencies
jest.mock('@/hooks/useChat');
jest.mock('@/shared/store/portfolioStore');

const mockUseChat = useChat as jest.MockedFunction<typeof useChat>;
const mockUsePortfolioStore = usePortfolioStore as unknown as jest.MockedFunction<() => any>;

describe('ChatWidget', () => {
  let mockSend: jest.Mock;
  let mockReset: jest.Mock;
  let mockSetIsChatOpen: jest.Mock;

  beforeEach(() => {
    mockSend = jest.fn();
    mockReset = jest.fn();
    mockSetIsChatOpen = jest.fn();

    // Default mocks
    mockUseChat.mockReturnValue({
      messages: [],
      status: 'idle',
      error: null,
      send: mockSend,
      reset: mockReset,
    });

    mockUsePortfolioStore.mockReturnValue({
      isChatOpen: true, // Render by default for tests
      setIsChatOpen: mockSetIsChatOpen,
    });
    
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isChatOpen is false', () => {
    mockUsePortfolioStore.mockReturnValue({
      isChatOpen: false,
      setIsChatOpen: mockSetIsChatOpen,
    });
    const { container } = render(<ChatWidget />);
    expect(container.firstChild).toBeNull();
  });

  it('renders chat header and empty state when open', () => {
    render(<ChatWidget />);
    expect(screen.getByText('Ask about Awaluddin')).toBeTruthy();
    expect(screen.getByText(/Ask me anything about/i)).toBeTruthy();
    
    // Check suggested questions
    expect(screen.getByText('What is his tech stack?')).toBeTruthy();
  });

  it('handles sending a message', () => {
    render(<ChatWidget />);
    
    const input = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    const sendButton = screen.getByLabelText('Send message');
    fireEvent.click(sendButton);
    
    expect(mockSend).toHaveBeenCalledWith('Hello');
    expect(input).toHaveValue('');
  });

  it('handles enter key to send message', () => {
    render(<ChatWidget />);
    
    const input = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(input, { target: { value: 'Testing enter' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(mockSend).toHaveBeenCalledWith('Testing enter');
  });

  it('does not send message on shift+enter', () => {
    render(<ChatWidget />);
    
    const input = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(input, { target: { value: 'Testing shift enter' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('does not send empty messages', () => {
    render(<ChatWidget />);
    
    const sendButton = screen.getByLabelText('Send message');
    fireEvent.click(sendButton);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('handles suggested questions', () => {
    render(<ChatWidget />);
    
    const suggestedQuestion = screen.getByText('What is his tech stack?');
    fireEvent.click(suggestedQuestion);
    
    expect(mockSend).toHaveBeenCalledWith('What is his tech stack?');
  });

  it('closes chat when close button is clicked', () => {
    render(<ChatWidget />);
    
    const closeButton = screen.getByLabelText('Close chat');
    fireEvent.click(closeButton);
    
    expect(mockSetIsChatOpen).toHaveBeenCalledWith(false);
  });

  it('renders messages and reset button when messages exist', () => {
    mockUseChat.mockReturnValue({
      messages: [
        { role: 'user', content: 'Hi' },
        { role: 'assistant', content: 'Hello there' },
      ],
      status: 'idle',
      error: null,
      send: mockSend,
      reset: mockReset,
    });

    render(<ChatWidget />);
    
    expect(screen.getByText('Hi')).toBeTruthy();
    expect(screen.getByText('Hello there')).toBeTruthy();
    
    // Clear conversation button should be visible
    const clearBtn = screen.getByTitle('Clear conversation');
    fireEvent.click(clearBtn);
    expect(mockReset).toHaveBeenCalled();
  });

  it('disables input when status is loading', () => {
    mockUseChat.mockReturnValue({
      messages: [],
      status: 'loading',
      error: null,
      send: mockSend,
      reset: mockReset,
    });

    render(<ChatWidget />);
    const input = screen.getByPlaceholderText('Ask a question...');
    expect(input).toBeDisabled();
    
    const sendBtn = screen.getByLabelText('Send message');
    expect(sendBtn).toBeDisabled();
  });

  it('displays error message if error exists', () => {
    mockUseChat.mockReturnValue({
      messages: [],
      status: 'error',
      error: 'Failed to send message',
      send: mockSend,
      reset: mockReset,
    });

    render(<ChatWidget />);
    expect(screen.getByText('Failed to send message')).toBeTruthy();
  });

  it('shows streaming cursor on last assistant message when streaming', () => {
    mockUseChat.mockReturnValue({
      messages: [{ role: 'assistant', content: 'Streaming content' }],
      status: 'streaming',
      error: null,
      send: mockSend,
      reset: mockReset,
    });

    const { container } = render(<ChatWidget />);
    // Streaming cursor is a span with animate-pulse
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });
});
