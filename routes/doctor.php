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
});