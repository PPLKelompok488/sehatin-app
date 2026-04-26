<?php

use App\Http\Controllers\Doctor\AppointmentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['role:doctor'])->prefix('doctor')->name('doctor.')->group(function () {

    Route::get('schedule', [AppointmentController::class, 'index'])
        ->name('schedule');
});