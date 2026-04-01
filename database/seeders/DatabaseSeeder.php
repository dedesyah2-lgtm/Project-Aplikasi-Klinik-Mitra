<?php

namespace Database\Seeders;

use App\Models\Pasien;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name' => env('USER_NAME', 'admin'),
            'email' => env('USER_EMAIL', 'admin@admin.com'),
            'password' => Hash::make(env('USER_PASSWORD', 'admin123')),
        ]);
        
        Pasien::factory()->count(100)->create();
    }
}
