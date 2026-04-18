<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MedicalRecordController extends Controller
{
    public function index()
    {
        // Ambil data pasien dari user yang login
        $patient = Auth::user()->patient;

        if (!$patient) {
            return redirect()->back()->with('error', 'Data pasien tidak ditemukan.');
        }

        // Ambil riwayat medis, urutkan dari yang terbaru
        $history = MedicalRecord::with(['doctor.user', 'appointment.poli'])
            ->where('patient_id', $patient->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'date' => $record->created_at->format('d'),
                    'month' => $record->created_at->format('M'),
                    'full_date' => $record->created_at->format('d F Y'),
                    'time' => $record->created_at->format('H:i'),
                    'doctor_name' => $record->doctor->user->name ?? 'Dokter',
                    'poli_name' => $record->appointment->poli->name ?? 'Umum',
                    'complaint' => $record->subjective, // Mapping Subjective ke Keluhan
                    'diagnosis' => $record->assessment, // Mapping Assessment ke Diagnosa
                    'treatment' => $record->plan,       // Mapping Plan ke Tindakan
                ];
            });

        return Inertia::render('Patient/History/Index', [
            'history' => $history
        ]);
    }
}
