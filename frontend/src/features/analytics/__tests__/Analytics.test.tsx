import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { Analytics } from "../Analytics";

vi.mock("../api", () => ({
  fetchAnalytics: vi.fn().mockResolvedValue({
    kpis: [{ name: "visitors", value: 10 }],
    heatmap: [0.1],
    funnel: [{ name: "Visited", value: 10 }],
  }),
}));

test("renders analytics title", async () => {
  render(<Analytics />);
  await waitFor(() => {
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });
});
