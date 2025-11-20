<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

class EnsureDatabaseIsSeeded extends Command
{
    protected $signature = 'db:ensure-seeded';
    protected $description = 'Check if tables/data exist, otherwise run migrations and seeders';

    public function handle()
    {
        // مثال: بنشيك على جدول users (غيّر للي يناسبك)
        $table = 'users';

        // لو الجدول مش موجود -> اعمل migrate + seed
        if (!Schema::hasTable($table)) {
            $this->info("Table '{$table}' not found. Running migrations and seeders...");
            Artisan::call('migrate', ['--force' => true]);
            Artisan::call('db:seed', ['--force' => true]);
            $this->info('Migrations and seeders executed.');
            return Command::SUCCESS;
        }

        // لو الجدول موجود لكن فاضي -> اعمل seed بس
        $count = DB::table($table)->count();

        if ($count == 0) {
            $this->info("Table '{$table}' is empty. Running seeders...");
            Artisan::call('db:seed', ['--force' => true]);
            $this->info('Seeders executed.');
        } else {
            $this->info("Table '{$table}' already has data ({$count} rows). No action needed.");
        }

        return Command::SUCCESS;
    }
}
