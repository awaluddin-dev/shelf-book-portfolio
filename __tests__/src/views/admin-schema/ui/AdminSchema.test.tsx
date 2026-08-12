import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminSchema from '@/views/admin-schema/ui/AdminSchema';
import { AdminProjectLinkedCards } from '@/widgets/admin-project-linked-cards/ui/AdminProjectLinkedCards';

jest.mock('@/widgets/admin-project-linked-cards/ui/AdminProjectLinkedCards', () => ({
  AdminProjectLinkedCards: jest.fn(() => <div data-testid="admin-project-linked-cards" />),
}));

describe('AdminSchema Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders AdminProjectLinkedCards with correct static props', () => {
    render(<AdminSchema />);
    expect(AdminProjectLinkedCards).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Database Schema Nodes',
        apiEndpoint: '/api/database-schema',
        defaultFormData: { imageUrl: '', order: 0, description: '' },
      }),
      undefined
    );
  });

  it('itemDataExtractor extracts data correctly', () => {
    render(<AdminSchema />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    
    expect(props.itemDataExtractor({ data: [{ id: 1 }] })).toEqual([{ id: 1 }]);
    expect(props.itemDataExtractor([{ id: 2 }])).toEqual([{ id: 2 }]);
    expect(props.itemDataExtractor({ invalid: true })).toEqual([]);
  });

  it('onBeforeSave converts order to a number', () => {
    render(<AdminSchema />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    
    expect(props.onBeforeSave({ order: '10', imageUrl: 'schema.png', description: 'db schema' })).toEqual({
      order: 10,
      imageUrl: 'schema.png',
      description: 'db schema'
    });
  });

  it('renderForm renders fields and handles input changes', () => {
    render(<AdminSchema />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    const setFormData = jest.fn();
    
    const formData = { order: 1, imageUrl: 'img1.png', description: 'desc1' };
    render(<>{props.renderForm(formData, setFormData)}</>);
    
    const orderInput = screen.getByPlaceholderText('Order (e.g. 0)');
    const imgInput = screen.getByPlaceholderText('Image URL (e.g. /assets/schema1.png)');
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
    render(<AdminSchema />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    const setFormData = jest.fn();
    
    render(<>{props.renderForm({}, setFormData)}</>);
    expect(screen.getByPlaceholderText('Image URL (e.g. /assets/schema1.png)')).toHaveValue('');
    expect(screen.getByPlaceholderText('Description (optional)')).toHaveValue('');
  });

  it('renderCardDisplay renders correctly with full data', () => {
    render(<AdminSchema />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    
    const item = { order: 1, imageUrl: 'schema.png', description: 'test schema description' };
    render(<>{props.renderCardDisplay(item)}</>);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByAltText('Schema Preview')).toHaveAttribute('src', 'schema.png');
    expect(screen.getByText('test schema description')).toBeInTheDocument();
  });

  it('renderCardDisplay renders correctly with missing data', () => {
    render(<AdminSchema />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    
    const item = { order: 2 };
    render(<>{props.renderCardDisplay(item)}</>);
    
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('No image URL provided')).toBeInTheDocument();
    expect(screen.queryByText('test schema description')).not.toBeInTheDocument();
  });
});
