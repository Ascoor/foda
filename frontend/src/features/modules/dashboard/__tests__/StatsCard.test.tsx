import { render, screen } from "@testing-library/react";
import { StatsCard } from "../components/StatsCard";
import { LanguageProvider } from "@/infrastructure/shared/contexts/LanguageContext";
import { Vote } from "lucide-react";

test("renders stats card with data", () => {
  render(
    <LanguageProvider>
      <StatsCard
        title="dashboard.total_elections"
        value="10"
        change="+5%"
        trend="up"
        icon={Vote}
        color="primary"
      />
    </LanguageProvider>,
  );
  expect(screen.getByText("10")).toBeInTheDocument();
  expect(screen.getByText("Total Elections")).toBeInTheDocument();
});
