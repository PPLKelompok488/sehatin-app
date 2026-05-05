<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Carbon\Carbon;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index()
    {
        $doctor = auth()->user()->doctor;

        // Ambil minggu dari request, default minggu ini
        $weekStart = request('week_start')
            ? Carbon::parse(request('week_start'))->startOfDay()
            : today()->startOfWeek();
        $weekEnd = $weekStart->copy()->addDays(6)->endOfDay();

        // Get today's booked appointments (selalu hari ini)
        $todayAppointments = Appointment::with(['patient.user', 'poli'])
            ->where('doctor_id', $doctor->id)
            ->where('status', 'booked')
            ->whereDate('appointment_date', today())
            ->orderBy('start_time', 'ASC')
            ->get();

        // Get appointments untuk minggu yang dipilih
        $upcomingAppointments = Appointment::with(['patient.user', 'poli'])
            ->where('doctor_id', $doctor->id)
            ->where('status', 'booked')
            ->whereDate('appointment_date', '>=', $weekStart)
            ->whereDate('appointment_date', '<=', $weekEnd)
            ->orderBy('appointment_date', 'ASC')
            ->orderBy('start_time', 'ASC')
            ->get()
            ->groupBy('appointment_date');

        // Total pasien minggu yang sedang dilihat
        $totalWeek = Appointment::where('doctor_id', $doctor->id)
            ->where('status', 'booked')
            ->whereDate('appointment_date', '>=', $weekStart)
            ->whereDate('appointment_date', '<=', $weekEnd)
            ->count();

        // Next patient (tetap hari ini)
        $nextPatient = null;
        $nextAppointment = $todayAppointments->first();
        if ($nextAppointment) {
            $nextPatient = [
                'id'        => $nextAppointment->id,
                'name'      => $nextAppointment->patient->user->name ?? 'Pasien',
                'time_slot' => $nextAppointment->start_time,
            ];
        }

        return Inertia::render('doctor/schedule/pages/schedule', [
            'todayAppointments'   => $todayAppointments,
            'upcomingAppointments' => $upcomingAppointments,
            'stats' => [
                'total_today'  => $todayAppointments->count(),
                'total_week'   => $totalWeek,
                'next_patient' => $nextPatient,
            ],
            'currentWeekStart' => $weekStart->toDateString(),
        ]);
    }
}