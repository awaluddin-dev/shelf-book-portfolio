import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import AdminPlayground from "@/views/admin-playground/ui/AdminPlayground";
import { useTheme } from "next-themes";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

jest.mock("motion/react", () => ({
  motion: { div: (props: any) => <div {...props} /> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("AdminPlayground", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders with dark theme by default and allows toggling to light", () => {
    const setTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: "dark", setTheme });
    render(<AdminPlayground onClose={jest.fn()} />);
    expect(screen.getByText("Theme Playground")).toBeInTheDocument();
    expect(screen.getByText("Light")).toBeInTheDocument();
    const toggleBtn = screen.getByLabelText("Toggle Theme Mode");
    fireEvent.click(toggleBtn);
    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("renders with light theme and allows toggling to dark", () => {
    const setTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: "light", setTheme });
    render(<AdminPlayground onClose={jest.fn()} />);
    expect(screen.getByText("Dark")).toBeInTheDocument(); 
    const toggleBtn = screen.getByLabelText("Toggle Theme Mode");
    fireEvent.click(toggleBtn);
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("handles config updates and debounces application", async () => {
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: "dark", setTheme: jest.fn() });
    render(<AdminPlayground onClose={jest.fn()} />);
    const shadowBlurInput = screen.getAllByRole("slider")[1];
    fireEvent.change(shadowBlurInput, { target: { value: "32" } });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(document.documentElement.style.getPropertyValue("--shadow-neu")).toContain("32px");
  });

  it("handles color updates", () => {
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: "dark", setTheme: jest.fn() });
    render(<AdminPlayground onClose={jest.fn()} />);
    const bgInput = document.querySelector("input[type=color]") as HTMLInputElement;
    fireEvent.change(bgInput, { target: { value: "#ff0000" } });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(document.documentElement.style.getPropertyValue("--color-neu-bg")).toBe("#ff0000");
  });

  it("can enter and exit preview mode", () => {
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: "dark", setTheme: jest.fn() });
    render(<AdminPlayground onClose={jest.fn()} />);
    const previewBtn = screen.getByText("Preview");
    fireEvent.click(previewBtn);
    const exitPreviewBtn = screen.getByText("Exit Preview Mode");
    expect(exitPreviewBtn).toBeInTheDocument();
    fireEvent.click(exitPreviewBtn);
    expect(screen.queryByText("Exit Preview Mode")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: "dark", setTheme: jest.fn() });
    render(<AdminPlayground onClose={onClose} />);
    const closeBtn = screen.getByLabelText("Close Modal");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
  
  it("cleans up CSS variables on unmount", () => {
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: "dark", setTheme: jest.fn() });
    const { unmount } = render(<AdminPlayground onClose={jest.fn()} />);
    document.documentElement.style.setProperty("--color-neu-bg", "#000000");
    expect(document.documentElement.style.getPropertyValue("--color-neu-bg")).toBe("#000000");
    unmount();
    expect(document.documentElement.style.getPropertyValue("--color-neu-bg")).toBe("");
  });
});
