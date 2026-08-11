import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import ContactModal from '@/features/contact/ui/ContactModal'

// Mock framer-motion
jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react')
  return {
    ...actual,
    motion: {
      div: ({ children, className, 'data-testid': testId, onClick, onMouseEnter, onMouseLeave, style, animate, initial }: any) => (
        <div 
          className={className} 
          data-testid={testId} 
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={style}
          data-animate={JSON.stringify(animate)}
        >
          {children}
        </div>
      ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  }
})

import { usePortfolioStore } from '@/shared/store/portfolioStore'
import { useDraftInquiry } from '@/hooks/useDraftInquiry'

jest.mock('@/shared/store/portfolioStore', () => ({
  usePortfolioStore: jest.fn()
}))

jest.mock('@/hooks/useDraftInquiry', () => ({
  useDraftInquiry: jest.fn(() => ({ draft: jest.fn(), status: 'idle' }))
}))

describe('ContactModal', () => {
  const mockOnClose = jest.fn()
  const mockTriggerToast = jest.fn()

  beforeEach(() => {
    global.fetch = jest.fn()
    // Reset localStorage
    localStorage.clear()
    
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      showInquiryModal: true,
      setShowInquiryModal: mockOnClose,
      inquiryMessage: '',
      setInquiryMessage: jest.fn(),
      draftInquirySource: null,
      setDraftInquirySource: jest.fn(),
      portfolioStatus: 'available',
      triggerToast: mockTriggerToast,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when isOpen is false', () => {
    ;(usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      showInquiryModal: false,
      setShowInquiryModal: mockOnClose,
      inquiryMessage: '',
      setInquiryMessage: jest.fn(),
      draftInquirySource: null,
      setDraftInquirySource: jest.fn(),
      portfolioStatus: 'available',
      triggerToast: mockTriggerToast,
    })
    render(<ContactModal />)
    expect(screen.queryByText('Availability Inquiry')).not.toBeInTheDocument()
  })

  it('renders correctly when isOpen is true', () => {
    render(<ContactModal />)
    expect(screen.getByText('Availability Inquiry')).toBeInTheDocument()
    expect(screen.getByText('Available for projects')).toBeInTheDocument()
  })

  it('handles form submission successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: (name: string) => name === 'X-Submit-ETag' ? 'test-etag' : null
      }
    })

    render(<ContactModal />)
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('E.g., Sarah Jenkins'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText('E.g., sarah@company.com'), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Briefly describe your project goals, stack, or role details...'), { target: { value: 'Hello' } })
    
    // Submit form directly to bypass HTML5 validation in JSDOM
    fireEvent.submit(screen.getByText('Send Inquiry').closest('form') as HTMLFormElement)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact/inquiry', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@test.com',
          projectType: 'contract',
          message: 'Hello'
        })
      }))
      expect(mockTriggerToast).toHaveBeenCalledWith('Availability inquiry sent successfully! Thank you.')
      expect(mockOnClose).toHaveBeenCalled()
      expect(localStorage.getItem('inquiryEtag')).toBe('test-etag')
    })
  })

  it('handles form submission error (429)', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      headers: { get: () => null }
    })

    render(<ContactModal />)
    
    fireEvent.submit(screen.getByText('Send Inquiry').closest('form') as HTMLFormElement)
    
    await waitFor(() => {
      expect(mockTriggerToast).toHaveBeenCalledWith('Anda telah mengirimkan pesan hari ini. Silakan coba lagi besok.')
    })
  })

  it('handles form submission error (general)', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: { get: () => null }
    })

    render(<ContactModal />)
    
    fireEvent.submit(screen.getByText('Send Inquiry').closest('form') as HTMLFormElement)
    
    await waitFor(() => {
      expect(mockTriggerToast).toHaveBeenCalledWith('Failed to send inquiry')
    })
  })

  it('sends existing ETag in headers if present', async () => {
    localStorage.setItem('inquiryEtag', 'existing-etag')
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => null }
    })

    render(<ContactModal />)
    
    fireEvent.submit(screen.getByText('Send Inquiry').closest('form') as HTMLFormElement)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact/inquiry', expect.objectContaining({
        headers: expect.objectContaining({
          'X-Submit-ETag': 'existing-etag'
        })
      }))
    })
  })
})
