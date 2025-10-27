import type React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { DashboardShell } from "../DashboardShell";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: new Proxy(
    {},
    {
      get: (_, element: string) =>
        ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
          const Component = element as keyof JSX.IntrinsicElements;
          return <Component {...props}>{children}</Component>;
        },
    },
  ),
}));

vi.mock("@shared/layout/Sidebar", () => ({
  Sidebar: ({ isOpen, onToggleCollapse }: { isOpen: boolean; onToggleCollapse?: () => void }) => (
    <aside data-testid="sidebar">
      <span>{isOpen ? "sidebar-open" : "sidebar-closed"}</span>
      {onToggleCollapse && (
        <button type="button" onClick={onToggleCollapse}>
          collapse
        </button>
      )}
    </aside>
  ),
}));

vi.mock("@legacy/components/layout/Header", () => ({
  Header: ({ onToggleSidebar }: { onToggleSidebar?: () => void }) => (
    <header data-testid="header">
      <button type="button" onClick={onToggleSidebar}>
        toggle-sidebar
      </button>
    </header>
  ),
}));

vi.mock("@app/dashboard/layout/DashboardBreadcrumbs", () => ({
  DashboardBreadcrumbs: () => <nav data-testid="breadcrumbs">breadcrumbs</nav>,
}));

vi.mock("@features/marketing/components/ui/AuroraBackground", () => ({
  AuroraBackground: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="aurora">{children}</div>
  ),
}));

vi.mock("@shared/hooks/useWindowSize", () => ({
  useWindowSize: () => ({ width: 1440, height: 900 }),
}));

vi.mock("@/nav/useNavigationContext", () => ({
  useNavBreadcrumbs: () => [{ id: "reports" }],
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("DashboardShell", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
  });

  it("renders layout chrome with toolbar and children", () => {
    const { container } = render(
      <MemoryRouter>
        <DashboardShell toolbar={<span>toolbar-action</span>}>
          <div>main-content</div>
        </DashboardShell>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toHaveTextContent("sidebar-open");
    expect(screen.getByText("toolbar-action")).toBeInTheDocument();
    expect(screen.getByText("main-content")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("allows collapsing the sidebar", () => {
    render(
      <MemoryRouter>
        <DashboardShell>
          <div />
        </DashboardShell>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("sidebar")).toHaveTextContent("sidebar-open");
    fireEvent.click(screen.getByText("toggle-sidebar"));
    expect(screen.getByTestId("sidebar")).toHaveTextContent("sidebar-closed");
  });
});
