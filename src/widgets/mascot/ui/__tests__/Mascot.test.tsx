import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { Mascot } from "../Mascot";

jest.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark" }),
}));

jest.mock("../SpeechBubble", () => ({
  SpeechBubble: ({ text, showButton, onClose }: any) => (
    <div data-testid="speech-bubble">
      <span>{text}</span>
      {showButton && <button onClick={onClose} data-testid="close-btn">Close</button>}
    </div>
  ),
}));

jest.mock("../MascotSvg", () => ({
  MascotSvg: ({ isDark }: any) => <div data-testid={`mascot-svg-${isDark ? "dark" : "light"}`} />,
}));

jest.mock("../ChatSvg", () => ({
  ChatSvg: ({ onClick }: any) => <div data-testid="chat-svg" onClick={onClick} />,
}));

jest.mock("../ChatFloatingMenu", () => ({
  ChatFloatingMenu: ({ isOpen, onClose }: any) => isOpen ? (
    <div data-testid="chat-floating-menu">
      <button onClick={onClose} data-testid="menu-close-btn">Close Menu</button>
    </div>
  ) : null,
}));

describe("Mascot", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should not be visible initially", () => {
    render(<Mascot />);
    expect(screen.queryByTestId("mascot-svg-dark")).not.toBeInTheDocument();
  });

  it("should become visible after timeSpawn and show greet", () => {
    render(<Mascot />);
    
    act(() => {
      jest.advanceTimersByTime(45000); // default timeSpawn
    });

    expect(screen.getByTestId("mascot-svg-dark")).toBeInTheDocument();
    expect(screen.getByText("Hello, I think you like this portfolio!")).toBeInTheDocument();
  });

  it("should sequence through states", () => {
    render(<Mascot />);
    
    // Greet
    act(() => {
      jest.advanceTimersByTime(45000);
    });
    expect(screen.getByText("Hello, I think you like this portfolio!")).toBeInTheDocument();

    // Normal
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Are you looking for a backend engineer?")).toBeInTheDocument();

    // Happy
    act(() => {
      jest.advanceTimersByTime(5300); // 10300 total from spawn
    });
    expect(screen.getByText("I highly recommend trying my Cover Letter Generator!")).toBeInTheDocument();

    // Show button
    act(() => {
      jest.advanceTimersByTime(1700); // 12000 total from spawn
    });
    expect(screen.getByTestId("close-btn")).toBeInTheDocument();

    // Chat mode
    act(() => {
      jest.advanceTimersByTime(8300); // 20300 total from spawn
    });
    expect(screen.getByTestId("chat-svg")).toBeInTheDocument();
    expect(screen.queryByTestId("speech-bubble")).not.toBeInTheDocument();
  });

  it("handles onClose correctly", () => {
    render(<Mascot />);
    
    // Advance to where button is visible
    act(() => {
      jest.advanceTimersByTime(45000 + 12000);
    });

    const closeBtn = screen.getByTestId("close-btn");
    expect(closeBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(closeBtn);
    });

    expect(screen.getByText("See you!")).toBeInTheDocument();
    expect(screen.queryByTestId("close-btn")).not.toBeInTheDocument();

    // Advance 2s to chat mode
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByTestId("chat-svg")).toBeInTheDocument();
  });

  it("handles ChatFloatingMenu open and close", () => {
    render(<Mascot />);
    
    // Advance to chat mode directly
    act(() => {
      jest.advanceTimersByTime(45000 + 20300);
    });

    const chatSvg = screen.getByTestId("chat-svg");
    
    // Open menu
    act(() => {
      fireEvent.click(chatSvg);
    });
    
    expect(screen.getByTestId("chat-floating-menu")).toBeInTheDocument();

    // Close menu
    const menuCloseBtn = screen.getByTestId("menu-close-btn");
    act(() => {
      fireEvent.click(menuCloseBtn);
    });

    expect(screen.queryByTestId("chat-floating-menu")).not.toBeInTheDocument();
  });
});
