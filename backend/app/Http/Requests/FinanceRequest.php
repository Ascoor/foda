<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FinanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric'],
            'type' => ['required', 'string'],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string'],
            'reference_id' => ['nullable', 'integer'],
            'category_id' => ['required', 'exists:expense_categories,id'],
        ];
    }
}
