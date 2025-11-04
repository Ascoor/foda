import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { CandidatesList } from "../List";
import { LanguageProvider } from "@/infrastructure/shared/contexts/LanguageContext";

vi.mock("../api", () => ({
  fetchCandidates: vi.fn().mockResolvedValue({
    data: [
      {
        id: "1",
        name: "Candidate A",
        party: "Party",
        type: "individual",
        status: "active",
      },
    ],
    total: 1,
  }),
  deleteCandidate: vi.fn(),
  createCandidate: vi.fn(),
  updateCandidate: vi.fn(),
}));

test("renders candidates list", async () => {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <BrowserRouter>
          <CandidatesList />
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>,
  );
  await waitFor(() =>
    expect(screen.getByText("Candidate A")).toBeInTheDocument(),
  );
});
