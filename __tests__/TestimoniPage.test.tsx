import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SubmitTestimonial from '@/pages/testimoni/ui/TestimoniPage'

// Mock React.use to resolve the promise immediately in tests
jest.mock('react', () => {
  const original = jest.requireActual('react')
  return {
    ...original,
    use: (p: any) => {
      // In our test we just pass the resolved object or we can mock it directly
      if (p && p.token) return p
      // For Promise.resolve, just extract the value manually if possible, 
      // but to be safe, let's just make `use` return what we pass as the mock value.
      // Actually we pass Promise.resolve({token}), so p is a promise.
      // We can't synchronously resolve a native promise, so we should change the test to pass the raw object to the component and cast it to Promise in the test?
      // Wait, let's just make the mock `use` read a property we attach to the promise.
      return p._resolvedValue
    }
  }
})

// Mock useRouter
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}))

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch as any

describe('SubmitTestimonial', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  // helper to create a fake promise that React.use can read
  const createMockParams = (token: string) => {
    const p = Promise.resolve({ token }) as any
    p._resolvedValue = { token }
    return p
  }

  it('shows invalid endpoint if token is wrong', async () => {
    render(<SubmitTestimonial params={createMockParams('wrong-token')} />)
    expect(screen.getByText('Invalid Endpoint')).toBeInTheDocument()
  })

  it('renders form if token is correct and handles successful submit', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'X-Submit-ETag': 'test-etag' })
    })

    render(<SubmitTestimonial params={createMockParams('submit-2026')} />)
    
    expect(screen.getByText('Leave an Endorsement')).toBeInTheDocument()

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('e.g. John Doe'), { target: { value: 'John' } })
    fireEvent.change(screen.getByPlaceholderText('e.g. Lead Engineer'), { target: { value: 'Eng' } })
    fireEvent.change(screen.getByPlaceholderText('e.g. Acme Corp'), { target: { value: 'Acme' } })
    fireEvent.change(screen.getByPlaceholderText('Write your testimonial here...'), { target: { value: 'Great job!' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Submit Endorsement/i }))

    await waitFor(() => {
      expect(screen.getByText('Thank You!')).toBeInTheDocument()
    })
    
    expect(localStorage.getItem('testimoniEtag')).toBe('test-etag')
    
    fireEvent.click(screen.getByRole('button', { name: /Return to Portfolio/i }))
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('handles 429 error', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 429,
      ok: false
    })

    render(<SubmitTestimonial params={createMockParams('submit-2026')} />)
    
    expect(screen.getByPlaceholderText('e.g. John Doe')).toBeInTheDocument()

    // Fill required
    fireEvent.change(screen.getByPlaceholderText('e.g. John Doe'), { target: { value: 'John' } })
    fireEvent.change(screen.getByPlaceholderText('e.g. Lead Engineer'), { target: { value: 'Eng' } })
    fireEvent.change(screen.getByPlaceholderText('e.g. Acme Corp'), { target: { value: 'Acme' } })
    fireEvent.change(screen.getByPlaceholderText('Write your testimonial here...'), { target: { value: 'Great job!' } })

    fireEvent.click(screen.getByRole('button', { name: /Submit Endorsement/i }))

    await waitFor(() => {
      expect(screen.getByText('Anda telah mengirimkan testimoni hari ini. Silakan coba lagi besok.')).toBeInTheDocument()
    })
  })
})
