# Team API

إدارة فرق العمل وتعيين المتطوعين لكل فريق.

## List Teams
`GET /api/v1/teams`

يعرض جميع الفرق مع المنطقة، المشرف، عدد المتطوعين وقائمتهم.

## Create Team
`POST /api/v1/teams`

حقول مطلوبة:
- `name` اسم الفريق (حد أقصى 100 حرف)
- `area_id` معرف المنطقة
- `supervisor_id` معرف المستخدم المشرف

مثال طلب:
```json
{
  "name": "Team 1",
  "area_id": 1,
  "supervisor_id": 5
}
```

## Show Team
`GET /api/v1/teams/{id}`

يعرض بيانات الفريق بالتفصيل مع المتطوعين المنتمين له.

## Update Team
`PUT /api/v1/teams/{id}`

يمكن تعديل الاسم أو المنطقة أو المشرف.

## Delete Team
`DELETE /api/v1/teams/{id}`

يحذف الفريق ويزيل العلاقة من المتطوعين المرتبطين به.

## Assign Volunteers
`POST /api/v1/teams/{id}/volunteers`

لتعيين متطوعين إلى الفريق.

مثال طلب:
```json
{
  "volunteer_ids": [1, 2, 3]
}
```

## Remove Volunteer
`DELETE /api/v1/teams/{team}/volunteers/{volunteer}`

يزيل متطوع محدد من الفريق.

