<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Poli;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // 1. Stats Cards
        $totalAppointments = Appointment::count();
        $totalAppointmentsThisMonth = Appointment::where('appointment_date', '>=', $startOfMonth->toDateString())->count();
        $totalAppointmentsLastMonth = Appointment::whereBetween('appointment_date', [$startOfLastMonth->toDateString(), $endOfLastMonth->toDateString()])->count();
        $appointmentsGrowth = $this->calculateGrowth($totalAppointmentsThisMonth, $totalAppointmentsLastMonth);

        $newPatients = Patient::count();
        $newPatientsThisMonth = Patient::where('created_at', '>=', $startOfMonth)->count();
        $newPatientsLastMonth = Patient::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $patientsGrowth = $this->calculateGrowth($newPatientsThisMonth, $newPatientsLastMonth);

        $completedVisits = Appointment::where('status', 'completed')->count();
        $completedThisMonth = Appointment::where('status', 'completed')->where('appointment_date', '>=', $startOfMonth->toDateString())->count();
        $completedLastMonth = Appointment::where('status', 'completed')->whereBetween('appointment_date', [$startOfLastMonth->toDateString(), $endOfLastMonth->toDateString()])->count();
        $completedGrowth = $this->calculateGrowth($completedThisMonth, $completedLastMonth);

        $cancelledVisits = Appointment::where('status', 'cancelled')->count();
        $cancelledThisMonth = Appointment::where('status', 'cancelled')->where('appointment_date', '>=', $startOfMonth->toDateString())->count();
        $cancelledLastMonth = Appointment::where('status', 'cancelled')->whereBetween('appointment_date', [$startOfLastMonth->toDateString(), $endOfLastMonth->toDateString()])->count();
        $cancelledGrowth = $this->calculateGrowth($cancelledThisMonth, $cancelledLastMonth);

        // 2. Visit Statistics (Weekly Trend)
        // For simplicity, let's get data for the current week (Monday to Sunday)
        $startOfWeek = $now->copy()->startOfWeek();
        $visitStats = [];
        $days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startOfWeek->copy()->addDays($i);
            // In a real app, you might differentiate between new and old patients based on their first appointment
            // Here we'll just simulate some data if real data is sparse, or fetch counts
            $count = Appointment::whereDate('appointment_date', $date->toDateString())->count();
            $visitStats[] = [
                'day' => $days[$i],
                'visits' => $count,
                // Simulating new/old for the chart
                'new' => round($count * 0.6),
                'old' => round($count * 0.4),
            ];
        }

        // 3. Favorite Polis
        $favoritePolis = Poli::withCount('doctors') // Just as a placeholder for relationship
            ->get()
            ->map(function($poli) {
                return [
                    'id' => $poli->id,
                    'name' => $poli->name,
                    'count' => Appointment::where('poli_id', $poli->id)->count(),
                    'color' => $this->getPoliColor($poli->id),
                ];
            })
            ->sortByDesc('count')
            ->take(3)
            ->values();

        // 4. Top Doctors
        $topDoctors = Doctor::with(['user', 'poli'])
            ->get()
            ->map(function($doctor) {
                return [
                    'name' => $doctor->user->name,
                    'specialization' => $doctor->poli->name,
                    'count' => Appointment::where('doctor_id', $doctor->id)->count(),
                    'avatar' => $doctor->avatar_url,
                ];
            })
            ->sortByDesc('count')
            ->take(2)
            ->values();

        return Inertia::render('admin/dashboard/pages/dashboard', [
            'stats' => [
                'totalAppointments' => [
                    'value' => number_format($totalAppointments),
                    'growth' => $appointmentsGrowth,
                ],
                'newPatients' => [
                    'value' => number_format($newPatients),
                    'growth' => $patientsGrowth,
                ],
                'completedVisits' => [
                    'value' => number_format($completedVisits),
                    'growth' => $completedGrowth,
                ],
                'cancelledVisits' => [
                    'value' => number_format($cancelledVisits),
                    'growth' => $cancelledGrowth,
                ],
            ],
            'visitStats' => $visitStats,
            'favoritePolis' => $favoritePolis,
            'topDoctors' => $topDoctors,
        ]);
    }

    private function calculateGrowth($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        return round((($current - $previous) / $previous) * 100, 1);
    }

    private function getPoliColor($id)
    {
        $colors = ['#FF5252', '#448AFF', '#7C4DFF', '#00E676', '#FFD740'];
        return $colors[$id % count($colors)];
    }
}
