<?php

namespace Database\Factories;

use App\Models\Poli;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Doctor>
 */
class DoctorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state(['role' => 'doctor']),
            'poli_id' => Poli::inRandomOrder()->first() ?? Poli::factory(),
            'specialization' => fake()->randomElement([
                'Spesialis Penyakit Dalam', 'Spesialis Gigi', 'Spesialis Penyakit Anak', 'Spesialis Penyakit Jantung', 'Spesialis Penyakit Kulit', 'Spesialis Penyakit Saraf',
            ]),
            'str_number' => fake()->unique()->numerify('STR-##########'),
            'avatar_url' => null,
        ];
    }
}
