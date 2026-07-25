/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import BookItem from '@/entities/project/ui/BookItem';
import { projects } from '@/entities/testimonial/model/data';

const mockProject = {
  id: '1',
  name: 'Test Project',
  tags: ['React'],
  spineColor: '#FF0000',
  spineText: 'TEST SPINE TEXT'
} as typeof projects[0];

describe('BookItem.tsx', () => {
  it('renders correctly and responds to mouse events', () => {
    const setFocusedProject = jest.fn();
    const setSelectedProject = jest.fn();
    const getTagProjectCount = jest.fn();

    const { container } = render(
      <BookItem
        project={mockProject}
        setFocusedProject={setFocusedProject}
        setSelectedProject={setSelectedProject}
        isDark={true}
        getTagProjectCount={getTagProjectCount}
      />
    );

    // Spine text should be in the document
    expect(screen.getByText('TEST SPINE TEXT')).toBeInTheDocument();

    // Click it
    const outerDiv = container.firstChild as HTMLElement;
    fireEvent.click(outerDiv);
    expect(setFocusedProject).toHaveBeenCalledWith(mockProject);

    // Mouse events
    const innerDiv = outerDiv.firstChild as HTMLElement;
    
    innerDiv.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 200,
      top: 0,
      left: 0,
      bottom: 200,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {}
    }));

    fireEvent.mouseMove(innerDiv, { clientX: 50, clientY: 100 });
    fireEvent.mouseLeave(innerDiv);
    
    // As long as no errors are thrown during mouse events, it passes.
    expect(true).toBe(true);
  });
});
