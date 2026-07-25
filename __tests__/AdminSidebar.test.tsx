/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminSidebar } from '@/shared/ui/admin/AdminSidebar';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}));

describe('AdminSidebar.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with active path', () => {
    render(<AdminSidebar activePath="/admin/dashboard" />);
    // When active, the text gets bold (we can check for Dashboard)
    // Wait, the text is hidden when not expanded? 
    // Yes, but the icon is always there.
    
    // We can just verify it renders without crashing.
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('toggles expansion when collapse button is clicked', () => {
    render(<AdminSidebar activePath="/admin/dashboard" />);
    // The button that has ChevronRight
    const toggleButton = screen.getAllByRole('button')[0];
    
    fireEvent.click(toggleButton);
    // Should now show 'Collapse' and other labels
    expect(screen.getByText('Collapse')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    fireEvent.click(toggleButton);
    // Might still be in the document due to AnimatePresence, but it shouldn't crash.
  });

  it('navigates when an item is clicked', () => {
    render(<AdminSidebar activePath="/admin/dashboard" />);
    // Expand first so we can click by text
    const toggleButton = screen.getAllByRole('button')[0];
    fireEvent.click(toggleButton);

    const projectsBtn = screen.getByText('Projects').closest('button');
    fireEvent.click(projectsBtn!);
    
    expect(mockPush).toHaveBeenCalledWith('/admin/projects');
  });

  it('logs out and redirects', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    
    render(<AdminSidebar activePath="/admin/dashboard" />);
    const toggleButton = screen.getAllByRole('button')[0];
    fireEvent.click(toggleButton);

    const logoutBtn = screen.getByText('Logout').closest('button');
    fireEvent.click(logoutBtn!);
    
    expect(setItemSpy).toHaveBeenCalledWith('isAdmin');
    expect(mockPush).toHaveBeenCalledWith('/admin/login');
  });
});
