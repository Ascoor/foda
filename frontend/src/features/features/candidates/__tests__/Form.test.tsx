import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import { CandidateForm } from "../Form";
import { LanguageProvider } from "@/infrastructure/shared/contexts/LanguageContext";

test("submits candidate form", async () => {
  const onSubmit = vi.fn();
  const qc = new QueryClient();
  localStorage.setItem("language", "en");
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <CandidateForm
          onSubmit={onSubmit}
          defaultValues={{
            name: "",
            party: "",
            type: "individual",
            status: "active",
          }}
        />
      </LanguageProvider>
    </QueryClientProvider>,
  );
  fireEvent.change(screen.getByPlaceholderText("Candidate Name"), {
    target: { value: "New" },
  });
  fireEvent.change(screen.getByPlaceholderText("Party"), {
    target: { value: "P" },
  });
  fireEvent.click(screen.getByText(/save/i));
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
});
