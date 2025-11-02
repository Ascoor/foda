<?php

return [
    'required' => 'الحقل :attribute مطلوب.',
    'email' => 'يجب أن يكون :attribute بريدًا إلكترونيًا صحيحًا.',
    'string' => 'يجب أن يكون :attribute نصًا.',
    'unique' => 'قيمة :attribute مستخدمة بالفعل.',
    'min' => [
        'string' => 'يجب ألا يقل :attribute عن :min أحرف.',
    ],
    'exists' => 'القيمة المحددة لـ :attribute غير موجودة.',
    'custom' => [
        'belongs_to_campaign' => 'يجب أن ينتمي :attribute إلى نفس الحملة.',
    ],
];
