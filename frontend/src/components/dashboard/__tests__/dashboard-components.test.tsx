import type React from "react";
import { render } from "@testing-library/react";

import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardFooter,
  DashboardCardHeader,
  DashboardCardSubtitle,
  DashboardCardTitle,
  DashboardTable,
  FilterBar,
  StatMetric,
  StackedBarChart,
  TrendLineChart,
} from "..";

vi.mock("recharts", () => {
  const createWrapper = (name: string) =>
    ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div data-recharts={name} {...props}>
        {children}
      </div>
    );

  return {
    ResponsiveContainer: createWrapper("ResponsiveContainer"),
    LineChart: createWrapper("LineChart"),
    Line: createWrapper("Line"),
    CartesianGrid: createWrapper("CartesianGrid"),
    XAxis: createWrapper("XAxis"),
    YAxis: createWrapper("YAxis"),
    Tooltip: createWrapper("Tooltip"),
    BarChart: createWrapper("BarChart"),
    Bar: createWrapper("Bar"),
    Legend: createWrapper("Legend"),
  };
});

describe("dashboard component library", () => {
  it("renders the primary building blocks", () => {
    const { container } = render(
      <div className="space-y-6">
        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Turnout Progress</DashboardCardTitle>
            <DashboardCardSubtitle>Week-over-week comparison</DashboardCardSubtitle>
          </DashboardCardHeader>
          <DashboardCardBody>
            <p>Card body content</p>
          </DashboardCardBody>
          <DashboardCardFooter>
            <span>Footer meta</span>
            <span>Last updated 2h ago</span>
          </DashboardCardFooter>
        </DashboardCard>

        <FilterBar
          options={[
            { id: "all", label: "All", active: true },
            { id: "north", label: "North", count: 4 },
            { id: "south", label: "South" },
          ]}
        />

        <StatMetric
          label="Active volunteers"
          value={1864}
          change="+128"
          trend="up"
          tone="success"
        />

        <DashboardTable
          columns={[
            { key: "district", label: "District" },
            { key: "turnout", label: "Turnout", align: "right" },
          ]}
          rows={[
            { district: "Mansoura", turnout: "72%" },
            { district: "Aga", turnout: "68%" },
          ]}
        />

        <TrendLineChart
          data={[
            { name: "Mon", value: 58 },
            { name: "Tue", value: 61 },
          ]}
        />

        <StackedBarChart
          data={[
            { name: "North", valueA: 320, valueB: 210 },
            { name: "Central", valueA: 280, valueB: 190 },
          ]}
        />
      </div>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
