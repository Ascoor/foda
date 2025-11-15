<?php

namespace App\Http\Requests;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\DonationCategory;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $campaign = $this->route('campaign');

        if ($campaign instanceof Campaign) {
            $this->merge(['campaign_id' => $campaign->getKey()]);
        } elseif (is_numeric($campaign)) {
            $this->merge(['campaign_id' => (int) $campaign]);
        }
    }

    public function rules(): array
    {
        /** @var Donation|null $donation */
        $donation = $this->route('donation');

        return [
            'campaign_id' => ['sometimes', 'exists:campaigns,id'],
            'category_id' => ['sometimes', 'nullable', 'exists:donation_categories,id'],
            'donor_name' => ['sometimes', 'required', 'string', 'max:150'],
            'donor_contact' => ['sometimes', 'nullable', 'string', 'max:150'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'donated_at' => ['sometimes', 'required', 'date'],
            'reference' => ['sometimes', 'nullable', 'string', 'max:100'],
            'notes' => ['sometimes', 'nullable', 'string'],
            'meta' => ['sometimes', 'nullable', 'array'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            /** @var Donation|null $donation */
            $donation = $this->route('donation');
            $campaignId = $donation?->campaign_id ?? (int) $this->input('campaign_id');
            $categoryId = $this->input('category_id');

            if ($categoryId) {
                $category = DonationCategory::query()->find($categoryId);
                if (! $category || ($campaignId && (int) $category->campaign_id !== $campaignId)) {
                    $validator->errors()->add('category_id', __('validation.custom.belongs_to_campaign'));
                }
            }
        });
    }
}
