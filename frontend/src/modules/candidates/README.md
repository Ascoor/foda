# وحدة المرشحين

توفّر هذه الوحدة إدارة كاملة لسجلات المرشحين من خلال قائمة، نموذج، وتفاصيل.

## الحقول المطلوبة
- `name` اسم المرشح (نص، مطلوب)
- `party` الحزب (نص، مطلوب)
- `type` النوع (`individual` أو `list`، مطلوب)
- `status` الحالة (`active` أو `withdrawn`، مطلوب)

## نقاط الربط مع الـAPI
- `GET /ec/candidates` جلب المرشحين مع البحث والترقيم.
- `POST /ec/candidates` إنشاء مرشح جديد.
- `GET /ec/candidates/{id}` عرض تفاصيل مرشح.
- `PUT /ec/candidates/{id}` تحديث بيانات مرشح.
- `DELETE /ec/candidates/{id}` حذف مرشح.

## مثال للاستخدام
```tsx
import { CandidatesList } from './List';

<CandidatesList />
```
