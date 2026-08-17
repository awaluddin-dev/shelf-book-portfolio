import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminDashboard from "@/views/admin-dashboard/ui/AdminDashboard";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("motion/react", () => ({
  motion: { div: (props: any) => <div {...props} /> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockRouter = { push: jest.fn() };

describe("AdminDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn();
    const store: Record<string, string> = {};
    Storage.prototype.getItem = jest.fn((key: string) => store[key] || null);
    Storage.prototype.setItem = jest.fn((key: string, value: string) => {
      store[key] = value;
    });
    Storage.prototype.removeItem = jest.fn((key: string) => {
      delete store[key];
    });
  });

  const setValidAuth = () => {
    const validToken = btoa(JSON.stringify({ exp: Date.now() / 1000 + 10000 }));
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "token") return `header.${validToken}.sig`;
      if (key === "isAdmin") return "true";
      return null;
    });
  };

  it("redirects to login if no token", () => {
    render(<AdminDashboard />);
    expect(mockRouter.push).toHaveBeenCalledWith("/admin/login");
  });

  it("redirects to login if token is expired", () => {
    const expiredToken = btoa(JSON.stringify({ exp: 0 }));
    Storage.prototype.getItem = jest
      .fn()
      .mockReturnValue(`header.${expiredToken}.sig`);
    render(<AdminDashboard />);
    expect(mockRouter.push).toHaveBeenCalledWith("/admin/login");
  });

  it("redirects to login if token is invalid", () => {
    Storage.prototype.getItem = jest.fn().mockReturnValue("invalid-token");
    render(<AdminDashboard />);
    expect(mockRouter.push).toHaveBeenCalledWith("/admin/login");
  });

  it("redirects to login if not admin", () => {
    const validToken = btoa(JSON.stringify({ exp: Date.now() / 1000 + 10000 }));
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "token") return `header.${validToken}.sig`;
      if (key === "isAdmin") return "false";
      return null;
    });
    render(<AdminDashboard />);
    expect(mockRouter.push).toHaveBeenCalledWith("/admin/login");
  });

  it("fetches data and renders dashboard properly", async () => {
    setValidAuth();
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: () => Promise.resolve({ data: {} }) })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            data: { testimonials: [{ id: 1, status: "pending" }] },
          }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            data: {
              heroConfig: { name: "Test Name", openForWork: false },
              metrics: [
                {
                  id: "1",
                  value: "5+",
                  label: "Exp",
                  icon: "Code2",
                  isSavings: false,
                },
              ],
            },
          }),
      });

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
    });
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText(/pending review/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Name")).toBeInTheDocument();
  });

  it("handles fetching data with different response structures", async () => {
    setValidAuth();
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: () => Promise.resolve({ data: {} }) })
      .mockResolvedValueOnce({
        json: () => Promise.resolve([{ id: 1, status: "pending" }]),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({ heroConfig: { name: "Alternative" }, metrics: [] }),
      });

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("Alternative")).toBeInTheDocument();
  });

  it("handles hero config modifications and save", async () => {
    setValidAuth();
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: () => Promise.resolve({ data: {} }) })
      .mockResolvedValueOnce({ json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            data: {
              heroConfig: { name: "", role: "", openForWork: false },
              metrics: [],
            },
          }),
      });

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
    });

    const toggleButtons = screen.getAllByRole("button");
    const toggleWorkBtn = toggleButtons[0];
    fireEvent.click(toggleWorkBtn);

    const nameInput = screen.getByPlaceholderText("Your full name");
    fireEvent.change(nameInput, { target: { value: "New Name" } });

    const roleInput = screen.getByPlaceholderText("e.g. Backend Engineer");
    fireEvent.change(roleInput, { target: { value: "New Role" } });

    const availableInput = screen.getByPlaceholderText("e.g. Now, Jan 2027");
    fireEvent.change(availableInput, { target: { value: "Now" } });

    const addMetricBtn = screen.getByText("Add Metric");
    fireEvent.click(addMetricBtn);

    const valueInputs = screen.getAllByDisplayValue("");
    fireEvent.change(valueInputs[0], { target: { value: "10" } });

    const saveBtn = screen.getByText("Save Changes");
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    await fireEvent.click(saveBtn);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/hero",
      expect.objectContaining({
        method: "PATCH",
        body: expect.any(String),
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Hero Section updated successfully"),
      ).toBeInTheDocument();
    });
  });

  it("handles metric changes and removal", async () => {
    setValidAuth();
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: () => Promise.resolve({ data: {} }) })
      .mockResolvedValueOnce({ json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            data: {
              heroConfig: {},
              metrics: [
                {
                  id: "m1",
                  value: "5",
                  label: "Years",
                  icon: "Code2",
                  isSavings: false,
                },
              ],
            },
          }),
      });

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    });

    const labelInput = screen.getByDisplayValue("Years");
    fireEvent.change(labelInput, { target: { value: "Months" } });

    const iconSelect = screen.getByDisplayValue("Code2");
    fireEvent.change(iconSelect, { target: { value: "Briefcase" } });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    const trashBtn = document.querySelector("button.bg-red-500");
    if (trashBtn) {
      fireEvent.click(trashBtn);
    }

    expect(screen.queryByDisplayValue("Months")).not.toBeInTheDocument();
  });

  it("handles save error", async () => {
    setValidAuth();
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: () => Promise.resolve({ data: {} }) })
      .mockResolvedValueOnce({ json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ data: { heroConfig: {}, metrics: [] } }),
      });

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
    });

    const saveBtn = screen.getByText("Save Changes");
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to update hero section"),
      ).toBeInTheDocument();
    });
  });
});
