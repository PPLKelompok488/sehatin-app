<?php

use App\Http\Controllers\Patient\AppointmentController;
use App\Http\Controllers\Patient\MedicalRecordController;
use App\Http\Controllers\Patient\SettingsController;
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

    // Patient Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('profile', [SettingsController::class, 'editProfile'])
            ->name('profile');
        Route::post('profile', [SettingsController::class, 'updateProfile'])
            ->name('profile.update');
        Route::delete('profile/avatar', [SettingsController::class, 'destroyAvatar'])
            ->name('profile.avatar.destroy');
    });
});