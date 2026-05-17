<?php

use App\Http\Controllers\Doctor\AppointmentController;
use App\Http\Controllers\Doctor\MedicalRecordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['role:doctor'])->prefix('doctor')->name('doctor.')->group(function () {

    Route::get('schedule', [AppointmentController::class, 'index'])
        ->name('schedule');

    Route::get('appointments/{appointment}/medical-record', [MedicalRecordController::class, 'show'])
        ->name('medical-record.show');

    Route::get('appointments/{appointment}/medical-record/create', [MedicalRecordController::class, 'create'])
        ->name('medical-record.create');

    Route::post('appointments/{appointment}/medical-record', [MedicalRecordController::class, 'store'])
        ->name('medical-record.store');

    Route::get('patients/{patient}/history', [MedicalRecordController::class, 'history'])
        ->name('medical-record.history');
});