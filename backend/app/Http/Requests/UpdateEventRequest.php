<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_id' => ['sometimes', 'nullable', 'string', 'max:255', 'unique:events,event_id,' . $this->route('event')],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'organiser' => ['sometimes', 'required', 'string', 'max:255'],
            'location' => ['sometimes', 'required', 'string', 'max:255'],
            'date' => ['sometimes', 'required', 'date'],
            'area_id' => ['sometimes', 'required', 'exists:areas,id'],
            'team_id' => ['sometimes', 'required', 'exists:teams,id'],
        ];
    }
}
