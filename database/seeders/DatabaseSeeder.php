<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $password = bcrypt('Password123@');

        // Admin
        User::factory()->create([
            'nik' => '1000000000000001',
            'name' => 'Admin Sehatin',
            'email' => 'admin@gmail.com',
            'password' => $password,
            'role' => 'admin',
        ]);

        // Seed Polis first
        $polis = \App\Models\Poli::factory(3)->create();

        // Doctors
        $doctorsData = [
            ['name' => 'Bryan', 'email' => 'bryan@gmail.com', 'spec' => 'Spesialis Penyakit Dalam'],
            ['name' => 'Diva', 'email' => 'diva@gmail.com', 'spec' => 'Spesialis Gigi'],
            ['name' => 'Yudi', 'email' => 'yudi@gmail.com', 'spec' => 'Spesialis Penyakit Anak'],
        ];

        foreach ($doctorsData as $index => $data) {
            $user = User::factory()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $password,
                'role' => 'doctor',
            ]);

            \App\Models\Doctor::factory()->create([
                'user_id' => $user->id,
                'poli_id' => $polis[$index % 3]->id,
                'specialization' => $data['spec'],
            ]);
        }

        // Patients
        $patientsData = [
            ['name' => 'Vio', 'email' => 'vio@gmail.com'],
            ['name' => 'Qalam', 'email' => 'qalam@gmail.com'],
            ['name' => 'Clara', 'email' => 'clara@gmail.com'],
            ['name' => 'Fahry', 'email' => 'fahry@gmail.com'],
        ];

        foreach ($patientsData as $data) {
            $user = User::factory()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $password,
                'role' => 'patient',
            ]);

            \App\Models\Patient::factory()->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
