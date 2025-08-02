# Profile API

## Endpoints

### List profiles
- `GET /api/v1/profiles`

### Create profile
- `POST /api/v1/profiles`
- Body example:
```json
{
  "user_id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "avatar": "avatar.jpg",
  "email": "john@example.com",
  "password": "secret",
  "password_confirmation": "secret"
}
```

### Show profile
- `GET /api/v1/profiles/{id}`

### Update profile
- `PUT /api/v1/profiles/{id}`

### Delete profile
- `DELETE /api/v1/profiles/{id}`

## Notes
- `email` and `password` fields will update the related user account if provided.
- `avatar` stores a string path or URL to the user's avatar image.
