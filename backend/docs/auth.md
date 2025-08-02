# Auth API

## Login
POST `/api/v1/login`

Request:
```
{
  "email": "user@example.com",
  "password": "secret"
}
```

## Register
POST `/api/v1/register`

Requires `admin` role. Example:
```
{
  "name": "New User",
  "email": "new@example.com",
  "password": "password123",
  "role_id": 1
}
```

## Profile
GET `/api/v1/profile`

Returns authenticated user, roles and last login time.

### Update Profile
PUT `/api/v1/profile`

Example:
```
{
  "name": "Updated Name",
  "email": "user@example.com",
  "password": "newpassword",
  "password_confirmation": "newpassword"
}
```

Only provided fields will be updated. Password is hashed automatically.

## Logout
POST `/api/v1/logout`

Revokes current token.
