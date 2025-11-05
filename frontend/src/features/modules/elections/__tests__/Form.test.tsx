import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import { ElectionForm } from "../Form";
import { LanguageProvider } from "@/infrastructure/shared/contexts/LanguageContext";

test("submits election form", async () => {
  const onSubmit = vi.fn();
  const qc = new QueryClient();
  localStorage.setItem("language", "en");
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <ElectionForm
          onSubmit={onSubmit}
          defaultValues={{
            name: "",
            type: "presidential",
            start_date: "2024-01-01",
            end_date: "2024-01-02",
            description: "",
          }}
        />
      </LanguageProvider>
    </QueryClientProvider>,
  );
  fireEvent.change(screen.getByPlaceholderText("Election Name"), {
    target: { value: "New" },
  });
  fireEvent.click(screen.getByText(/save/i));
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
});
