import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import { VoterForm } from "../Form";

test("submits voter form", async () => {
  const onSubmit = vi.fn();
  const qc = new QueryClient();
  localStorage.setItem("language", "en");
  render(
    <QueryClientProvider client={qc}>
      <VoterForm
        onSubmit={onSubmit}
        defaultValues={{
          full_name: "",
          national_id: "",
          birth_date: "2024-01-01",
          gender: "male",
          mobile: "",
          email: "a@a.com",
          address: "",
        }}
      />
    </QueryClientProvider>,
  );
  fireEvent.change(screen.getByPlaceholderText(/full name/i), {
    target: { value: "New" },
  });
  fireEvent.change(screen.getByPlaceholderText(/national id/i), {
    target: { value: "123" },
  });
  fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
    target: { value: "0100" },
  });
  fireEvent.click(screen.getByText(/save/i));
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
});
