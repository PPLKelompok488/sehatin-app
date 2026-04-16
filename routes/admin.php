<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('dashboard', fn() => Inertia::render('admin/dashboard/pages/dashboard'))
        ->name('dashboard');

    Route::get('schedules', [\App\Http\Controllers\Admin\DoctorScheduleController::class, 'index'])
        ->name('schedules');
    Route::post('schedules', [\App\Http\Controllers\Admin\DoctorScheduleController::class, 'store'])
        ->name('schedules.store');
        
    Route::put('schedules/{id}', [\App\Http\Controllers\Admin\DoctorScheduleController::class, 'update'])
        ->name('schedules.update');

    Route::get('polis', fn() => Inertia::render('admin/polis/pages/polis'))
        ->name('polis');

    Route::get('doctors', fn() => Inertia::render('admin/doctors/pages/doctors'))
        ->name('doctors');
});