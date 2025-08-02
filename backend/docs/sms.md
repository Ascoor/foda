# SMS API

## List Messages
`GET /api/v1/sms?status=`

Returns paginated SMS for the authenticated user. Optional `status` query filters by delivery status.

## Send Message
`POST /api/v1/sms`

Body:
```json
{
  "message": "text",
  "recipient": "1555123456",
  "scheduled_for": "2024-01-01T10:00:00Z" // optional
}
```

Creates an SMS and sends immediately unless `scheduled_for` is provided.

## View Message
`GET /api/v1/sms/{id}`

Shows details for a single SMS owned by the user.

## Update Message
`PUT /api/v1/sms/{id}`

Allows updating `message`, `recipient` or `scheduled_for`. Include `resend=true` to resend pending messages.

## Delete Message
`DELETE /api/v1/sms/{id}`

Removes an SMS record.
