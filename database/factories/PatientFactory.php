<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'date_of_birth' => fake()->date(),
            'gender' => fake()->randomElement(['pria', 'wanita']),
            'address' => fake()->address(),
            'blood_type' => fake()->randomElement(['A', 'B', 'AB', 'O']),
        ];
    }
}
