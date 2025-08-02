<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSwotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'entity_type' => 'sometimes|required|string|in:area,team,volunteer',
            'entity_id' => 'sometimes|required|integer',
            'strengths' => 'sometimes|required|string|min:3',
            'weaknesses' => 'sometimes|required|string|min:3',
            'opportunities' => 'sometimes|required|string|min:3',
            'threats' => 'sometimes|required|string|min:3',
        ];
    }
}
