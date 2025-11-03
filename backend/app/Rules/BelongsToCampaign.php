<?php

namespace App\Rules;

use App\Models\Campaign;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\DB;

class BelongsToCampaign implements Rule, DataAwareRule
{
    protected array $data = [];

    public function __construct(protected string $table, protected string $column = 'id')
    {
    }

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    public function passes($attribute, $value): bool
    {
        /** @var Campaign|null $campaign */
        $campaign = $this->data['campaign'] ?? null;
        if (! $campaign instanceof Campaign) {
            return false;
        }

        if (empty($value)) {
            return true;
        }

        $record = DB::table($this->table)
            ->where($this->column, $value)
            ->first();

        return $record && (int) ($record->campaign_id ?? 0) === $campaign->getKey();
    }

    public function message(): string
    {
        return __('validation.custom.belongs_to_campaign');
    }
}
