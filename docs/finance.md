# Finance Module

## Adding a New Finance Subpage
1. Create your React page under `frontend/src/pages/Finance` or as appropriate.
2. Add sidebar entry in `frontend/src/components/sidebar/sidebarConfig.ts` inside the Finance section. Provide `path`, `icon`, and optional `glow`.
3. Register React Router route pointing to your page.
4. Expose any API endpoints in `backend/routes/api.php` and create corresponding controllers/resources.
5. Use React Query for data fetching and include i18n keys in `LanguageContext`.

## Testing
- Run `npm run lint` inside `frontend`.
- Run `php artisan test` inside `backend`.
