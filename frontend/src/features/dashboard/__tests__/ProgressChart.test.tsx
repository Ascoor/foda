import { render, screen } from "@testing-library/react";
import { ProgressChart } from "../components/ProgressChart";
import { LanguageProvider } from "@shared/contexts/LanguageContext";

test("renders progress chart", () => {
  const data = [
    { label: "dashboard.registration", value: 50, color: "primary" as const },
  ];
  render(
    <LanguageProvider>
      <ProgressChart data={data} overall={60} remaining={10} />
    </LanguageProvider>,
  );
  expect(screen.getByText(/overall progress/i)).toBeInTheDocument();
  expect(screen.getByText(/remaining/i)).toBeInTheDocument();
});
