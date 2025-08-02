<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'area_id' => ['sometimes', 'required', 'exists:areas,id'],
            'supervisor_id' => ['sometimes', 'required', 'exists:users,id'],
        ];
    }
}

