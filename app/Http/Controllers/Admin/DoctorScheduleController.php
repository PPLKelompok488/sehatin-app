<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DoctorSchedule;
use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DoctorScheduleController extends Controller
{

    public function index(): Response
    {
        $schedules = DoctorSchedule::with(['doctor.user'])
            ->get();
        $processedSchedules = $schedules->groupBy(function ($item) {
            return $item->day_of_week . '|' . $item->start_time . '|' . $item->end_time . '|' . $item->slot_duration;
        })->map(function ($group) {
            $first = $group->first();
            return [
                'id' => $first->id,
                'doctor_id' => $first->doctor_id,
                'day_of_week' => $first->day_of_week,
                'start_time' => $first->start_time,
                'end_time' => $first->end_time,
                'slot_duration' => (int) $first->slot_duration,
                'is_active' => (bool) $first->is_active,
                'doctors' => $group->map(function ($item) {
                    return [
                        'id' => $item->doctor->id,
                        'name' => $item->doctor->user->name,
                        'avatar_url' => $item->doctor->avatar_url,
                    ];
                })->values()->toArray()
            ];
        })->values();

        $doctors = \App\Models\Doctor::with('user')->get()->map(function ($doctor) {
            return [
                'id' => $doctor->id,
                'name' => $doctor->user->name,
                'avatar_url' => $doctor->avatar_url,
                'specialization' => $doctor->specialization,
            ];
        });

        return Inertia::render('admin/schedules/pages/schedules', [
            'schedules' => $processedSchedules,
            'doctors' => $doctors,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'day_of_week' => 'required|string',
            'start_time' => 'required',
            'end_time' => 'required',
            'slot_duration' => 'required|integer',
            'is_active' => 'required|boolean',
            'doctor_ids' => 'required|array',
            'doctor_ids.*' => 'exists:doctors,id',
        ]);

        foreach ($validated['doctor_ids'] as $doctorId) {
            DoctorSchedule::create([
                'doctor_id' => $doctorId,
                'day_of_week' => $validated['day_of_week'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'slot_duration' => $validated['slot_duration'],
                'is_active' => $validated['is_active'],
            ]);
        }

        return redirect()->back();
    }
}
