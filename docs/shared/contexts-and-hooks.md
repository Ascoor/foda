---
title: "Contexts and Hooks"
author: "Frontend Guild"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# Shared Contexts & Hooks

## Purpose
- Document reusable React contexts and hooks located under `frontend/src/shared`.
- Ensure teams understand ownership, responsibilities, and extension patterns.

## Contexts
| Context | Location | Responsibilities |
| --- | --- | --- |
| `AuthContext` | `frontend/src/shared/contexts/AuthContext.tsx` | Stores authenticated user, Sanctum token, login/logout helpers, and exposes `withAuthorizationHeader` util. |
| `LanguageContext` | `frontend/src/shared/contexts/LanguageContext.tsx` | Controls Arabic/English locale switching and persists preference across sessions. |
| `NotificationContext` | `frontend/src/shared/contexts/NotificationContext.tsx` | Queues in-app notifications and integrates with Sonner toasts. |
| `ThemeContext` | `frontend/src/shared/contexts/ThemeContext.tsx` | Manages light/dark themes, orchestrating design tokens and CSS variable updates. |

## Hooks
| Hook | Location | Description |
| --- | --- | --- |
| `useToast` | `frontend/src/shared/hooks/use-toast.ts` | Exposes consistent success/error toasts consumed by feature modules. |
| `useMobile` | `frontend/src/shared/hooks/use-mobile.tsx` | Detects viewport breakpoints for responsive behaviour. |
| `useThemePalette` | `frontend/src/shared/hooks/useThemePalette.ts` | Reads the active theme palette and returns semantic color tokens. |
| `useWindowSize` | `frontend/src/shared/hooks/useWindowSize.ts` | Tracks window dimensions with throttled resize listeners. |

## Extension Guidelines
- Re-export new contexts from `frontend/src/shared/contexts/index.ts` to keep imports uniform.
- Avoid storing module-specific data in shared contexts; prefer feature-level providers.
- Hooks should be pure and composable; side effects belong to feature modules or contexts.
- Document additional hooks in this file as they are introduced to prevent drift.

## Next Actions
1. Add unit tests covering context default values and provider interactions.
2. Document error boundaries around asynchronous contexts (e.g., Notification queue failures).
3. Create usage examples demonstrating composition with TanStack Query and Zustand stores.
4. Evaluate migrating repeated breakpoint logic to a responsive design hook under `frontend/src/shared/hooks`.
