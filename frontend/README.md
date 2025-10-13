# FODA Frontend Workflow Guide

This document summarizes the current workflow for building the FODA election management interface in both Arabic and English. It reflects the latest performance improvements, asset handling strategy, and automated tests introduced during the UI enhancement phase.

## UI and performance guidelines

- **Tailwind glassmorphism utilities**: reusable classes such as `glass`, `glass-card`, and `glass-button` are provided through a custom Tailwind CSS plugin (`glassmorphismPlugin`). They automatically consume the design tokens defined in `src/styles/variables.css`, so avoid redefining these classes in component-level styles.
- **Font loading**: the project now requests only the `Inter` and `Noto Kufi Arabic` families from Google Fonts with the most commonly used weights (400, 600, 700). This keeps Arabic and English typography aligned while reducing font requests during the initial paint.
- **Design tokens**: continue relying on CSS variables in `src/styles/variables.css` for colors, spacing, and typography. This ensures consistent rendering between RTL and LTR layouts.

## Asset management

- Place static media under `src/assets`. Images previously served from `public/img` now live in `src/assets/img` so that Vite can hash and optimize them during the build.
- Import assets via the `@` alias (for example, `import logo from '@/assets/img/partner-1.svg'`) instead of hard-coding `/img/...` paths.
- When referencing assets in JSON-like data files, import them at the top of the file before assigning them to your configuration objects. This allows TypeScript and the bundler to validate paths at compile time.

## Testing workflow

- Run the UI test suite with:
  - `npm run test`
- Vitest is configured with Testing Library in `src/test/setup.ts`. The suite now includes coverage for the shared `Button` and `Input` components, verifying class composition, RTL friendliness, and the `asChild` slot behaviour. Use these examples when adding new component tests, especially when validating Arabic and English content simultaneously.

## Development tooling

- Tailwind configuration resides in `tailwind.config.ts`. Custom plugins should be added there to keep utility classes colocated with the design system.
- Keep the documentation up to date when you introduce new build steps or shared conventions so the bilingual engineering team can follow the same workflow.
