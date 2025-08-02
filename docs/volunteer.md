# Volunteer Module

The Volunteer module manages individuals participating in campaigns.

## Backend
- Model, migration and CRUD API under `/api/v1/volunteers`.
- Validation via `StoreVolunteerRequest` and `UpdateVolunteerRequest`.
- Resource `VolunteerResource` returns basic fields and related team.
- Seeder `VolunteerSeeder` seeds sample records.
- Feature tests cover listing, creating, updating and deleting volunteers.

## Frontend
- React page `/volunteers` for listing volunteers and performing create, edit and delete actions.
- Uses `frontend/src/lib/volunteers.ts` for API requests.
- Text is fully translatable through `LanguageContext`.

## Seeder
Run the volunteer seeder with:

```bash
cd backend
php artisan db:seed --class=VolunteerSeeder
```

## Tests
Run backend tests with:

```bash
cd backend
phpunit
```
