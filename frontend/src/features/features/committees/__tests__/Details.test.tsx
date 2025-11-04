import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import { CommitteeDetails } from "../Details";
import { LanguageProvider } from "@/infrastructure/shared/contexts/LanguageContext";

vi.mock("../api", () => ({
  fetchCommittee: vi
    .fn()
    .mockResolvedValue({
      id: "1",
      name: "Committee A",
      location: "Loc",
      geo_area_name: "Area",
      geo_area_id: "1",
    }),
  deleteCommittee: vi.fn(),
  updateCommittee: vi.fn(),
  assignMembers: vi.fn(),
}));

test("renders committee details", async () => {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <MemoryRouter initialEntries={["/committees/1"]}>
          <Routes>
            <Route path="/committees/:id" element={<CommitteeDetails />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </QueryClientProvider>,
  );
  await waitFor(() =>
    expect(screen.getByText("Committee A")).toBeInTheDocument(),
  );
});
