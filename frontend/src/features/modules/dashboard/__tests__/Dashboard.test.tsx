import { render, screen } from "@testing-library/react";
import { vi, beforeEach } from "vitest";
import { Dashboard } from "../Dashboard";
import { LanguageProvider } from "@/infrastructure/shared/contexts/LanguageContext";
import { CampaignProvider } from "@/infrastructure/shared/contexts/CampaignContext";

const mockUseApi = vi.fn();

vi.mock("@/infrastructure/shared/lib/api", () => ({
  useApi: (config: Record<string, unknown>) => mockUseApi(config),
}));

vi.mock("../components/LiveOperationsMap", () => ({
  LiveOperationsMap: () => <div data-testid="live-map" />,
}));

beforeEach(() => {
  mockUseApi.mockReset();
  window.localStorage.setItem("language", "en");
});

const renderDashboard = () =>
  render(
    <LanguageProvider>
      <CampaignProvider>
        <Dashboard />
      </CampaignProvider>
    </LanguageProvider>,
  );

test("displays stats from api", () => {
  mockUseApi.mockReturnValue({
    data: {
      stats: {
        total_elections: { value: 5, change: "+1%", trend: "up" },
        active_voters: { value: 10, change: "+1%", trend: "up" },
        total_candidates: { value: 2, change: "0%", trend: "up" },
        committees_count: { value: 3, change: "0%", trend: "up" },
      },
      activities: [],
      progress: {
        registration: 10,
        verification: 20,
        campaign: 30,
        voting: 40,
        overall: 50,
        remaining: 5,
      },
      turnout: Array(32).fill(50),
    },
    loading: false,
    error: null,
    execute: vi.fn().mockResolvedValue(undefined),
  });

  renderDashboard();
  expect(screen.getByText("Total Elections")).toBeInTheDocument();
});

test("shows error message on failure", () => {
  mockUseApi.mockReturnValue({
    data: null,
    loading: false,
    error: new Error("fail"),
    execute: vi.fn().mockResolvedValue(undefined),
  });

  renderDashboard();
  expect(screen.getByText("Failed to load dashboard data")).toBeInTheDocument();
});
