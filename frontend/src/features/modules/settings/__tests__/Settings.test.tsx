import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("../api", () => ({
  fetchSettings: vi
    .fn()
    .mockResolvedValue({
      language: "en",
      region: "US",
      allowRegistration: true,
    }),
  updateSettings: vi.fn(),
}));

vi.mock("@/infrastructure/shared/ui/sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { Settings } from "../Settings";
import { fetchSettings, updateSettings } from "../api";
import { toast } from "@/infrastructure/shared/ui/sonner";

const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
};

afterEach(() => {
  vi.clearAllMocks();
});

test("loads settings data", async () => {
  renderWithClient(<Settings />);
  expect(await screen.findByLabelText("Language")).toBeInTheDocument();
  expect(screen.getByLabelText("Region")).toHaveValue("US");
});

test("saves updated settings", async () => {
  renderWithClient(<Settings />);
  const region = await screen.findByLabelText("Region");
  fireEvent.change(region, { target: { value: "CA" } });
  fireEvent.click(screen.getByRole("button", { name: /save/i }));
  await waitFor(() =>
    expect(updateSettings).toHaveBeenCalledWith({
      language: "en",
      region: "CA",
      allowRegistration: true,
    }),
  );
  expect(toast.success).toHaveBeenCalled();
});

test("shows error when save fails", async () => {
  vi.mocked(updateSettings).mockRejectedValueOnce(new Error("fail"));
  renderWithClient(<Settings />);
  await screen.findByLabelText("Language");
  fireEvent.click(screen.getByRole("button", { name: /save/i }));
  await waitFor(() => expect(toast.error).toHaveBeenCalled());
});
