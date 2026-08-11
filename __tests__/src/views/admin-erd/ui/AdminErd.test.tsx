import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminErd from '@/views/admin-erd/ui/AdminErd';
import { AdminProjectLinkedCards } from '@/widgets/admin-project-linked-cards/ui/AdminProjectLinkedCards';

jest.mock('@/widgets/admin-project-linked-cards/ui/AdminProjectLinkedCards', () => ({
  AdminProjectLinkedCards: jest.fn(() => <div data-testid="admin-project-linked-cards" />),
}));

describe('AdminErd Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders AdminProjectLinkedCards with correct static props', () => {
    render(<AdminErd />);
    expect(AdminProjectLinkedCards).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Entity Relationship Diagram Nodes',
        apiEndpoint: '/api/erd',
        defaultFormData: { imageUrl: '', order: 0, description: '' },
      }),
      undefined
    );
  });

  it('itemDataExtractor extracts data correctly', () => {
    render(<AdminErd />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    
    expect(props.itemDataExtractor({ data: [{ id: 1 }] })).toEqual([{ id: 1 }]);
    expect(props.itemDataExtractor([{ id: 2 }])).toEqual([{ id: 2 }]);
    expect(props.itemDataExtractor({ invalid: true })).toEqual([]);
  });

  it('onBeforeSave converts order to a number', () => {
    render(<AdminErd />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    
    expect(props.onBeforeSave({ order: '5', imageUrl: 'test.png', description: 'desc' })).toEqual({
      order: 5,
      imageUrl: 'test.png',
      description: 'desc'
    });
  });

  it('renderForm renders fields and handles input changes', () => {
    render(<AdminErd />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    const setFormData = jest.fn();
    
    const formData = { order: 1, imageUrl: 'img1.png', description: 'desc1' };
    render(<>{props.renderForm(formData, setFormData)}</>);
    
    const orderInput = screen.getByPlaceholderText('Order (e.g. 0)');
    const imgInput = screen.getByPlaceholderText('Image URL (e.g. /assets/erd1.png)');
    const descInput = screen.getByPlaceholderText('Description (optional)');
    
    fireEvent.change(orderInput, { target: { value: '2' } });
    expect(setFormData).toHaveBeenCalledWith({ ...formData, order: 2 });
    
    fireEvent.change(orderInput, { target: { value: 'invalid' } });
    expect(setFormData).toHaveBeenCalledWith({ ...formData, order: 0 });

    fireEvent.change(imgInput, { target: { value: 'img2.png' } });
    expect(setFormData).toHaveBeenCalledWith({ ...formData, imageUrl: 'img2.png' });
    
    fireEvent.change(descInput, { target: { value: 'desc2' } });
    expect(setFormData).toHaveBeenCalledWith({ ...formData, description: 'desc2' });
  });

  it('renderForm handles missing optional fields gracefully', () => {
    render(<AdminErd />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    const setFormData = jest.fn();
    
    render(<>{props.renderForm({}, setFormData)}</>);
    expect(screen.getByPlaceholderText('Image URL (e.g. /assets/erd1.png)')).toHaveValue('');
    expect(screen.getByPlaceholderText('Description (optional)')).toHaveValue('');
  });

  it('renderCardDisplay renders correctly with full data', () => {
    render(<AdminErd />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    
    const item = { order: 1, imageUrl: 'img.png', description: 'test description' };
    render(<>{props.renderCardDisplay(item)}</>);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByAltText('ERD Preview')).toHaveAttribute('src', 'img.png');
    expect(screen.getByText('test description')).toBeInTheDocument();
  });

  it('renderCardDisplay renders correctly with missing data', () => {
    render(<AdminErd />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    
    const item = { order: 2 };
    render(<>{props.renderCardDisplay(item)}</>);
    
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('No image URL provided')).toBeInTheDocument();
    expect(screen.queryByText('test description')).not.toBeInTheDocument();
  });
});
