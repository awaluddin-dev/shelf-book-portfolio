import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminLogin from '@/pages/admin-login/ui/AdminLogin'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}))

// Mock Turnstile
jest.mock('@marsidev/react-turnstile', () => ({
  Turnstile: ({ onSuccess, onError, onExpire }: any) => (
    <div data-testid="turnstile">
      <button data-testid="turnstile-success" onClick={() => onSuccess('test-token')}>Success</button>
      <button data-testid="turnstile-error" onClick={onError}>Error</button>
      <button data-testid="turnstile-expire" onClick={onExpire}>Expire</button>
    </div>
  )
}))

describe('AdminLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
    Storage.prototype.setItem = jest.fn()
  })

  it('renders correctly', () => {
    render(<AdminLogin />)
    expect(screen.getByText('Admin Portal')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter email...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter password...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign/i })).toBeDisabled() // disabled because no turnstile token
  })

  it('handles successful login', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { access_token: 'fake-token' } })
    })

    render(<AdminLogin />)

    // Trigger turnstile success
    fireEvent.click(screen.getByTestId('turnstile-success'))

    fireEvent.change(screen.getByPlaceholderText('Enter email...'), { target: { value: 'admin@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter password...'), { target: { value: 'password123' } })

    const submitBtn = screen.getByRole('button', { name: /Sign/i })
    
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard')
    })
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign/i })).not.toHaveTextContent('Signing In...')
    })
  })

  it('handles login failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false
    })

    render(<AdminLogin />)

    // Trigger turnstile success
    fireEvent.click(screen.getByTestId('turnstile-success'))

    fireEvent.change(screen.getByPlaceholderText('Enter email...'), { target: { value: 'admin@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter password...'), { target: { value: 'wrong-pass' } })

    fireEvent.click(screen.getByRole('button', { name: /Sign/i }))

    await waitFor(() => {
      expect(screen.getByText('Incorrect credentials. Please try again.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Sign/i })).not.toHaveTextContent('Signing In...')
    })
  })

  it('handles turnstile error and expire', async () => {
    render(<AdminLogin />)
    
    // Success -> enables button
    fireEvent.click(screen.getByTestId('turnstile-success'))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign/i })).not.toBeDisabled()
    })
    
    // Error -> disables button
    fireEvent.click(screen.getByTestId('turnstile-error'))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign/i })).toBeDisabled()
    })

    // Success -> enables button
    fireEvent.click(screen.getByTestId('turnstile-success'))
    
    // Expire -> disables button
    fireEvent.click(screen.getByTestId('turnstile-expire'))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign/i })).toBeDisabled()
    })
  })

  it('handles network error during login', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<AdminLogin />)

    // Trigger turnstile success
    fireEvent.click(screen.getByTestId('turnstile-success'))

    fireEvent.change(screen.getByPlaceholderText('Enter email...'), { target: { value: 'admin@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter password...'), { target: { value: 'password123' } })

    fireEvent.click(screen.getByRole('button', { name: /Sign/i }))

    await waitFor(() => {
      expect(screen.getByText('Incorrect credentials. Please try again.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Sign/i })).not.toHaveTextContent('Signing In...')
    })
  })
})
