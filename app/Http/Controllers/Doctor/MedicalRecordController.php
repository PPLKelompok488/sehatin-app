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
        $appointment->load(['patient.user', 'doctor.user', 'poli', 'medicalRecord']);

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
                'avatar' => null, // Placeholder as model doesn't have avatar
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

    public function create(Appointment $appointment)
    {
        $appointment->load(['patient.user', 'doctor.user', 'poli']);

        // Check if medical record already exists
        if ($appointment->medicalRecord) {
            return redirect()->route('doctor.medical-record.show', $appointment->id);
        }

        $patient = $appointment->patient;
        $doctor = $appointment->doctor;

        $birthDate = $patient->date_of_birth ? Carbon::parse($patient->date_of_birth) : null;
        $age = $birthDate ? $birthDate->age : null;

        $data = [
            'appointment' => [
                'id' => $appointment->id,
                'queue_number' => $appointment->queue_number,
                'appointment_date' => Carbon::parse($appointment->appointment_date)->translatedFormat('d M Y'),
                'start_time' => Carbon::parse($appointment->start_time)->format('H:i'),
            ],
            'patient' => [
                'id' => $patient->id,
                'name' => $patient->user->name,
                'gender' => $patient->gender === 'L' ? 'Laki-laki' : 'Perempuan',
                'age' => $age,
            ],
            'doctor' => [
                'name' => $doctor->user->name,
                'specialization' => $doctor->specialization,
            ],
        ];

        return Inertia::render('doctor/medical-history/create', $data);
    }

    public function store(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'subjective' => 'required|string',
            'objective' => 'required|string',
            'assessment' => 'required|string',
            'plan' => 'required|string',
            'blood_pressure' => 'nullable|string',
            'heart_rate' => 'nullable|string',
            'temperature' => 'nullable|string',
            'weight' => 'nullable|string',
            'blood_sugar' => 'nullable|string',
            'medicine' => 'required|string',
        ]);

        $medicalRecord = new MedicalRecord($validated);
        $medicalRecord->appointment_id = $appointment->id;
        $medicalRecord->doctor_id = $appointment->doctor_id;
        $medicalRecord->patient_id = $appointment->patient_id;
        $medicalRecord->save();

        // Update appointment status
        $appointment->status = 'completed';
        $appointment->save();

        return redirect()->route('doctor.medical-record.show', $appointment->id)
            ->with('success', 'Berhasil menyimpan rekam medis pasien');
    }

    public function history(\App\Models\Patient $patient)
    {
        $appointments = Appointment::with(['doctor.user', 'medicalRecord'])
            ->where('patient_id', $patient->id)
            ->whereIn('status', ['booked', 'completed'])
            ->orderBy('appointment_date', 'DESC')
            ->orderBy('start_time', 'DESC')
            ->get()
            ->map(function ($apt) {
                return [
                    'id' => $apt->id,
                    'appointment_date' => Carbon::parse($apt->appointment_date)->translatedFormat('d M Y'),
                    'start_time' => Carbon::parse($apt->start_time)->format('H:i'),
                    'queue_number' => $apt->queue_number,
                    'status' => $apt->status,
                    'doctor' => [
                        'name' => $apt->doctor->user->name,
                        'specialization' => $apt->doctor->specialization,
                        'avatar' => $apt->doctor->avatar_url,
                    ],
                    'has_record' => $apt->medicalRecord !== null,
                ];
            });

        $data = [
            'patient' => [
                'id' => $patient->id,
                'name' => $patient->user->name,
            ],
            'appointments' => $appointments,
        ];

        return Inertia::render('doctor/medical-history/history', $data);
    }
}
