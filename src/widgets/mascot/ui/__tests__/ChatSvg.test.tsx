import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { ChatSvg } from "../ChatSvg";

describe("ChatSvg", () => {
  it("renders correctly with default props", () => {
    const { container } = render(<ChatSvg />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("applies className if provided", () => {
    const { container } = render(<ChatSvg className="test-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("test-class");
  });

  it("handles click events", () => {
    const onClickMock = jest.fn();
    const { container } = render(<ChatSvg onClick={onClickMock} />);
    const svg = container.querySelector("svg");
    if (svg) {
      fireEvent.click(svg);
    }
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("handles Enter key down event", () => {
    const onClickMock = jest.fn();
    const { container } = render(<ChatSvg onClick={onClickMock} />);
    const svg = container.querySelector("svg");
    if (svg) {
      fireEvent.keyDown(svg, { key: "Enter" });
    }
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("handles Space key down event", () => {
    const onClickMock = jest.fn();
    const { container } = render(<ChatSvg onClick={onClickMock} />);
    const svg = container.querySelector("svg");
    if (svg) {
      fireEvent.keyDown(svg, { key: " " });
    }
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("ignores other key down events", () => {
    const onClickMock = jest.fn();
    const { container } = render(<ChatSvg onClick={onClickMock} />);
    const svg = container.querySelector("svg");
    if (svg) {
      fireEvent.keyDown(svg, { key: "Escape" });
    }
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it("renders with light theme colors", () => {
    const { container } = render(<ChatSvg isDark={false} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    // we can check if it renders without crashing
  });
});
