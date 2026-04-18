<?php

namespace Database\Seeders;

use App\Models\Poli;
use Illuminate\Database\Seeder;

class PoliSeeder extends Seeder
{
    public function run(): void
    {
        $polis = [
            [
                'name'        => 'Poli Umum',
                'icon'        => 'Stethoscope',
                'description' => 'Layanan kesehatan dasar untuk pemeriksaan awal, konsultasi umum, dan penanganan keluhan ringan hingga sedang.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli Gigi & Mulut',
                'icon'        => 'Activity',
                'description' => 'Perawatan gigi komprehensif meliputi pemeriksaan rutin, penambalan, pencabutan, dan perawatan ortodonsi.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli Anak (Pediatrik)',
                'icon'        => 'Baby',
                'description' => 'Perawatan medis komprehensif untuk bayi, anak-anak, dan remaja, termasuk vaksinasi dan pemantauan tumbuh kembang.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli Kandungan & Kebidanan',
                'icon'        => 'Heart',
                'description' => 'Layanan kesehatan wanita meliputi pemeriksaan kehamilan, persalinan, dan gangguan kandungan.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli Saraf & Neurologi',
                'icon'        => 'Brain',
                'description' => 'Layanan diagnosis dan pengobatan gangguan saraf termasuk stroke, epilepsi, dan manajemen nyeri saraf kronis.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli Jantung & Pembuluh',
                'icon'        => 'HeartPulse',
                'description' => 'Layanan spesialisasi jantung untuk pencegahan, diagnosis, dan terapi penyakit kardiovaskular secara terpadu.',
                'is_active'   => false,
            ],
        ];

        foreach ($polis as $poli) {
            Poli::firstOrCreate(['name' => $poli['name']], $poli);
        }
    }
}
