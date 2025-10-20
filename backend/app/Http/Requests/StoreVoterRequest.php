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
            'campaign_id' => ['required', 'integer', 'exists:campaigns,id'],
            'geo_area_id' => ['sometimes', 'nullable', 'integer', 'exists:geo_areas,id'],
            'committee_id' => ['sometimes', 'nullable', 'integer', 'exists:committees,id'],
            'full_name' => ['required', 'string', 'max:255'],
            'national_id' => ['sometimes', 'nullable', 'string', 'max:50'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'support_status' => ['sometimes', 'nullable', 'string', 'max:20'],
            'last_contact_at' => ['sometimes', 'nullable', 'date'],
            'notes' => ['sometimes', 'nullable', 'string'],
            'source' => ['sometimes', 'nullable', 'string', 'max:120'],
        ];
    }
}
