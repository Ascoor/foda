import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

import { COLOR_TOKENS, SUPPORTING_TOKENS } from "../colorTokens";

const readCss = () => {
  const filePath = path.resolve(__dirname, "..", "..", "theme", "theme.css");
  return fs.readFileSync(filePath, "utf-8");
};

describe("design tokens", () => {
  it("exposes the shared color palette as CSS custom properties", () => {
    const css = readCss();
    Object.values(COLOR_TOKENS).forEach(({ hsl }) => {
      expect(css).toContain(hsl);
    });
    Object.values(SUPPORTING_TOKENS).forEach(({ hsl }) => {
      expect(css).toContain(hsl);
    });
  });

  it("keeps primary and secondary colors aligned between CSS and TypeScript maps", () => {
    const css = readCss();
    expect(css).toMatch(
      new RegExp(`--color-primary: ${COLOR_TOKENS.primary.hsl};`),
    );
    expect(css).toMatch(
      new RegExp(`--color-secondary: ${COLOR_TOKENS.secondary.hsl};`),
    );
    expect(css).toMatch(
      new RegExp(`--color-accent: ${COLOR_TOKENS.accent.hsl};`),
    );
  });
});
