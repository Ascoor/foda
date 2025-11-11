<?php

namespace App\Services;

use App\Models\{Campaign, Activity, Finance};
use Carbon\Carbon;

class KpiService
{
    public function dashboardStats(Campaign $campaign): array
    {
        $today = Carbon::today();
        $last7 = Carbon::now()->subDays(7);

        $activities7 = Activity::where('campaign_id', $campaign->id)
            ->where('reported_at', '>=', $last7);

        $income = Finance::where('campaign_id', $campaign->id)->where('trx_type','income');
        $expense = Finance::where('campaign_id', $campaign->id)->where('trx_type','expense');

        return [
            'activities_today' => Activity::where('campaign_id',$campaign->id)->whereDate('reported_at',$today)->count(),
            'activities_last_7_days' => (clone $activities7)->count(),
            'support_score_avg_7d' => round((float) (clone $activities7)->avg('support_score'), 2),
            'finance_month_income' => (float) (clone $income)->whereMonth('date', now()->month)->sum('amount'),
            'finance_month_expense' => (float) (clone $expense)->whereMonth('date', now()->month)->sum('amount'),
        ];
    }
}
