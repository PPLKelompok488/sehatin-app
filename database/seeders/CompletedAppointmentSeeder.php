<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\MedicalRecord;
use App\Models\Patient;
use Illuminate\Database\Seeder;

class CompletedAppointmentSeeder extends Seeder
{
    /**
     * Seed completed appointments with medical records for all existing patients.
     */
    public function run(): void
    {
        $patients = Patient::all();
        $doctors = Doctor::with('poli')->get();

        if ($doctors->isEmpty()) {
            $this->command->warn('No doctors found. Skipping.');
            return;
        }

        foreach ($patients as $patient) {
            // Create 3 completed appointments with full medical records
            for ($i = 0; $i < 3; $i++) {
                $doctor = $doctors->random();
                $date = fake()->dateTimeBetween('-2 months', '-1 day')->format('Y-m-d');

                $appointment = Appointment::create([
                    'queue_number' => 'SH-' . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT),
                    'patient_id' => $patient->id,
                    'doctor_id' => $doctor->id,
                    'poli_id' => $doctor->poli_id,
                    'schedule_id' => $doctor->schedules()->first()?->id ?? 1,
                    'appointment_date' => $date,
                    'start_time' => fake()->randomElement(['08:00', '09:00', '10:00', '11:00', '13:00', '14:00']),
                    'end_time' => fake()->randomElement(['08:30', '09:30', '10:30', '11:30', '13:30', '14:30']),
                    'status' => 'completed',
                ]);

                MedicalRecord::create([
                    'appointment_id' => $appointment->id,
                    'doctor_id' => $doctor->id,
                    'patient_id' => $patient->id,
                    'subjective' => fake()->randomElement([
                        'Pasien mengeluh sakit kepala berdenyut di bagian belakang sejak 3 hari lalu, disertai mual dan pandangan sedikit kabur.',
                        'Pasien datang dengan keluhan batuk berdahak selama 1 minggu, disertai pilek dan demam ringan di malam hari.',
                        'Pasien mengeluh nyeri perut bagian kiri bawah sejak 2 hari lalu, mual tanpa muntah, nafsu makan menurun.',
                    ]),
                    'objective' => fake()->randomElement([
                        'Tekanan darah 130/85 mmHg. Suhu 36.8°C. Konjungtiva tidak anemis. Pemeriksaan neurologis dalam batas normal.',
                        'Suhu 37.5°C. Faring hiperemis, tonsil T1-T1. Ronkhi basah halus pada paru kanan bawah. CRT < 2 detik.',
                        'Abdomen supel, nyeri tekan regio kiri bawah. Bising usus meningkat. Tidak teraba massa. Murphy sign negatif.',
                    ]),
                    'assessment' => fake()->randomElement([
                        'Tension-type Headache (G44.2) — Cephalgia tipe tegang episodik',
                        'ISPA (J06.9) — Infeksi Saluran Pernapasan Atas Akut',
                        'Dispepsia fungsional (K30) — Gangguan pencernaan fungsional',
                    ]),
                    'plan' => fake()->randomElement([
                        'Istirahat cukup, kurangi screen time. Kontrol ulang 1 minggu jika tidak membaik. Edukasi manajemen stres.',
                        'Tingkatkan asupan cairan hangat. Istirahat cukup. Kontrol 5 hari lagi jika batuk masih berlanjut.',
                        'Diet lunak, hindari makanan pedas dan asam. Kontrol ulang 3 hari untuk evaluasi. Jika nyeri memberat segera ke IGD.',
                    ]),
                    'blood_pressure' => fake()->randomElement(['120/80', '130/85', '115/75', '125/82']),
                    'heart_rate' => fake()->numberBetween(65, 95),
                    'temperature' => fake()->randomFloat(1, 36.2, 37.8),
                    'weight' => fake()->randomFloat(1, 50, 85),
                    'blood_sugar' => fake()->randomFloat(1, 85, 115),
                    'medicine' => fake()->randomElement([
                        "1. Paracetamol 500mg — 3x1 setelah makan (5 hari)\n2. Ibuprofen 200mg — 2x1 setelah makan jika nyeri (3 hari)\n3. Vitamin B Complex — 1x1 pagi hari (7 hari)",
                        "1. Amoxicillin 500mg — 3x1 setelah makan (5 hari)\n2. Guaifenesin 100mg — 3x1 setelah makan (5 hari)\n3. Paracetamol 500mg — 3x1 jika demam",
                        "1. Omeprazole 20mg — 1x1 sebelum makan pagi (7 hari)\n2. Antasida sirup — 3x1 sebelum makan\n3. Domperidone 10mg — 3x1 sebelum makan (5 hari)",
                    ]),
                ]);
            }
        }

        $this->command->info('Completed appointments with medical records seeded successfully!');
    }
}
