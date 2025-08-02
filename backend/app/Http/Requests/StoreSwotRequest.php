<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSwotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'entity_type' => 'required|string|in:area,team,volunteer',
            'entity_id' => 'required|integer',
            'strengths' => 'required|string|min:3',
            'weaknesses' => 'required|string|min:3',
            'opportunities' => 'required|string|min:3',
            'threats' => 'required|string|min:3',
        ];
    }
}
