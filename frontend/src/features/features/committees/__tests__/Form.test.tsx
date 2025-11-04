import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import { CommitteeForm } from "../Form";
import { LanguageProvider } from "@/infrastructure/shared/contexts/LanguageContext";

vi.mock("../api", () => ({
  fetchGeoAreas: vi.fn().mockResolvedValue({ data: [] }),
}));

test("submits committee form", async () => {
  const onSubmit = vi.fn();
  const qc = new QueryClient();
  localStorage.setItem("language", "en");
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <CommitteeForm
          onSubmit={onSubmit}
          defaultValues={{ name: "", location: "", geo_area_id: "1" }}
        />
      </LanguageProvider>
    </QueryClientProvider>,
  );
  fireEvent.change(screen.getByPlaceholderText("Committee Name"), {
    target: { value: "New" },
  });
  fireEvent.change(screen.getByPlaceholderText("Location"), {
    target: { value: "Loc" },
  });
  fireEvent.click(screen.getByText(/save/i));
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
});
