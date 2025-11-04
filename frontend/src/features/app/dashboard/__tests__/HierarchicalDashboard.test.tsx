import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, beforeEach } from "vitest";
import { Compass, FileStack } from "lucide-react";
import { MemoryRouter } from "react-router-dom";

import { HierarchicalDashboard } from "../HierarchicalDashboard";
import type { DashboardModule } from "../data/hierarchy";
import {
  DASHBOARD_SELECTION_STORAGE_KEY,
  useDashboardSelectionStore,
} from "../state/dashboardSelectionStore";

vi.mock("@/routing/nav/useNavigationContext", () => ({
  useNavBreadcrumbs: () => [],
}));

const sampleHierarchy: DashboardModule[] = [
  {
    id: "module-1",
    label: "وحدة تجريبية",
    description: "وصف تجريبي",
    icon: Compass,
    submodules: [
      {
        id: "submodule-1",
        label: "فرع تجريبي",
        description: "وصف فرعي",
        panels: [
          {
            id: "panel-1",
            label: "لوحة تجريبية",
            summary: "ملخص تجريبي",
            icon: FileStack,
            analytics: [
              { id: "metric-1", label: "مؤشر", value: "10" },
            ],
            actions: [
              {
                id: "action-owner",
                label: "إجراء المالك",
                description: "خاص بالمالك",
                type: "view",
                roles: ["domain-owner"],
              },
              {
                id: "action-operator",
                label: "إجراء التنفيذي",
                description: "خاص بالتنفيذي",
                type: "update",
                roles: ["operator"],
              },
              {
                id: "action-shared",
                label: "إجراء مشترك",
                description: "متاح للجميع",
                type: "view",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["تقرير تجريبي"],
          },
        ],
      },
    ],
  },
];

const createQueryResult = (data: DashboardModule[]) => ({
  data,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
});

const mockUseDashboardHierarchy = vi.hoisted(() => vi.fn());

vi.mock("../data/hierarchy", async () => {
  const actual = await vi.importActual<typeof import("../data/hierarchy")>(
    "../data/hierarchy",
  );

  return {
    ...actual,
    useDashboardHierarchy: mockUseDashboardHierarchy,
  };
});

beforeEach(() => {
  window.localStorage.removeItem(DASHBOARD_SELECTION_STORAGE_KEY);
  act(() => {
    useDashboardSelectionStore.getState().clearSelection();
  });
  mockUseDashboardHierarchy.mockReset();
  mockUseDashboardHierarchy.mockReturnValue(createQueryResult(sampleHierarchy));
});

const renderDashboard = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  render(
    <MemoryRouter initialEntries={["/control-center"]}>
      <QueryClientProvider client={queryClient}>
        <HierarchicalDashboard />
      </QueryClientProvider>
    </MemoryRouter>,
  );

  return queryClient;
};

test("يعرض إجراءات الدور الافتراضي", async () => {
  const client = renderDashboard();

  await waitFor(() => {
    expect(screen.getByText("إجراء المالك")).toBeInTheDocument();
  });

  expect(screen.getByText("إجراء مشترك")).toBeInTheDocument();
  expect(screen.queryByText("إجراء التنفيذي")).not.toBeInTheDocument();

  client.clear();
});

test("يتغير عرض الإجراءات عند تبديل الدور", async () => {
  const client = renderDashboard();

  await waitFor(() => {
    expect(screen.getByText("إجراء المالك")).toBeInTheDocument();
  });

  const operatorButton = screen.getByRole("button", { name: "مسؤول تنفيذي" });
  operatorButton.click();

  await waitFor(() => {
    expect(screen.getByText("إجراء التنفيذي")).toBeInTheDocument();
  });

  expect(screen.queryByText("إجراء المالك")).not.toBeInTheDocument();

  client.clear();
});
