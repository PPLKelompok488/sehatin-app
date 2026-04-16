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
            $first = $group->sortBy('id')->first();
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
        })
            ->sortByDesc('id')
            ->values();

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
            $overlap = DoctorSchedule::where('doctor_id', $doctorId)
                ->where('day_of_week', $validated['day_of_week'])
                ->where(function ($query) use ($validated) {
                    $query->where('start_time', '<', $validated['end_time'])
                        ->where('end_time', '>', $validated['start_time']);
                })
                ->exists();

            if ($overlap) {
                $doctor = \App\Models\Doctor::with('user')->find($doctorId);
                return redirect()->back()->with('error', "Dokter {$doctor->user->name} sudah memiliki jadwal yang bentrok di waktu tersebut.");
            }
        }

        try {
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

            return redirect()->back()->with('success', 'Jadwal dokter berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menambahkan jadwal dokter. Silakan coba lagi.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'day_of_week' => 'required|string',
            'start_time' => 'required',
            'end_time' => 'required',
            'slot_duration' => 'required|integer',
            'is_active' => 'required|boolean',
            'doctor_ids' => 'required|array',
            'doctor_ids.*' => 'exists:doctors,id',
            'old_day_of_week' => 'required|string',
            'old_start_time' => 'required',
            'old_end_time' => 'required',
            'old_slot_duration' => 'required|integer',
        ]);

        foreach ($validated['doctor_ids'] as $doctorId) {
            $overlap = DoctorSchedule::where('doctor_id', $doctorId)
                ->where('day_of_week', $validated['day_of_week'])
                ->where(function ($query) use ($validated) {
                    $query->where('start_time', '<', $validated['end_time'])
                        ->where('end_time', '>', $validated['start_time']);
                })
                ->whereNot(function ($query) use ($validated) {
                    $query->where('day_of_week', $validated['old_day_of_week'])
                        ->where('start_time', $validated['old_start_time'])
                        ->where('end_time', $validated['old_end_time'])
                        ->where('slot_duration', $validated['old_slot_duration']);
                })
                ->exists();

            if ($overlap) {
                $doctor = \App\Models\Doctor::with('user')->find($doctorId);
                return redirect()->back()->with('error', "Dokter {$doctor->user->name} sudah memiliki jadwal bentrok di waktu tersebut.");
            }
        }

        $existingRecords = DoctorSchedule::where([
            'day_of_week' => $validated['old_day_of_week'],
            'start_time' => $validated['old_start_time'],
            'end_time' => $validated['old_end_time'],
            'slot_duration' => $validated['old_slot_duration'],
        ])->get();

        $existingDoctorIds = $existingRecords->pluck('doctor_id')->toArray();
        $targetDoctorIds = array_map('intval', $validated['doctor_ids']);

        try {
            $toRemove = array_diff($existingDoctorIds, $targetDoctorIds);
            if (!empty($toRemove)) {
                DoctorSchedule::where([
                    'day_of_week' => $validated['old_day_of_week'],
                    'start_time' => $validated['old_start_time'],
                    'end_time' => $validated['old_end_time'],
                    'slot_duration' => $validated['old_slot_duration'],
                ])->whereIn('doctor_id', $toRemove)->delete();
            }

            $toAdd = array_diff($targetDoctorIds, $existingDoctorIds);
            foreach ($toAdd as $doctorId) {
                DoctorSchedule::create([
                    'doctor_id' => $doctorId,
                    'day_of_week' => $validated['day_of_week'],
                    'start_time' => $validated['start_time'],
                    'end_time' => $validated['end_time'],
                    'slot_duration' => $validated['slot_duration'],
                    'is_active' => $validated['is_active'],
                ]);
            }

            $common = array_intersect($existingDoctorIds, $targetDoctorIds);
            if (!empty($common)) {
                DoctorSchedule::where([
                    'day_of_week' => $validated['old_day_of_week'],
                    'start_time' => $validated['old_start_time'],
                    'end_time' => $validated['old_end_time'],
                    'slot_duration' => $validated['old_slot_duration'],
                ])->whereIn('doctor_id', $common)->update([
                    'day_of_week' => $validated['day_of_week'],
                    'start_time' => $validated['start_time'],
                    'end_time' => $validated['end_time'],
                    'slot_duration' => $validated['slot_duration'],
                    'is_active' => $validated['is_active'],
                ]);
            }

            return redirect()->back()->with('success', 'Jadwal dokter berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui jadwal dokter. Silakan coba lagi.');
        }
    }

}
