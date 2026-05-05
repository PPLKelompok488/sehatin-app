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
            'medical_record' => $appointment->medicalRecord,
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
            'poli' => [
                'name' => $appointment->poli->name,
            ]
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
        $medicalRecord->doctor_id = auth()->user()->doctor->id;
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
        $statusFilter = request('status', 'all');
        $search = request('search');
        $dateStart = request('date_start');
        $dateEnd = request('date_end');

        $query = Appointment::with(['doctor.user', 'medicalRecord', 'poli'])
            ->where('patient_id', $patient->id)
            ->whereIn('status', ['booked', 'completed']);

        if ($statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->whereHas('doctor.user', function($dq) use ($search) {
                    $dq->where('name', 'like', "%{$search}%");
                })->orWhereHas('poli', function($pq) use ($search) {
                    $pq->where('name', 'like', "%{$search}%");
                });
            });
        }

        if ($dateStart) {
            $query->whereDate('appointment_date', '>=', $dateStart);
        }

        if ($dateEnd) {
            $query->whereDate('appointment_date', '<=', $dateEnd);
        }

        $appointments = $query->orderBy('appointment_date', 'DESC')
            ->orderBy('start_time', 'DESC')
            ->paginate(5)
            ->withQueryString();

        // Calculate stats (always based on all history)
        $allAppointments = Appointment::where('patient_id', $patient->id)
            ->whereIn('status', ['booked', 'completed'])
            ->get();

        $stats = [
            'total_visits' => $allAppointments->count(),
            'upcoming_visit' => $allAppointments->where('status', 'booked')->first() ? [
                'date' => Carbon::parse($allAppointments->where('status', 'booked')->first()->appointment_date)->translatedFormat('d F Y'),
                'time' => Carbon::parse($allAppointments->where('status', 'booked')->first()->start_time)->format('H:i'),
                'doctor' => $allAppointments->where('status', 'booked')->first()->doctor->user->name,
                'avatar' => $allAppointments->where('status', 'booked')->first()->doctor->avatar_url,
            ] : null,
            'latest_vitals' => $allAppointments->whereNotNull('medicalRecord')->first() ? [
                'blood_pressure' => $allAppointments->whereNotNull('medicalRecord')->first()->medicalRecord->blood_pressure,
                'heart_rate' => $allAppointments->whereNotNull('medicalRecord')->first()->medicalRecord->heart_rate,
            ] : null,
        ];

        $mappedAppointments = collect($appointments->items())->map(function ($apt) {
            return [
                'id' => $apt->id,
                'date_short' => Carbon::parse($apt->appointment_date)->translatedFormat('d M'),
                'time' => Carbon::parse($apt->start_time)->format('H:i'),
                'queue_number' => $apt->queue_number,
                'status' => $apt->status,
                'poli_name' => $apt->poli->name,
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
                'gender' => $patient->gender === 'L' ? 'Laki-laki' : 'Perempuan',
                'age' => $patient->date_of_birth ? Carbon::parse($patient->date_of_birth)->age : null,
            ],
            'appointments' => [
                'data' => $mappedAppointments,
                'next_page_url' => $appointments->nextPageUrl(),
            ],
            'stats' => $stats,
            'filters' => [
                'status' => $statusFilter,
                'search' => $search,
                'date_start' => $dateStart,
                'date_end' => $dateEnd,
            ]
        ];

        return Inertia::render('doctor/medical-history/history', $data);
    }
}
