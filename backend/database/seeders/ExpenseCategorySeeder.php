<?php

namespace Database\Seeders;
use App\Models\ExpenseCategory; 

use Illuminate\Database\Seeder; 
class ExpenseCategorySeeder extends Seeder
{
    public function run()
    {
        ExpenseCategory::factory()->count(5)->create();
        // أو يدويًا إذا لم يكن لديك factory
        // ExpenseCategory::create(['name' => 'عام']);
    }
}
