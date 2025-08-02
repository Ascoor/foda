<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAreaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['sometimes', 'required', 'string', 'max:1000'],
            'x' => ['sometimes', 'nullable', 'string', 'max:10'],
            'y' => ['sometimes', 'nullable', 'string', 'max:10'],
        ];
    }
}
