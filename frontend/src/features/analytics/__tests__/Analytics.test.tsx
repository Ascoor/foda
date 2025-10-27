import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { Analytics } from "../Analytics";

vi.mock("../api", () => ({
  fetchAnalytics: vi.fn().mockResolvedValue({
    id: 1,
    uuid: "snapshot-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    captured_at: new Date().toISOString(),
    payload: {},
    metrics_version: "v1",
    summary: {
      support_percentage: 62.5,
      turnout_estimate: 48.3,
      coverage_gap: 12.1,
    },
    regions: [
      {
        geo_area_uuid: "1",
        region: "Central",
        total_voters: 1000,
        active_agents: 25,
        reports_today: 5,
        support_score_avg: 61.2,
      },
    ],
    support_trends: [{ date: "2024-01-01", support_score_avg: 60 }],
    report_distribution: [{ type: "field", count: 5 }],
    generated_at: new Date().toISOString(),
    scope: "national",
    scope_uuid: "national",
  }),
}));

test("renders analytics title", async () => {
  render(<Analytics />);
  await waitFor(() => {
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });
});
