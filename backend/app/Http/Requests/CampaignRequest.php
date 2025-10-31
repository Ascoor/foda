<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:500'],
            'election_id' => ['nullable', 'exists:elections,id'],
            'governorate_id' => ['required', 'integer'],
            'district_id' => ['required', 'integer'],
            'electoral_circle_id' => ['required', 'integer'],
        ];
    }
}
