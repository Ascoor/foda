import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { VoterDetails } from "../Details";
import { LanguageProvider } from "@/infrastructure/shared/contexts/LanguageContext";

vi.mock("../api", () => ({
  fetchVoter: vi.fn().mockResolvedValue({
    id: "1",
    full_name: "Voter A",
    national_id: "123",
    gender: "male",
    mobile: "0100",
  }),
  deleteVoter: vi.fn(),
  updateVoter: vi.fn(),
}));

test("renders voter details", async () => {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <MemoryRouter initialEntries={["/voters/1"]}>
          <Routes>
            <Route path="/voters/:id" element={<VoterDetails />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </QueryClientProvider>,
  );
  await waitFor(() => expect(screen.getByText("Voter A")).toBeInTheDocument());
});
