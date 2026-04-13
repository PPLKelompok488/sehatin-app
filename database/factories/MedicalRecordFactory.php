<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicalRecordFactory extends Factory
{
    public function definition(): array
    {
        return [
            'appointment_id' => Appointment::factory(),
            'doctor_id' => Doctor::factory(),
            'patient_id' => Patient::factory(),
            'subjective' => fake()->paragraph(),
            'objective' => fake()->paragraph(),
            'assessment' => fake()->sentence(),
            'plan' => fake()->sentence(),
            'blood_pressure' => fake()->numberBetween(100, 140) . '/' . fake()->numberBetween(60, 90),
            'heart_rate' => fake()->numberBetween(60, 100),
            'temperature' => fake()->randomFloat(1, 36, 38),
            'weight' => fake()->randomFloat(1, 45, 90),
            'blood_sugar' => fake()->randomFloat(1, 80, 120),
            'medicine' => fake()->sentence(),
        ];
    }
}
