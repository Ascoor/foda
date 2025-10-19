import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { CampaignsList } from "../CampaignsList";

vi.mock("../api", () => ({
  fetchCampaigns: vi
    .fn()
    .mockResolvedValue([
      {
        id: "1",
        name: "Camp A",
        message: "",
        sent: 0,
        delivered: 0,
        created_at: "2024-01-01T00:00:00Z",
      },
    ]),
  deleteCampaign: vi.fn(),
  sendCampaign: vi.fn(),
}));

test("renders campaigns list", async () => {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <CampaignsList />
      </BrowserRouter>
    </QueryClientProvider>,
  );
  await waitFor(() => expect(screen.getByText("Camp A")).toBeInTheDocument());
});
