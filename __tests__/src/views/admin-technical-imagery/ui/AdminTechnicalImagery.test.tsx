import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminTechnicalImagery from '@/views/admin-technical-imagery/ui/AdminTechnicalImagery';
import { AdminProjectLinkedCards } from '@/widgets/admin-project-linked-cards/ui/AdminProjectLinkedCards';

jest.mock('@/widgets/admin-project-linked-cards/ui/AdminProjectLinkedCards', () => ({
  AdminProjectLinkedCards: jest.fn(() => <div data-testid="admin-project-linked-cards" />),
}));

describe('AdminTechnicalImagery Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders AdminProjectLinkedCards with correct static props', () => {
    render(<AdminTechnicalImagery />);
    expect(AdminProjectLinkedCards).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Technical Imagery',
        apiEndpoint: '/api/technical-imagery',
        defaultFormData: {
          featured: '',
          blueprint: '',
          metrics: '',
          featuredCaption: '',
          blueprintCaption: '',
          metricsCaption: ''
        },
      }),
      undefined
    );
  });

  it('itemDataExtractor extracts data correctly', () => {
    render(<AdminTechnicalImagery />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    
    expect(props.itemDataExtractor({ data: [{ id: 1 }] })).toEqual([{ id: 1 }]);
    expect(props.itemDataExtractor([{ id: 2 }])).toEqual([{ id: 2 }]);
    expect(props.itemDataExtractor({ invalid: true })).toEqual([]);
  });

  it('renderForm renders fields and handles input changes', () => {
    render(<AdminTechnicalImagery />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    const setFormData = jest.fn();
    
    const formData = {
      featured: 'feat.png',
      blueprint: 'blue.png',
      metrics: 'met.png',
      featuredCaption: 'cap1',
      blueprintCaption: 'cap2',
      metricsCaption: 'cap3'
    };
    
    const { container } = render(<>{props.renderForm(formData, setFormData)}</>);
    
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBe(6);

    // Testing change in featured URL
    fireEvent.change(inputs[0], { target: { value: 'new-feat.png' } });
    expect(setFormData).toHaveBeenCalledWith({ ...formData, featured: 'new-feat.png' });

    // Testing change in featured caption
    fireEvent.change(inputs[1], { target: { value: 'new-cap1' } });
    expect(setFormData).toHaveBeenCalledWith({ ...formData, featuredCaption: 'new-cap1' });

    // Testing change in blueprint URL
    fireEvent.change(inputs[2], { target: { value: 'new-blue.png' } });
    expect(setFormData).toHaveBeenCalledWith({ ...formData, blueprint: 'new-blue.png' });

    // Testing change in blueprint caption
    fireEvent.change(inputs[3], { target: { value: 'new-cap2' } });
    expect(setFormData).toHaveBeenCalledWith({ ...formData, blueprintCaption: 'new-cap2' });

    // Testing change in metrics URL
    fireEvent.change(inputs[4], { target: { value: 'new-met.png' } });
    expect(setFormData).toHaveBeenCalledWith({ ...formData, metrics: 'new-met.png' });

    // Testing change in metrics caption
    fireEvent.change(inputs[5], { target: { value: 'new-cap3' } });
    expect(setFormData).toHaveBeenCalledWith({ ...formData, metricsCaption: 'new-cap3' });
  });

  it('renderForm handles missing optional fields gracefully', () => {
    render(<AdminTechnicalImagery />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    const setFormData = jest.fn();
    
    const { container } = render(<>{props.renderForm({}, setFormData)}</>);
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
      expect(input).toHaveValue('');
    });
  });

  it('renderCardDisplay renders correctly with full data', () => {
    render(<AdminTechnicalImagery />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    
    const item = {
      featured: 'feat.png',
      blueprint: 'blue.png',
      metrics: 'met.png',
      featuredCaption: 'cap1',
      blueprintCaption: 'cap2',
      metricsCaption: 'cap3'
    };
    
    render(<>{props.renderCardDisplay(item)}</>);
    
    expect(screen.getByAltText('Featured')).toHaveAttribute('src', 'feat.png');
    expect(screen.getByText('cap1')).toBeInTheDocument();

    expect(screen.getByAltText('Blueprint')).toHaveAttribute('src', 'blue.png');
    expect(screen.getByText('cap2')).toBeInTheDocument();

    expect(screen.getByAltText('Metrics')).toHaveAttribute('src', 'met.png');
    expect(screen.getByText('cap3')).toBeInTheDocument();
  });

  it('renderCardDisplay renders correctly with missing data', () => {
    render(<AdminTechnicalImagery />);
    const props = (AdminProjectLinkedCards as jest.Mock).mock.calls[0][0];
    
    const item = {};
    render(<>{props.renderCardDisplay(item)}</>);
    
    const noImageElements = screen.getAllByText('No image');
    expect(noImageElements.length).toBe(3);
    
    const noCaptionElements = screen.getAllByText('No caption');
    expect(noCaptionElements.length).toBe(3);
  });
});
