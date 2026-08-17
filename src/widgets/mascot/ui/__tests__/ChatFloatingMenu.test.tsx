import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatFloatingMenu } from "../ChatFloatingMenu";
import { usePortfolioStore } from "@/shared/store/portfolioStore";

// Mock the store
jest.mock("@/shared/store/portfolioStore", () => ({
  usePortfolioStore: jest.fn(),
}));

describe("ChatFloatingMenu", () => {
  let setIsChatOpenMock: jest.Mock;
  let setShowCoverLetterModalMock: jest.Mock;

  beforeEach(() => {
    setIsChatOpenMock = jest.fn();
    setShowCoverLetterModalMock = jest.fn();

    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      setIsChatOpen: setIsChatOpenMock,
      setShowCoverLetterModal: setShowCoverLetterModalMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(<ChatFloatingMenu isOpen={false} onClose={jest.fn()} />);
    expect(screen.queryByText("Options")).not.toBeInTheDocument();
  });

  it("renders correctly when isOpen is true", () => {
    render(<ChatFloatingMenu isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText("Options")).toBeInTheDocument();
    expect(screen.getByText("Cover Letter")).toBeInTheDocument();
    expect(screen.getByText("AI Chat")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onCloseMock = jest.fn();
    const { container } = render(<ChatFloatingMenu isOpen={true} onClose={onCloseMock} />);
    
    // The close button is the one with X icon, we can find it by button next to "Options"
    const closeButton = container.querySelector("button");
    if (closeButton) {
      fireEvent.click(closeButton);
    }
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("handles Cover Letter button click", async () => {
    const onCloseMock = jest.fn();
    render(<ChatFloatingMenu isOpen={true} onClose={onCloseMock} />);
    
    const coverLetterBtn = screen.getByText("Cover Letter");
    fireEvent.click(coverLetterBtn);
    
    expect(setShowCoverLetterModalMock).toHaveBeenCalledWith(true);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("handles AI Chat button click", async () => {
    const onCloseMock = jest.fn();
    render(<ChatFloatingMenu isOpen={true} onClose={onCloseMock} />);
    
    const aiChatBtn = screen.getByText("AI Chat");
    fireEvent.click(aiChatBtn);
    
    expect(setIsChatOpenMock).toHaveBeenCalledWith(true);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
