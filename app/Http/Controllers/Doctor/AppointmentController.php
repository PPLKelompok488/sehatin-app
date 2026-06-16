<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
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

        // Get today's appointments (selalu hari ini)
        $todayAppointments = Appointment::with(['patient.user', 'poli'])
            ->where('doctor_id', $doctor->id)
            ->whereIn('status', ['booked', 'completed'])
            ->whereDate('appointment_date', today())
            ->orderBy('start_time', 'ASC')
            ->get();

        // Get appointments untuk minggu yang dipilih
        $upcomingAppointments = Appointment::with(['patient.user', 'poli'])
            ->where('doctor_id', $doctor->id)
            ->whereIn('status', ['booked', 'completed'])
            ->whereDate('appointment_date', '>=', $weekStart)
            ->whereDate('appointment_date', '<=', $weekEnd)
            ->orderBy('appointment_date', 'ASC')
            ->orderBy('start_time', 'ASC')
            ->get();

        $upcomingAppointmentsGrouped = $upcomingAppointments->groupBy(function ($apt) {
            return Carbon::parse($apt->appointment_date)->format('Y-m-d');
        });

        // Total pasien minggu yang sedang dilihat
        $totalWeek = Appointment::where('doctor_id', $doctor->id)
            ->whereIn('status', ['booked', 'completed'])
            ->whereDate('appointment_date', '>=', $weekStart)
            ->whereDate('appointment_date', '<=', $weekEnd)
            ->count();

        // Next patient (tetap hari ini)
        $nextPatient = null;
        $nextAppointment = $todayAppointments->first();
        if ($nextAppointment) {
            $nextPatient = [
                'id'         => $nextAppointment->id,
                'name'       => $nextAppointment->patient->user->name ?? 'Pasien',
                'time_slot'  => $nextAppointment->start_time,
                'avatar_url' => $nextAppointment->patient->user->avatar 
                    ? Storage::url($nextAppointment->patient->user->avatar) 
                    : null,
            ];
        }

        // Transform appointments to include avatar URLs
        $todayAppointmentsTransformed = $todayAppointments->map(function ($apt) {
            return array_merge($apt->toArray(), [
                'avatar_url' => $apt->patient->user->avatar 
                    ? Storage::url($apt->patient->user->avatar) 
                    : null,
            ]);
        });

        $upcomingAppointmentsTransformed = collect($upcomingAppointmentsGrouped)->map(function ($dayAppointments) {
            return $dayAppointments->map(function ($apt) {
                return array_merge($apt->toArray(), [
                    'avatar_url' => $apt->patient->user->avatar 
                        ? Storage::url($apt->patient->user->avatar) 
                        : null,
                ]);
            });
        });

        return Inertia::render('doctor/schedule/pages/schedule', [
            'todayAppointments'    => $todayAppointmentsTransformed,
            'upcomingAppointments' => $upcomingAppointmentsTransformed,
            'stats' => [
                'total_today'  => $todayAppointments->count(),
                'total_week'   => $totalWeek,
                'next_patient' => $nextPatient,
            ],
            'currentWeekStart' => $weekStart->toDateString(),
            'schedules' => $doctor->schedules()->where('is_active', true)->get(),
        ]);
    }
}