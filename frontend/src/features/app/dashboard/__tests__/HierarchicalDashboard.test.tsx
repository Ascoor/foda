import { act, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, beforeEach, test, expect } from "vitest";
import { Compass, FileStack } from "lucide-react";
import { MemoryRouter } from "react-router-dom";

import { I18nextProvider } from "react-i18next";

import { HierarchicalDashboard } from "../HierarchicalDashboard";
import type { DashboardModule } from "../data/hierarchy";
import {
  DASHBOARD_SELECTION_STORAGE_KEY,
  useDashboardSelectionStore,
} from "../state/dashboardSelectionStore";
import i18n from "@/infrastructure/i18n";

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
            media: {
              image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjwvc3ZnPg==",
              title: "مرشح تجريبي",
              subtitle: "الدائرة الأولى",
              description: "أعلى تفاعل جماهيري خلال الأسبوع",
              badges: [
                {
                  id: "badge-leading",
                  label: "متصدر",
                  tone: "positive",
                },
              ],
            },
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

const findControlPanel = async () => {
  const headings = await screen.findAllByRole("heading", { name: "لوحة العمليات" });
  const section = headings
    .map((heading) => heading.closest("section"))
    .find((container): container is HTMLElement => Boolean(container));

  if (!section) {
    throw new Error("تعذر العثور على عنصر لوحة التحكم");
  }

  return section;
};

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
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <HierarchicalDashboard />
        </QueryClientProvider>
      </I18nextProvider>
    </MemoryRouter>,
  );

  return queryClient;
};

test("يعرض إجراءات الدور الافتراضي", async () => {
  const client = renderDashboard();

  const controlPanel = await findControlPanel();

  expect(
    within(controlPanel).getByText("إجراء المالك", { selector: "span" }),
  ).toBeInTheDocument();
  expect(
    within(controlPanel).getByText("إجراء مشترك", { selector: "span" }),
  ).toBeInTheDocument();
  expect(
    within(controlPanel).queryByText("إجراء التنفيذي", { selector: "span" }),
  ).not.toBeInTheDocument();

  client.clear();
});

test("يتغير عرض الإجراءات عند تبديل الدور", async () => {
  const client = renderDashboard();

  const controlPanel = await findControlPanel();

  const operatorButton = screen.getAllByRole("button", {
    name: "مسؤول تنفيذي",
  })[0];
  operatorButton.click();

  await waitFor(() => {
    expect(
      within(controlPanel).getByText("إجراء التنفيذي", { selector: "span" }),
    ).toBeInTheDocument();
  });

  expect(
    within(controlPanel).queryByText("إجراء المالك", { selector: "span" }),
  ).not.toBeInTheDocument();

  client.clear();
});

test("يعرض وسائط المرشح وشاراته في لوحة التحكم", async () => {
  const client = renderDashboard();

  const controlPanel = await findControlPanel();

  expect(
    within(controlPanel).getByText("مرشح تجريبي", { selector: "p" }),
  ).toBeInTheDocument();
  expect(within(controlPanel).getByAltText("مرشح تجريبي")).toBeInTheDocument();
  expect(
    within(controlPanel).getByText("الدائرة الأولى", { selector: "p" }),
  ).toBeInTheDocument();
  expect(
    within(controlPanel).getByText("أعلى تفاعل جماهيري خلال الأسبوع", {
      selector: "p",
    }),
  ).toBeInTheDocument();
  expect(
    within(controlPanel).getByText("متصدر", { selector: "span" }),
  ).toBeInTheDocument();

  client.clear();
});
