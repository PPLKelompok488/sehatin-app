<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
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

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
