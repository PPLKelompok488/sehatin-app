<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\MedicalRecord;
use App\Models\Patient;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $allPatients = Patient::all();
        $doctors = Doctor::all();

        foreach ($allPatients as $patient) {
            // Last month appointments (mostly completed)
            Appointment::factory(rand(1, 3))->create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctors->random()->id,
                'poli_id' => function (array $attributes) {
                    return Doctor::find($attributes['doctor_id'])->poli_id;
                },
                'appointment_date' => fake()->dateTimeBetween('-2 months', '-1 month')->format('Y-m-d'),
                'status' => 'completed',
                'created_at' => fake()->dateTimeBetween('-2 months', '-1 month'),
            ]);

            // This month appointments (mix of completed and booked)
            $thisMonthAppointments = Appointment::factory(rand(2, 4))->create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctors->random()->id,
                'poli_id' => function (array $attributes) {
                    return Doctor::find($attributes['doctor_id'])->poli_id;
                },
                'appointment_date' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
                'status' => fake()->randomElement(['completed', 'booked', 'cancelled']),
                'created_at' => fake()->dateTimeBetween('-1 month', 'now'),
            ]);

            foreach ($thisMonthAppointments as $appointment) {
                if ($appointment->status === 'completed') {
                    MedicalRecord::factory()->create([
                        'appointment_id' => $appointment->id,
                        'doctor_id' => $appointment->doctor_id,
                        'patient_id' => $appointment->patient_id,
                    ]);
                }
            }
        }
    }
}
