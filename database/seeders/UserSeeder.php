<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = bcrypt('Password123@');

        User::factory()->create([
            'nik' => '1000000000000001',
            'name' => 'Admin Sehatin',
            'email' => 'admin@gmail.com',
            'password' => $password,
            'role' => 'admin',
        ]);
    }
}
