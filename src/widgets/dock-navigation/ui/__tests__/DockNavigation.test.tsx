import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DockNavigation from "../DockNavigation";
import { useTheme } from "next-themes";
import { usePortfolioStore } from "@/shared/store/portfolioStore";

// Mock dependencies
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

jest.mock("@/shared/store/portfolioStore", () => ({
  usePortfolioStore: jest.fn(),
}));

// Mock window.scrollTo
const mockScrollTo = jest.fn();
window.scrollTo = mockScrollTo;

// Mock element.scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock window.open
const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

// Mock motion/react to avoid animation issues in tests and simplify DOM
jest.mock("motion/react", () => {
  const React = require("react");
  // Simple mock for motion components
  const MockDiv = React.forwardRef(function MockDivComp(
    { children, layoutId, initial, animate, exit, transition, ...props }: any,
    ref: any,
  ) {
    return (
      <div ref={ref} data-testid="motion-div" {...props}>
        {children}
      </div>
    );
  });

  const MockPath = React.forwardRef(function MockPathComp(
    { children, initial, animate, transition, ...props }: any,
    ref: any,
  ) {
    return (
      <path ref={ref} data-testid="motion-path" {...props}>
        {children}
      </path>
    );
  });

  const motion = {
    div: MockDiv,
    path: MockPath,
  };

  return {
    motion,
    AnimatePresence: function MockAnimatePresence({ children }: any) {
      return <>{children}</>;
    },
  };
});

describe("DockNavigation", () => {
  const mockSetTheme = jest.fn();
  const mockSetIsChatOpen = jest.fn();
  const mockOpenPlayground = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockWindowOpen.mockClear();

    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
    });

    jest.mocked(usePortfolioStore).mockReturnValue({
      setIsChatOpen: mockSetIsChatOpen,
    });

    // Set default window width to desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      isDark: true,
      showBackToTop: true,
      activeSection: "projects",
      openPlayground: mockOpenPlayground,
    };
    return render(<DockNavigation {...defaultProps} {...props} />);
  };

  it("renders correctly on desktop (open by default)", () => {
    renderComponent();
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    // Check all buttons are visible when open
    expect(screen.getByLabelText("Projects")).toBeInTheDocument();
    expect(screen.getByLabelText("Proficiency")).toBeInTheDocument();
    expect(screen.getByLabelText("Experience")).toBeInTheDocument();
    expect(screen.getByLabelText("Endorse")).toBeInTheDocument();
    expect(screen.getByLabelText("API Reference")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle Theme")).toBeInTheDocument();
    expect(screen.getByLabelText("Scroll to Top")).toBeInTheDocument();
  });

  it("renders correctly on mobile (closed by default)", async () => {
    // Set window width to mobile
    Object.defineProperty(window, "innerWidth", { value: 500 });

    renderComponent();

    // The menu toggle should still be there
    expect(screen.getByLabelText("Toggle Navigation")).toBeInTheDocument();

    // Other buttons should not be in the document (since AnimatePresence children won't render if isOpen is false)
    await waitFor(() => {
      expect(screen.queryByLabelText("Projects")).not.toBeInTheDocument();
    });
  });

  it("toggles menu when hamburger is clicked", () => {
    renderComponent();

    // Initially open on desktop
    expect(screen.getByLabelText("Projects")).toBeInTheDocument();

    // Click toggle to close
    fireEvent.click(screen.getByLabelText("Toggle Navigation"));
    expect(screen.queryByLabelText("Projects")).not.toBeInTheDocument();

    // Click toggle to open
    fireEvent.click(screen.getByLabelText("Toggle Navigation"));
    expect(screen.getByLabelText("Projects")).toBeInTheDocument();
  });

  it("scrolls to sections on button click", () => {
    renderComponent();

    // Mock getElementById
    const mockScrollIntoView = jest.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };
    jest.spyOn(document, "getElementById").mockReturnValue(mockElement as any);

    fireEvent.click(screen.getByLabelText("Projects"));
    expect(document.getElementById).toHaveBeenCalledWith("projects");
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

    fireEvent.click(screen.getByLabelText("Proficiency"));
    expect(document.getElementById).toHaveBeenCalledWith("proficiency");

    fireEvent.click(screen.getByLabelText("Experience"));
    expect(document.getElementById).toHaveBeenCalledWith("experience");

    fireEvent.click(screen.getByLabelText("Endorse"));
    expect(document.getElementById).toHaveBeenCalledWith("endorse");
  });

  it("handles interactions with utility buttons", () => {
    renderComponent();

    fireEvent.click(screen.getByLabelText("API Reference"));
    expect(mockWindowOpen).toHaveBeenCalledWith("/api/scalar", "_blank");

    fireEvent.click(screen.getByLabelText("Toggle Theme"));
    expect(mockSetTheme).toHaveBeenCalledWith("light"); // Current isDark is true

    fireEvent.click(screen.getByLabelText("Scroll to Top"));
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("shows tooltips on hover", () => {
    renderComponent();

    // Initially no tooltip
    expect(
      screen.queryByText("Projects", { selector: ".absolute" }),
    ).not.toBeInTheDocument();

    // Hover Projects
    fireEvent.mouseEnter(screen.getByLabelText("Projects"));
    expect(
      screen.getByText("Projects", { selector: ".absolute" }),
    ).toBeInTheDocument();

    // Unhover Projects
    fireEvent.mouseLeave(screen.getByLabelText("Projects"));
    expect(
      screen.queryByText("Projects", { selector: ".absolute" }),
    ).not.toBeInTheDocument();

    // Test a few others
    fireEvent.mouseEnter(screen.getByLabelText("API Reference"));
    expect(screen.getByText("API Reference")).toBeInTheDocument();
    fireEvent.mouseLeave(screen.getByLabelText("API Reference"));

    fireEvent.mouseEnter(screen.getByLabelText("Toggle Navigation"));
    expect(screen.getByText("Close Menu")).toBeInTheDocument();
  });

  it("hides back to top button when showBackToTop is false", () => {
    renderComponent({ showBackToTop: false });
    expect(screen.queryByLabelText("Scroll to Top")).not.toBeInTheDocument();
  });

  it("renders correctly with light theme", () => {
    renderComponent({ isDark: false });

    fireEvent.click(screen.getByLabelText("Toggle Theme"));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("shows correct tooltip for menu toggle based on state", () => {
    renderComponent(); // Open by default on desktop

    fireEvent.mouseEnter(screen.getByLabelText("Toggle Navigation"));
    expect(screen.getByText("Close Menu")).toBeInTheDocument();

    // Close the menu
    fireEvent.click(screen.getByLabelText("Toggle Navigation"));

    // Need to mouseEnter again as we might have lost hover state or just re-render
    fireEvent.mouseEnter(screen.getByLabelText("Toggle Navigation"));
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("shows active indicator for all active sections", () => {
    const { rerender } = render(
      <DockNavigation
        isDark={true}
        showBackToTop={true}
        activeSection="projects"
        openPlayground={mockOpenPlayground}
      />,
    );
    expect(
      screen
        .getByLabelText("Projects")
        .querySelector(".border-neu-accent\\/30"),
    ).toBeInTheDocument();

    rerender(
      <DockNavigation
        isDark={true}
        showBackToTop={true}
        activeSection="proficiency"
        openPlayground={mockOpenPlayground}
      />,
    );
    expect(
      screen
        .getByLabelText("Proficiency")
        .querySelector(".border-neu-accent\\/30"),
    ).toBeInTheDocument();

    rerender(
      <DockNavigation
        isDark={true}
        showBackToTop={true}
        activeSection="experience"
        openPlayground={mockOpenPlayground}
      />,
    );
    expect(
      screen
        .getByLabelText("Experience")
        .querySelector(".border-neu-accent\\/30"),
    ).toBeInTheDocument();

    rerender(
      <DockNavigation
        isDark={true}
        showBackToTop={true}
        activeSection="endorse"
        openPlayground={mockOpenPlayground}
      />,
    );
    expect(
      screen.getByLabelText("Endorse").querySelector(".border-neu-accent\\/30"),
    ).toBeInTheDocument();
  });

  it("shows tooltips for all buttons", () => {
    renderComponent();

    const buttons = [
      { label: "Projects", tooltip: "Projects" },
      { label: "Proficiency", tooltip: "Proficiency" },
      { label: "Experience", tooltip: "Experience" },
      { label: "Endorse", tooltip: "Endorse" },
      { label: "API Reference", tooltip: "API Reference" },
      { label: "Toggle Theme", tooltip: "Light Mode" },
      { label: "Scroll to Top", tooltip: "Back to Top" },
    ];

    buttons.forEach(({ label, tooltip }) => {
      fireEvent.mouseEnter(screen.getByLabelText(label));
      expect(
        screen.getByText(tooltip, { selector: ".absolute" }),
      ).toBeInTheDocument();
      fireEvent.mouseLeave(screen.getByLabelText(label));
      expect(
        screen.queryByText(tooltip, { selector: ".absolute" }),
      ).not.toBeInTheDocument();
    });
  });
});
