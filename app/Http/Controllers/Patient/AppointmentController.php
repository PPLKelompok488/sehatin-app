<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Poli;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('patient/kunjungan/pages/kunjungan');
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
        // Logic for storing appointment will go here
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
}
