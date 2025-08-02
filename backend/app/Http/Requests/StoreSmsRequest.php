<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSmsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'message' => ['required', 'string'],
            'recipient' => ['required', 'string'],
            'scheduled_for' => ['nullable', 'date'],
        ];
    }
}
