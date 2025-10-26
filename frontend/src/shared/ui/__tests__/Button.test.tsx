import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, buttonVariants } from "../button";
import { COLOR_TOKENS } from "@/styles/colorTokens";

let styleElement: HTMLStyleElement;

beforeAll(() => {
  styleElement = document.createElement("style");
  styleElement.setAttribute("data-test", "color-utilities");
  styleElement.innerHTML = `
    :root {
      --primary: ${COLOR_TOKENS.primary.hsl};
      --primary-foreground: 0 0% 100%;
    }

    .bg-primary { background-color: ${COLOR_TOKENS.primary.hex}; }
    .text-primary-foreground { color: #ffffff; }
  `;
  document.head.appendChild(styleElement);
});

afterAll(() => {
  if (styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement);
  }
});

describe("Button", () => {
  it("renders the default button with Arabic text and primary styles", () => {
    render(<Button>ابدأ الآن</Button>);

    const button = screen.getByRole("button", { name: "ابدأ الآن" });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("h-11");
    expect(window.getComputedStyle(button).backgroundColor).toBe(
      "rgb(255, 87, 51)",
    );
  });

  it("merges custom classes with the glass variant", () => {
    render(
      <Button variant="glass" className="text-lg">
        متابعة الحملة
      </Button>,
    );

    const button = screen.getByRole("button", { name: "متابعة الحملة" });
    expect(button.className).toContain("glass-button");
    expect(button.className).toContain("text-lg");
  });

  it("applies the requested variant styles", () => {
    render(<Button variant="outline">Action</Button>);

    const button = screen.getByRole("button", { name: "Action" });
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("hover:bg-accent");
  });

  it("merges variant classes when requesting custom styling", () => {
    const customClass = "text-red-500";
    render(
      <Button variant="ghost" className={customClass}>
        Decorated
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Decorated" });
    expect(button).toHaveClass(customClass);
    expect(buttonVariants({ variant: "ghost" })).toContain("hover:bg-accent");
  });

  it("supports rendering as a child element for bilingual navigation", () => {
    render(
      <Button asChild variant="link">
        <a href="/ar/overview" dir="rtl">
          نظرة عامة / Overview
        </a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "نظرة عامة / Overview" });
    expect(link).toHaveAttribute("href", "/ar/overview");
    expect(link).toHaveAttribute("dir", "rtl");
  });
});
