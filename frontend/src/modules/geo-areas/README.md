# Geo Areas Module

Basic management for geographic areas.

## Files
- `List.tsx` – searchable table of areas.
- `Form.tsx` – dialog form for create/update.
- `Details.tsx` – view and edit single area.
- `api.ts` – CRUD helpers using `/ec/geo-areas` endpoints.
- `types.ts` – TypeScript types.

## API
- `GET /ec/geo-areas`
- `POST /ec/geo-areas`
- `GET /ec/geo-areas/:id`
- `PUT /ec/geo-areas/:id`
- `DELETE /ec/geo-areas/:id`

## Notes
Parent-area selection limited to provided `parentAreas` prop.
