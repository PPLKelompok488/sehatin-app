<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

foreach(\App\Models\Patient::all() as $patient) {
    $doctor = \App\Models\Doctor::first();
    $appointment = \App\Models\Appointment::first();
    for($i=1; $i<=3; $i++) {
        \App\Models\MedicalRecord::create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'appointment_id' => $appointment->id,
            'subjective' => 'Keluhan tes ke-'.$i,
            'assessment' => 'Diagnosa tes ke-'.$i,
            'plan' => 'Tindakan tes ke-'.$i,
            'created_at' => now()->subDays($i * 2)
        ]);
    }
}
echo 'Seeded!';
