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
                'name'        => 'Poli Kandungan & Kebidanan (Obgyn)',
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
                'name'        => 'Poli Jantung & Pembuluh Darah',
                'icon'        => 'HeartPulse',
                'description' => 'Layanan spesialisasi jantung untuk pencegahan, diagnosis, dan terapi penyakit kardiovaskular secara terpadu.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli Penyakit Dalam (Internis)',
                'icon'        => 'Stethoscope',
                'description' => 'Diagnosis dan penanganan penyakit pada organ dalam tubuh dewasa dan lansia tanpa pembedahan.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli Mata',
                'icon'        => 'Eye',
                'description' => 'Pemeriksaan kesehatan mata, pengukuran kacamata, serta tindakan medis dan operasi untuk penyakit mata.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli THT (Telinga, Hidung, Tenggorokan)',
                'icon'        => 'Ear',
                'description' => 'Pemeriksaan dan pengobatan gangguan pendengaran, penciuman, dan pernapasan atas.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli Kulit & Kelamin',
                'icon'        => 'Sparkles',
                'description' => 'Pemeriksaan medis untuk masalah dermatologi, estetika, dan penyakit menular seksual.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli Bedah Umum',
                'icon'        => 'Scissors',
                'description' => 'Konsultasi pra-operasi dan pasca-operasi serta tindakan bedah minor hingga mayor.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli Tulang & Sendi (Ortopedi)',
                'icon'        => 'Bone',
                'description' => 'Penanganan cedera tulang, sendi, otot, serta rehabilitasi masalah sistem muskuloskeletal.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli Psikiatri & Kesehatan Jiwa',
                'icon'        => 'BrainCircuit',
                'description' => 'Konsultasi kesehatan mental, penanganan depresi, kecemasan, dan gangguan perilaku.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Poli Paru & Pernapasan',
                'icon'        => 'Wind',
                'description' => 'Fokus pada kesehatan sistem pernapasan termasuk pengobatan asma, TBC, dan infeksi paru lainnya.',
                'is_active'   => true,
            ]
        ];

        foreach ($polis as $poli) {
            Poli::firstOrCreate(['name' => $poli['name']], $poli);
        }
    }
}
