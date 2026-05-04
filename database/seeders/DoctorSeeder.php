<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\DoctorSchedule;
use App\Models\Poli;
use App\Models\User;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $password = bcrypt('Password123@');
        $polis = Poli::all();

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

            $doctor = Doctor::factory()->create([
                'user_id' => $user->id,
                'poli_id' => $polis[$index % 3]->id,
                'specialization' => $data['spec'],
            ]);

            DoctorSchedule::factory()->create([
                'doctor_id' => $doctor->id,
                'day_of_week' => 'Senin',
            ]);
            DoctorSchedule::factory()->create([
                'doctor_id' => $doctor->id,
                'day_of_week' => 'Selasa',
            ]);
        }
    }
}
