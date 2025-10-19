import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "../input";
import { COLOR_TOKENS, SUPPORTING_TOKENS } from "@/styles/colorTokens";

let styleElement: HTMLStyleElement;

beforeAll(() => {
  styleElement = document.createElement("style");
  styleElement.setAttribute("data-test", "input-color-utilities");
  styleElement.innerHTML = `
    :root {
      --background: ${COLOR_TOKENS.background.hsl};
      --input: ${SUPPORTING_TOKENS.input.hsl};
      --muted-foreground: ${SUPPORTING_TOKENS.textMuted.hsl};
    }

    .bg-background { background-color: ${COLOR_TOKENS.background.hex}; }
    .border-input { border-color: ${SUPPORTING_TOKENS.input.hex}; }
    .placeholder\\:text-muted-foreground::placeholder { color: ${SUPPORTING_TOKENS.textMuted.hex}; }
  `;
  document.head.appendChild(styleElement);
});

afterAll(() => {
  if (styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement);
  }
});

describe("Input", () => {
  it("renders with the default styling and Arabic placeholder", () => {
    render(<Input placeholder="أدخل الاسم الكامل" aria-label="الاسم" />);

    const input = screen.getByRole("textbox", {
      name: "الاسم",
    }) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.placeholder).toBe("أدخل الاسم الكامل");
    expect(input.className).toContain("rounded-lg");
    expect(window.getComputedStyle(input).borderColor).toBe(
      "rgb(224, 224, 224)",
    );
  });

  it("renders an accessible textbox for English forms", () => {
    render(<Input placeholder="Full name" aria-label="full name" />);

    const input = screen.getByRole("textbox", { name: "full name" });
    expect(input).toHaveAttribute("placeholder", "Full name");
  });

  it("merges custom classes for English forms", () => {
    render(<Input placeholder="Campaign name" className="text-base" />);

    const input = screen.getByPlaceholderText("Campaign name");
    expect(input.className).toContain("text-base");
    expect(input.className).toContain("border");
  });

  it("merges custom class names with defaults", () => {
    const { container } = render(<Input className="text-primary" />);

    const input = container.querySelector("input");
    expect(input).toHaveClass("text-primary");
    expect(input).toHaveClass("w-full");
  });

  it("respects RTL direction when provided", () => {
    render(<Input defaultValue="القاهرة" dir="rtl" aria-label="المدينة" />);

    const input = screen.getByDisplayValue("القاهرة");
    expect(input).toHaveAttribute("dir", "rtl");
  });
});
