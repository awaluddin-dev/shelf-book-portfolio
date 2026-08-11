import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminArchitecture from "@/views/admin-architecture/ui/AdminArchitecture";

jest.mock("@/widgets/admin-project-linked-cards/ui/AdminProjectLinkedCards", () => ({
  AdminProjectLinkedCards: (props: any) => {
    const [formData, setFormData] = React.useState(props.defaultFormData);
    return (
      <div data-testid="admin-project-linked-cards">
        <h1>{props.title}</h1>
        <div data-testid="extractor-1">{JSON.stringify(props.itemDataExtractor({ data: [{ id: 1 }] }))}</div>
        <div data-testid="extractor-2">{JSON.stringify(props.itemDataExtractor([{ id: 2 }]))}</div>
        <div data-testid="extractor-3">{JSON.stringify(props.itemDataExtractor({ foo: "bar" }))}</div>
        <div data-testid="on-before-save">{JSON.stringify(props.onBeforeSave({ order: "42", imageUrl: "test.png" }))}</div>
        <div data-testid="render-form">{props.renderForm(formData, setFormData)}</div>
        <div data-testid="render-card-1">{props.renderCardDisplay({ order: 1, imageUrl: "http://example.com/img.png", description: "Test description" })}</div>
        <div data-testid="render-card-2">{props.renderCardDisplay({ order: 2, imageUrl: "", description: "" })}</div>
      </div>
    );
  }
}));

describe("AdminArchitecture", () => {
  it("renders correctly and passes correct props", () => {
    render(<AdminArchitecture />);
    expect(screen.getByText("System Architecture Nodes")).toBeInTheDocument();
    expect(screen.getByTestId("extractor-1")).toHaveTextContent("[{\"id\":1}]");
    expect(screen.getByTestId("extractor-2")).toHaveTextContent("[{\"id\":2}]");
    expect(screen.getByTestId("extractor-3")).toHaveTextContent("[]");
    expect(screen.getByTestId("on-before-save")).toHaveTextContent("{\"order\":42,\"imageUrl\":\"test.png\"}");
  });

  it("handles form interactions", () => {
    render(<AdminArchitecture />);
    const orderInput = screen.getByPlaceholderText("Order (e.g. 0)");
    const imageInput = screen.getByPlaceholderText("Image URL (e.g. /assets/arch1.png)");
    const descInput = screen.getByPlaceholderText("Description (optional)");
    fireEvent.change(orderInput, { target: { value: "5" } });
    fireEvent.change(imageInput, { target: { value: "/test.png" } });
    fireEvent.change(descInput, { target: { value: "New description" } });
    expect(orderInput).toHaveValue(5);
    expect(imageInput).toHaveValue("/test.png");
    expect(descInput).toHaveValue("New description");
    fireEvent.change(orderInput, { target: { value: "invalid" } });
    expect(orderInput).toHaveValue(0);
  });

  it("renders card displays correctly", () => {
    render(<AdminArchitecture />);
    const card1 = screen.getByTestId("render-card-1");
    expect(card1).toHaveTextContent("1");
    expect(card1).toHaveTextContent("Test description");
    const img = screen.getByAltText("Architecture Preview");
    expect(img).toHaveAttribute("src", "http://example.com/img.png");
    const card2 = screen.getByTestId("render-card-2");
    expect(card2).toHaveTextContent("2");
    expect(card2).toHaveTextContent("No image URL provided");
  });
});
