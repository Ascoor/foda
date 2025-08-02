<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'مدير النظام',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        $users = [
            ['name' => 'أحمد علي', 'email' => 'ahmed@example.com'],
            ['name' => 'سارة محمد', 'email' => 'sara@example.com'],
            ['name' => 'خالد يوسف', 'email' => 'khaled@example.com'],
        ];

        foreach ($users as $user) {
            User::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make('password'),
            ]);
        }
    }
}
