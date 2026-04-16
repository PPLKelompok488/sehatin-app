<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DoctorSchedule;
use Inertia\Inertia;
use Inertia\Response;

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

        return Inertia::render('admin/schedules/pages/schedules', [
            'schedules' => $processedSchedules,
        ]);
    }
}
