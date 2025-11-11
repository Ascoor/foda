<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Campaign, AutomationTask};

class AutomationTasksSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Campaign::all() as $c) {
            $tasks = [
                ['task'=>'daily_kpi','display_name'=>'توليد مؤشرات يومية'],
                ['task'=>'remind_agents','display_name'=>'تذكير الوكلاء بالزيارات'],
            ];
            foreach ($tasks as $t) {
                AutomationTask::firstOrCreate([
                    'campaign_id'=>$c->id,
                    'task'=>$t['task']
                ], [
                    'display_name'=>$t['display_name'],
                    'is_enabled'=>true,
                    'status'=>'idle'
                ]);
            }
        }
    }
}
