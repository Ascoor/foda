<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage settings');
    }

    public function rules(): array
    {
        return [
            'key' => ['required', 'string', 'max:100', 'unique:settings,key'],
            'value' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'in:string,integer,boolean'],
        ];
    }
}
