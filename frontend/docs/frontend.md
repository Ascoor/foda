# Frontend Overview

This document outlines the structure and patterns used in the React frontend.

## Pages and Routes
- **Dashboard**: `/dashboard`
- **Campaigns**: `/campaigns`
- **Teams**: `/teams`
- **Team Members**: `/teams/members` – lists organization members with add form.

## API Integration
Utility helpers live in `src/lib`.
- `api.ts` wraps `fetch` and injects auth tokens.
- `members.ts` demonstrates CRUD helpers using `apiFetch`.

Data fetching uses **@tanstack/react-query**. Components call hooks like:
```tsx
const { data, isLoading } = useQuery({ queryKey: ['members'], queryFn: fetchMembers });
```
Mutations trigger revalidation via `queryClient.invalidateQueries`.

## Adding New Modules
1. Create API helpers in `src/lib`.
2. Build page components under `src/pages` and optional UI in `src/components`.
3. Register routes in `src/App.tsx` and navigation links in `components/sidebar/sidebarConfig.ts`.
4. Use `useLanguage` for bilingual labels and RTL handling.
5. Keep styling consistent with Tailwind and existing glassmorphism theme.

## Theming & i18n
- `contexts/ThemeContext.tsx` handles dark/light modes.
- `contexts/LanguageContext.tsx` provides `t` and `direction` for Arabic/English support.
- Components should read `direction` to handle RTL layouts.

## Testing & Linting
Run `npm run lint` in the `frontend` folder to check code style. Add tests under `src` when introducing new features.

