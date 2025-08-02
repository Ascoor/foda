# Settings API

## Endpoints

### List settings
- `GET /api/v1/settings`

### Get setting by key
- `GET /api/v1/settings/key/{key}`

### Create setting
- `POST /api/v1/settings`
- Body example:
```json
{
  "key": "APP_NAME",
  "value": "Foda",
  "type": "string",
  "description": "Application name"
}
```

### Show setting
- `GET /api/v1/settings/{id}`

### Update setting
- `PUT /api/v1/settings/{id}`

### Delete setting
- `DELETE /api/v1/settings/{id}`

## Notes
- Only users with `manage settings` permission may create, update or delete settings.
- `type` supports `string`, `integer`, or `boolean`.
