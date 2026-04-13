<?php

namespace Database\Factories;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Poli;
use App\Models\DoctorSchedule;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'queue_number' => 'SH-' . fake()->unique()->numerify('###'),
            'patient_id' => Patient::factory(),
            'doctor_id' => Doctor::factory(),
            'poli_id' => Poli::factory(),
            'schedule_id' => null,
            'appointment_date' => fake()->dateTimeBetween('-1 month', '+1 month')->format('Y-m-d'),
            'start_time' => '09:00:00',
            'end_time' => '09:15:00',
            'status' => 'booked',
        ];
    }
}
