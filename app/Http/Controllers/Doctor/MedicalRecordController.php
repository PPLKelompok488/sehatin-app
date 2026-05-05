<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MedicalRecordController extends Controller
{
    public function show(Appointment $appointment)
    {
        // Load relationships
        $appointment->load(['patient.user', 'doctor.user', 'poli', 'medicalRecord']);

        // Check if the authenticated doctor owns this appointment
        if ($appointment->doctor_id !== auth()->user()->doctor->id) {
            abort(403);
        }

        $patient = $appointment->patient;
        $doctor = $appointment->doctor;

        // Calculate age
        $birthDate = $patient->date_of_birth ? Carbon::parse($patient->date_of_birth) : null;
        $age = $birthDate ? $birthDate->age : null;

        $data = [
            'appointment' => [
                'id' => $appointment->id,
                'queue_number' => $appointment->queue_number,
                'appointment_date' => Carbon::parse($appointment->appointment_date)->translatedFormat('d M Y'),
                'start_time' => Carbon::parse($appointment->start_time)->format('H:i'),
                'status' => $appointment->status,
            ],
            'patient' => [
                'id' => $patient->id,
                'name' => $patient->user->name,
                'gender' => $patient->gender === 'L' ? 'Laki-laki' : 'Perempuan',
                'age' => $age,
                'avatar' => null, // Patient has no avatar field in model
            ],
            'doctor' => [
                'name' => $doctor->user->name,
                'specialization' => $doctor->specialization,
                'avatar' => $doctor->avatar_url,
            ],
            'medical_record' => $appointment->medicalRecord,
        ];

        return Inertia::render('doctor/medical-history/show', $data);
    }
}
