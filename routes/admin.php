<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('dashboard', fn() => Inertia::render('admin/dashboard/pages/dashboard'))
        ->name('dashboard');

    Route::get('schedules', [\App\Http\Controllers\Admin\DoctorScheduleController::class, 'index'])
        ->name('schedules');

    Route::get('polis', fn() => Inertia::render('admin/polis/pages/polis'))
        ->name('polis');

    Route::get('doctors', fn() => Inertia::render('admin/doctors/pages/doctors'))
        ->name('doctors');
});