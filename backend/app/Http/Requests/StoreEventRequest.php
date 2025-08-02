<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_id' => ['nullable', 'string', 'max:255', 'unique:events,event_id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'organiser' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'area_id' => ['required', 'exists:areas,id'],
            'team_id' => ['required', 'exists:teams,id'],
        ];
    }
}
