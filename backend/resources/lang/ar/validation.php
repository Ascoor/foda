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
        'committee_code' => [
            'unique_within_campaign' => 'يجب أن يكون رمز اللجنة فريدًا داخل الحملة.',
        ],
        'committee_area' => [
            'out_of_scope' => 'يجب أن تقع اللجنة ضمن النطاق الجغرافي المحدد للحملة.',
        ],
    ],
];
