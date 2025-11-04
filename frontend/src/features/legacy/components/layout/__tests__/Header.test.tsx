import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { MouseEvent, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { vi, beforeEach, afterEach, describe, test, expect } from "vitest";
import { Header } from "../Header";

const toggleThemeMock = vi.fn();
let themeValue: "light" | "dark" = "light";

vi.mock("@/infrastructure/shared/contexts/ThemeContext", () => ({
  useTheme: () => ({
    theme: themeValue,
    toggleTheme: toggleThemeMock,
    setTheme: vi.fn(),
  }),
}));

const toggleLanguageMock = vi.fn();
const setLanguageMock = vi.fn();
let languageValue: "en" | "ar" = "en";

const logoutMock = vi.fn(() => Promise.resolve());
const userValue = { name: "Test User" };

vi.mock("@/infrastructure/shared/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: userValue,
    logout: logoutMock,
  }),
}));

vi.mock("@/infrastructure/shared/contexts/NotificationContext", () => ({
  useNotifications: () => ({
    unreadCount: 3,
  }),
}));

vi.mock("@/infrastructure/shared/hooks/useWindowSize", () => ({
  useWindowSize: () => ({ width: 1280, height: 720 }),
}));

vi.mock("@/infrastructure/shared/ui/dropdown-menu", () => {
  const DropdownMenu = ({ children }: { children: ReactNode }) => (
    <>{children}</>
  );
  const DropdownMenuTrigger = ({ children }: { children: ReactNode }) => (
    <>{children}</>
  );
  const DropdownMenuContent = ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  );
  const DropdownMenuItem = ({
    children,
    onSelect,
  }: {
    children: ReactNode;
    onSelect?: (event: MouseEvent<HTMLDivElement>) => void;
  }) => (
    <div role="menuitem" onClick={(event) => onSelect?.(event)}>
      {children}
    </div>
  );

  return {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  };
});

const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const mockUseLanguage = (globalThis as any).__mockUseLanguage as ReturnType<
  typeof vi.fn
>;

const configureLanguage = (language: "en" | "ar") => {
  languageValue = language;
  mockUseLanguage.mockReturnValue({
    language,
    direction: language === "ar" ? "rtl" : "ltr",
    toggleLanguage: toggleLanguageMock,
    setLanguage: setLanguageMock,
    t: (key: string) => key,
  });
};

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header onToggleSidebar={vi.fn()} />
    </MemoryRouter>,
  );

beforeEach(() => {
  toggleThemeMock.mockClear();
  toggleLanguageMock.mockClear();
  setLanguageMock.mockClear();
  logoutMock.mockClear();
  navigateMock.mockClear();
  configureLanguage("en");
  themeValue = "light";
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Header", () => {
  test("calls theme toggle when the theme button is clicked", () => {
    renderHeader();

    const button = screen.getByLabelText("Switch to dark mode");
    fireEvent.click(button);

    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });

  test("calls language toggle when the language button is clicked", () => {
    renderHeader();

    const button = screen.getByLabelText("Toggle language");
    fireEvent.click(button);

    expect(toggleLanguageMock).toHaveBeenCalledTimes(1);
  });

  test("localizes aria labels when Arabic is active", () => {
    configureLanguage("ar");
    themeValue = "dark";

    renderHeader();

    expect(screen.getByLabelText("تغيير اللغة")).toBeInTheDocument();
    expect(screen.getByLabelText("تفعيل الوضع الفاتح")).toBeInTheDocument();
  });

  test("opens the user menu and logs out when selecting logout", async () => {
    renderHeader();

    const logoutItem = screen.getByText("Logout");
    fireEvent.click(logoutItem);

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });

    expect(navigateMock).toHaveBeenCalledWith("/", { replace: true });
  });
});
