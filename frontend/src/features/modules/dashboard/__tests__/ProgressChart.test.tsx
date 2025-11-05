import { render, screen } from "@testing-library/react";
import { ProgressChart } from "../components/ProgressChart";
import { LanguageProvider } from "@/infrastructure/shared/contexts/LanguageContext";

test("renders progress chart", () => {
  const data = [
    { label: "dashboard.registration", value: 50, color: "primary" as const },
  ];
  render(
    <LanguageProvider>
      <ProgressChart data={data} overall={60} remaining={10} />
    </LanguageProvider>,
  );
  expect(screen.getByText("Registration")).toBeInTheDocument();
  expect(screen.getByText("50%")).toBeInTheDocument();
  expect(screen.getByText("Overall Progress")).toBeInTheDocument();
});
