---
title: "UI Components"
author: "Frontend Guild"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# UI Components & Styling Guide

## Purpose
- Outline the shared UI conventions that govern Elections360's React interface.
- Provide onboarding context for RTL/LTR support, design tokens, and component testing.

## Design System Foundations
- TailwindCSS with a custom glassmorphism plugin exposes utilities like `glass`, `glass-card`, and `glass-button` built from tokens in `src/styles/variables.css`.
- Typography provided through Google-hosted `Inter` and `Noto Kufi Arabic` fonts declared once in `frontend/index.html`.
- Color palette centralized in `src/styles/colorTokens.ts`; import tokens rather than redefining raw values.
- Shared UI primitives live under `frontend/src/shared/ui` (Button, Input, Select, Dialog, SafeDataRenderer) and follow shadcn/ui composition patterns.

## Asset Handling
- Static media resides under `frontend/src/assets`; Vite hashes bundles for cache busting.
- Use the `@` alias when importing assets (e.g., `import hero from '@/assets/img/hero.svg'`).
- JSON-driven content should import assets at the top of the module before assigning to configuration arrays to keep TypeScript checks active.

## Testing Expectations
- Run component tests with `npm run test`; Vitest is configured with Testing Library via `src/test/setup.ts`.
- Regression coverage exists for shared Button/Input components verifying RTL rendering, `asChild` support, and dynamic states.
- New components should include tests for bilingual content and state transitions using the SafeDataRenderer conventions.

## Implementation Notes
- Tailwind configuration lives in `frontend/tailwind.config.ts`; add custom utilities/plugins there to keep the system centralized.
- Avoid reintroducing legacy CSS from `App.css`; rely on tokens and shared utilities.
- Document additional build or lint steps within `docs/frontend/feature-guides.md` to keep the engineering team aligned.

## Next Actions
1. Publish Storybook or Ladle stories for shared UI components to accelerate design QA.
2. Expand Vitest coverage to include forms, modals, and layout primitives in `frontend/src/shared/layout`.
3. Capture screenshots of RTL/LTR variants when introducing major components.
4. Automate visual regression checks in CI for critical flows (dashboard, voters, agents).
