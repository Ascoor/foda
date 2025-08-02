<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVolunteerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['nullable', 'email', 'max:150', 'unique:volunteers,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'team_id' => ['nullable', 'exists:teams,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'الاسم مطلوب | Name is required',
            'name.max' => 'يجب ألا يتجاوز الاسم 100 حرف | Name may not be greater than 100 characters',
            'email.email' => 'يجب تقديم بريد إلكتروني صالح | A valid email is required',
            'email.unique' => 'البريد الإلكتروني مستخدم سابقاً | Email already taken',
            'phone.max' => 'يجب ألا يتجاوز الهاتف 20 خانة | Phone may not be greater than 20 characters',
            'team_id.exists' => 'الفريق المحدد غير موجود | Selected team does not exist',
        ];
    }
}

