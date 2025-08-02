<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVoterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'area_id' => ['required', 'exists:areas,id'],
            'address' => ['nullable', 'string', 'max:255'],
            'sex' => ['nullable', 'in:male,female'],
            'birthdate' => ['nullable', 'date'],
            'age' => ['nullable', 'integer', 'min:0'],
            'bloodgroup' => ['nullable', 'string', 'max:3'],
            'img_url' => ['nullable', 'url'],
            'ion_user_id' => ['nullable', 'integer'],
            'voter_id' => ['required', 'string', 'max:100', 'unique:voters,voter_id'],
            'add_date' => ['nullable', 'date'],
        ];
    }
}
