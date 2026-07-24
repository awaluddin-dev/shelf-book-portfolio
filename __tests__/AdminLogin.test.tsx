import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import AdminLogin from '@/views/admin-login/ui/AdminLogin';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}));

jest.mock('@marsidev/react-turnstile', () => ({
  Turnstile: ({ onSuccess }: any) => {
    return (
      <button type="button" data-testid="turnstile-success" onClick={() => onSuccess('fake-token')}>
        Verify
      </button>
    );
  }
}));

describe('AdminLogin.tsx', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders login form and disabled submit button', () => {
    render(<AdminLogin />);
    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
    
    // We check that the sign in button is disabled
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    expect(submitBtn).toBeDisabled();
  });

  it('enables submit button after turnstile verification and logs in successfully', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { access_token: 'fake-token' } })
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    render(<AdminLogin />);
    
    fireEvent.click(screen.getByTestId('turnstile-success'));

    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Enter email...'), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password...'), { target: { value: 'password' } });

    fireEvent.click(submitBtn);

    expect(screen.getByText('Signing In...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
    });

    expect(setItemSpy).toHaveBeenCalledWith('token', 'fake-token');
  });

  it('shows error on failed login', async () => {
    mockFetch.mockResolvedValue({
      ok: false
    });

    const { container } = render(<AdminLogin />);
    
    fireEvent.click(screen.getByTestId('turnstile-success'));

    // Re-query the button directly
    const submitBtn = screen.getAllByRole('button')[1];
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Incorrect credentials. Please try again.')).toBeInTheDocument();
    });
  });
});
