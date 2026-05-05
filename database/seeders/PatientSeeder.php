<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = bcrypt('Password123@');

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
                'created_at' => fake()->dateTimeBetween('-2 months', 'now'),
            ]);

            Patient::factory()->create([
                'user_id' => $user->id,
                'created_at' => $user->created_at,
            ]);
        }

        // Create random additional patients
        Patient::factory(5)->create([
            'created_at' => function () {
                return fake()->dateTimeBetween('-2 months', 'now');
            }
        ]);
    }
}
