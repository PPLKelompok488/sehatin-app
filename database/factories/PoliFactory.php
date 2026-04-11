<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Poli>
 */
class PoliFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $polis = [
            'Poli Umum',
            'Poli Gigi',
            'Poli Anak',
        ];

        return [
            'name' => fake()->unique()->randomElement($polis),
            'description' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
