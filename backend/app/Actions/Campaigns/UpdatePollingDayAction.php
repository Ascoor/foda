<?php

namespace App\Actions\Campaigns;

use App\Models\CampaignPollingDay;
use Illuminate\Support\Facades\DB;

class UpdatePollingDayAction
{
    public function __invoke(CampaignPollingDay $pollingDay, array $attributes): CampaignPollingDay
    {
        return DB::transaction(function () use ($pollingDay, $attributes) {
            $pollingDay->fill($attributes);
            $pollingDay->save();

            return $pollingDay->fresh();
        });
    }
}
