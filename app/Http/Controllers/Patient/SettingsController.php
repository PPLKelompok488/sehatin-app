<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\Settings\ProfileUpdateRequest;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Show the patient's profile settings page.
     */
    public function editProfile(Request $request): Response
    {
        $user = $request->user();
        $patient = $user->patient;

        return Inertia::render('patient/settings/profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'nik' => $user->nik,
                'avatar_url' => $user->avatar ? Storage::url($user->avatar) : null,
            ],
            'patient' => [
                'id' => $patient->id,
                'user_id' => $patient->user_id,
                'date_of_birth' => $patient->date_of_birth,
                'gender' => $patient->gender,
                'address' => $patient->address,
                'blood_type' => $patient->blood_type,
            ],
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the patient's profile.
     */
    public function updateProfile(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        // Update user data
        $user->fill([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        // Update password if provided
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // Update patient data
        $patient = $user->patient;
        $patient->update([
            'date_of_birth' => $validated['date_of_birth'],
            'gender' => $validated['gender'],
            'address' => $validated['address'],
            'blood_type' => $validated['blood_type'],
        ]);

        $user->save();

        return redirect()->route('patient.settings.profile')
            ->with('status', 'Profil Anda berhasil diperbarui.');
    }

    public function destroyAvatar(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->avatar = null;
            $user->save();
        }

        return redirect()->route('patient.settings.profile')
            ->with('status', 'Foto profil berhasil dihapus.');
    }
}
