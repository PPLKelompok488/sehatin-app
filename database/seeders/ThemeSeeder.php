<?php

namespace Database\Seeders;

use App\Models\Theme;
use Illuminate\Database\Seeder;

class ThemeSeeder extends Seeder
{
    public function run(): void
    {
        $themes = [
            [
                'key' => 'primary_color',
                'value' => '#5ba7f7',
            ],
            [
                'key' => 'secondary_color',
                'value' => '#475569',
            ],
            [
                'key' => 'brand_logo',
                'value' => '/images/sehatin.png',
            ],
        ];

        foreach ($themes as $theme) {
            Theme::updateOrCreate(['key' => $theme['key']], $theme);
        }
    }
}
