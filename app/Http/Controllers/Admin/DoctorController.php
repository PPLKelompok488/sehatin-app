<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\Poli;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class DoctorController extends Controller
{
    public function index(): Response
    {
        $doctors = Doctor::with(['user', 'poli'])
            ->get()
            ->map(fn($doctor) => [
                'id'             => $doctor->id,
                'user_id'        => $doctor->user_id,
                'poli_id'        => $doctor->poli_id,
                'specialization' => $doctor->specialization,
                'str_number'     => $doctor->str_number,
                'avatar_url'     => $doctor->avatar_url ? asset('storage/' . $doctor->avatar_url) : null,
                'user' => [
                    'name'      => $doctor->user->name,
                    'email'     => $doctor->user->email,
                    'phone'     => $doctor->user->phone,
                    'nik'       => $doctor->user->nik,
                    'is_active' => (bool) $doctor->user->is_active,
                ],
                'poli' => $doctor->poli ? [
                    'name' => $doctor->poli->name,
                ] : null,
            ]);

        $stats = [
            'total'    => $doctors->count(),
            'active'   => $doctors->where('user.is_active', true)->count(),
            'inactive' => $doctors->where('user.is_active', false)->count(),
        ];

        $polis = Poli::where('is_active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/doctors/pages/doctors', [
            'doctors' => $doctors,
            'stats'   => $stats,
            'polis'   => $polis,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|max:255|unique:users,email',
            'password'       => 'required|string|min:8',
            'phone'          => 'required|string|max:20',
            'is_active'      => 'required|boolean',
            'poli_id'        => 'required|exists:polis,id',
            'specialization' => 'required|string|max:255',
            'str_number'     => 'required|string|max:50|unique:doctors,str_number',
            'avatar'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        try {
            DB::transaction(function () use ($validated, $request) {
                // Auto-generate NIK
                $nik = substr(str_shuffle(str_repeat("0123456789", 16)), 0, 16);

                $user = User::create([
                    'nik'       => $nik,
                    'name'      => $validated['name'],
                    'email'     => $validated['email'],
                    'password'  => Hash::make($validated['password']),
                    'phone'     => $validated['phone'],
                    'role'      => 'doctor',
                    'is_active' => $validated['is_active'],
                ]);

                $avatarPath = null;
                if ($request->hasFile('avatar')) {
                    $avatarPath = $request->file('avatar')->store('avatars', 'public');
                }

                Doctor::create([
                    'user_id'        => $user->id,
                    'poli_id'        => $validated['poli_id'],
                    'specialization' => $validated['specialization'],
                    'str_number'     => $validated['str_number'],
                    'avatar_url'     => $avatarPath,
                ]);
            });

            return redirect()->back()->with('success', 'Dokter berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menambahkan dokter. Silakan coba lagi.');
        }
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $doctor = Doctor::findOrFail($id);
        $user = $doctor->user;

        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password'       => 'nullable|string|min:8',
            'phone'          => 'required|string|max:20',
            'is_active'      => 'required|boolean',
            'poli_id'        => 'required|exists:polis,id',
            'specialization' => 'required|string|max:255',
            'str_number'     => ['required', 'string', 'max:50', Rule::unique('doctors')->ignore($doctor->id)],
            'avatar'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        try {
            DB::transaction(function () use ($validated, $user, $doctor, $request) {
                $userData = [
                    'name'      => $validated['name'],
                    'email'     => $validated['email'],
                    'phone'     => $validated['phone'],
                    'is_active' => $validated['is_active'],
                ];

                if (!empty($validated['password'])) {
                    $userData['password'] = Hash::make($validated['password']);
                }

                $user->update($userData);

                $updateData = [
                    'poli_id'        => $validated['poli_id'],
                    'specialization' => $validated['specialization'],
                    'str_number'     => $validated['str_number'],
                ];

                if ($request->hasFile('avatar')) {
                    if ($doctor->avatar_url && Storage::disk('public')->exists($doctor->avatar_url)) {
                        Storage::disk('public')->delete($doctor->avatar_url);
                    }
                    $updateData['avatar_url'] = $request->file('avatar')->store('avatars', 'public');
                }

                $doctor->update($updateData);
            });

            return redirect()->back()->with('success', 'Data dokter berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui data dokter. Silakan coba lagi.');
        }
    }

    public function destroy(int $id): RedirectResponse
    {
        try {
            DB::transaction(function () use ($id) {
                $doctor = Doctor::findOrFail($id);
                $user = $doctor->user;
                
                if ($doctor->avatar_url && Storage::disk('public')->exists($doctor->avatar_url)) {
                    Storage::disk('public')->delete($doctor->avatar_url);
                }
                
                $doctor->delete();
                $user->delete();
            });

            return redirect()->back()->with('success', 'Dokter berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus dokter. Silakan coba lagi.');
        }
    }
}
