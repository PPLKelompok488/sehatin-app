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

        // Polis
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

            $doctor = \App\Models\Doctor::factory()->create([
                'user_id' => $user->id,
                'poli_id' => $polis[$index % 3]->id,
                'specialization' => $data['spec'],
            ]);

            // Seed Doctor Schedules
            \App\Models\DoctorSchedule::factory()->create([
                'doctor_id' => $doctor->id,
                'day_of_week' => 'Senin',
            ]);
            \App\Models\DoctorSchedule::factory()->create([
                'doctor_id' => $doctor->id,
                'day_of_week' => 'Selasa',
            ]);
        }

        // Patients
        $patientsData = [
            ['name' => 'Vio', 'email' => 'vio@gmail.com'],
            ['name' => 'Qalam', 'email' => 'qalam@gmail.com'],
            ['name' => 'Clara', 'email' => 'clara@gmail.com'],
            ['name' => 'Fahry', 'email' => 'fahry@gmail.com'],
        ];

        $patients = [];
        foreach ($patientsData as $data) {
            $user = User::factory()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $password,
                'role' => 'patient',
            ]);

            $patients[] = \App\Models\Patient::factory()->create([
                'user_id' => $user->id,
            ]);
        }

        // Create random additional patients
        $extraPatients = \App\Models\Patient::factory(5)->create();
        $allPatients = array_merge($patients, $extraPatients->all());

        // Get all doctors
        $doctors = \App\Models\Doctor::all();

        // Seed Appointments and Medical Records
        foreach ($allPatients as $patient) {
            // Past appointments (completed)
            $completedAppointments = \App\Models\Appointment::factory(2)->create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctors->random()->id,
                'poli_id' => function (array $attributes) {
                    return \App\Models\Doctor::find($attributes['doctor_id'])->poli_id;
                },
                'appointment_date' => fake()->dateTimeBetween('-1 month', '-1 day')->format('Y-m-d'),
                'status' => 'completed',
            ]);

            foreach ($completedAppointments as $appointment) {
                \App\Models\MedicalRecord::factory()->create([
                    'appointment_id' => $appointment->id,
                    'doctor_id' => $appointment->doctor_id,
                    'patient_id' => $appointment->patient_id,
                ]);
            }

            // Future appointments (booked)
            \App\Models\Appointment::factory(1)->create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctors->random()->id,
                'poli_id' => function (array $attributes) {
                    return \App\Models\Doctor::find($attributes['doctor_id'])->poli_id;
                },
                'appointment_date' => fake()->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
                'status' => 'booked',
            ]);

            // Cancelled appointments
            \App\Models\Appointment::factory(1)->create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctors->random()->id,
                'poli_id' => function (array $attributes) {
                    return \App\Models\Doctor::find($attributes['doctor_id'])->poli_id;
                },
                'appointment_date' => fake()->dateTimeBetween('-1 month', '+1 month')->format('Y-m-d'),
                'status' => 'cancelled',
                'cancel_reason' => 'Pasien ada keperluan mendadak',
                'cancelled_by' => 'patient',
            ]);
        }

    }
}
