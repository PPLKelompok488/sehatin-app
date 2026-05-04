<?php

use App\Http\Controllers\Patient\AppointmentController;
use App\Http\Controllers\Patient\MedicalRecordController;
use Illuminate\Support\Facades\Route;

Route::middleware(['role:patient'])->prefix('patient')->name('patient.')->group(function () {

    Route::get('kunjungan', [AppointmentController::class, 'index'])
        ->name('kunjungan');

    Route::get('history', [MedicalRecordController::class, 'index'])
        ->name('history');

    Route::get('buat-kunjungan', [AppointmentController::class, 'create'])
        ->name('buat-kunjungan');
    Route::post('buat-kunjungan', [AppointmentController::class, 'store'])
        ->name('buat-kunjungan.store');

    Route::get('kunjungan/{appointment}', [AppointmentController::class, 'show'])
        ->name('kunjungan.show');

    Route::post('kunjungan/{id}/cancel', [AppointmentController::class, 'cancel'])
        ->name('kunjungan.cancel');
});