<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\DoctorSchedule;
use App\Models\Patient;
use App\Models\Poli;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $patient = Auth::user()->patient;

        $appointments = collect();
        $closestAppointment = null;
        $totalKunjungan = 0;

        if ($patient) {
            $appointmentsRaw = \App\Models\Appointment::with(['doctor.user', 'poli'])
                ->where('patient_id', $patient->id)
                ->orderBy('appointment_date', 'asc')
                ->orderBy('start_time', 'asc')
                ->get();
            
            $totalKunjungan = $appointmentsRaw->count();
            
            $closestAppointmentRaw = $appointmentsRaw->where('status', 'booked')->first();
            
            if ($closestAppointmentRaw) {
                $dateObj = \Carbon\Carbon::parse($closestAppointmentRaw->appointment_date);
                $closestAppointment = [
                    'date' => $dateObj->translatedFormat('d F Y'),
                    'time' => \Carbon\Carbon::parse($closestAppointmentRaw->start_time)->format('H:i') . ' WIB',
                    'doctor_name' => $closestAppointmentRaw->doctor->user->name ?? 'Dokter',
                ];
            }

            $appointments = $appointmentsRaw->map(function ($app) {
                $dateObj = \Carbon\Carbon::parse($app->appointment_date);
                return [
                    'id' => $app->id,
                    'doctor_name' => $app->doctor->user->name ?? 'Dokter',
                    'poli_name' => $app->poli->name ?? 'Umum',
                    'raw_date' => $dateObj->format('Y-m-d'),
                    'date_time' => $dateObj->translatedFormat('d M') . ', ' . \Carbon\Carbon::parse($app->start_time)->format('H:i'),
                    'queue_number' => $app->queue_number,
                    'status' => $app->status,
                ];
            });
        }

        return Inertia::render('patient/kunjungan/pages/kunjungan', [
            'appointments' => $appointments,
            'closestAppointment' => $closestAppointment,
            'totalKunjungan' => $totalKunjungan,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $poliId = $request->query('poli_id');
        
        $doctors = [];
        $bookedSlots = [];
        if ($poliId) {
            $doctors = \App\Models\Doctor::with(['user', 'schedules' => function($query) {
                $query->where('is_active', true);
            }])
            ->where('poli_id', $poliId)
            ->get();

            $doctorIds = $doctors->pluck('id');
            $bookedSlots = \App\Models\Appointment::whereIn('doctor_id', $doctorIds)
                ->where('status', 'booked')
                ->where('appointment_date', '>=', now()->toDateString())
                ->where('appointment_date', '<=', now()->addDays(14)->toDateString())
                ->get(['doctor_id', 'appointment_date', 'start_time'])
                ->map(function($app) {
                    return [
                        'doctor_id' => $app->doctor_id,
                        'date' => $app->appointment_date instanceof \DateTime 
                                    ? $app->appointment_date->format('Y-m-d') 
                                    : $app->appointment_date,
                        'time' => substr($app->start_time, 0, 5)
                    ];
                });
        }

        return Inertia::render('patient/buat-kunjungan/pages/buat-kunjungan', [
            'polis' => Poli::where('is_active', true)->get(),
            'doctors' => $doctors,
            'bookedSlots' => $bookedSlots,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'poli_id' => 'required|exists:polis,id',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date',
            'start_time' => 'required|string',
        ]);

        $patient = Patient::where('user_id', Auth::id())->first();
        if (!$patient) {
            return redirect()->back()->with('error', 'Data pasien tidak ditemukan.');
        }

        $doctor = Doctor::findOrFail($validated['doctor_id']);
        $schedule = DoctorSchedule::where('doctor_id', $validated['doctor_id'])
            ->where('is_active', true)
            ->first();

        if (!$schedule) {
            return redirect()->back()->with('error', 'Jadwal dokter tidak tersedia.');
        }

        // Check for existing appointment at same time
        $existing = Appointment::where('doctor_id', $validated['doctor_id'])
            ->where('appointment_date', $validated['appointment_date'])
            ->where('start_time', $validated['start_time'])
            ->where('status', 'booked')
            ->exists();

        if ($existing) {
            return redirect()->back()->with('error', 'Slot waktu ini sudah dipesan. Silakan pilih waktu lain.');
        }

        // Generate queue number with SH-### format
        $lastQueue = Appointment::where('appointment_date', $validated['appointment_date'])
            ->where('status', 'booked')
            ->count();
        $queueNumber = 'SH-' . str_pad($lastQueue + 1, 3, '0', STR_PAD_LEFT);

        // Calculate end time based on slot_duration
        $startTime = $validated['start_time'];
        $endTime = date('H:i:s', strtotime($startTime . ' + ' . $schedule->slot_duration . ' minutes'));

        Appointment::create([
            'queue_number' => $queueNumber,
            'patient_id' => $patient->id,
            'doctor_id' => $validated['doctor_id'],
            'poli_id' => $validated['poli_id'],
            'schedule_id' => $schedule->id,
            'appointment_date' => $validated['appointment_date'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => 'booked',
        ]);

        return redirect()->route('patient.kunjungan')->with('success', 'Kunjungan berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Cancel an appointment.
     */
    public function cancel(Request $request, string $id)
    {
        $request->validate([
            'cancel_reason' => 'required|string|max:255',
        ]);

        $patient = Auth::user()->patient;

        $appointment = Appointment::where('id', $id)
            ->where('patient_id', $patient->id)
            ->firstOrFail();

        if ($appointment->status === 'booked') {
            $appointment->update([
                'status' => 'cancelled',
                'cancel_reason' => $request->cancel_reason,
                'cancelled_by' => 'patient'
            ]);

            return redirect()->back()->with('success', 'Kunjungan berhasil dibatalkan.');
        }

        return redirect()->back()->with('error', 'Kunjungan ini tidak dapat dibatalkan.');
    }
}
