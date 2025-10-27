import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { AuthProvider } from "@modules/auth";
import { Login } from "../Login";
import api from "@shared/lib/api";

vi.mock("@shared/lib/api", () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: { token: "t" } })),
  },
  setAuthToken: vi.fn(),
}));

test("renders login form and submits", async () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>,
  );

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "user@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "secret123" },
  });
  fireEvent.click(screen.getByRole("button", { name: /log in/i }));

  await waitFor(() => {
    expect(api.post).toHaveBeenCalled();
  });
});
