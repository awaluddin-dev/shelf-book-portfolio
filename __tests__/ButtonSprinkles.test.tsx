import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonSprinkles } from '@/shared/ui/ButtonSprinkles';

describe('ButtonSprinkles.tsx', () => {
  it('attaches click listener and does not render anything visible', () => {
    const { container } = render(<ButtonSprinkles />);
    // The component itself returns null
    expect(container.firstChild).toBeNull();
  });

  it('triggers sprinkle creation on button click', () => {
    render(
      <div>
        <ButtonSprinkles />
        <button id="test-btn">Click Me</button>
      </div>
    );

    const btn = document.getElementById('test-btn');
    
    // Mock getBoundingClientRect
    if (btn) {
      btn.getBoundingClientRect = jest.fn(() => ({
        width: 100,
        height: 40,
        top: 0,
        left: 0,
        bottom: 40,
        right: 100,
        x: 0,
        y: 0,
        toJSON: () => {}
      }));
    }

    // Since jsdom doesn't support Element.animate, we need to mock it
    Element.prototype.animate = jest.fn();

    fireEvent.click(btn!);
    
    // Assert that animate was called (sprinkles were created)
    expect(Element.prototype.animate).toHaveBeenCalled();
  });
});
