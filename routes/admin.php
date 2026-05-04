<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('schedules', [\App\Http\Controllers\Admin\DoctorScheduleController::class, 'index'])
        ->name('schedules');
    Route::post('schedules', [\App\Http\Controllers\Admin\DoctorScheduleController::class, 'store'])
        ->name('schedules.store');
    Route::put('schedules/{id}', [\App\Http\Controllers\Admin\DoctorScheduleController::class, 'update'])
        ->name('schedules.update');
    Route::delete('schedules/{id}', [\App\Http\Controllers\Admin\DoctorScheduleController::class, 'destroy'])
        ->name('schedules.destroy');

    Route::get('polis', [\App\Http\Controllers\Admin\PoliController::class, 'index'])
        ->name('polis');
    Route::post('polis', [\App\Http\Controllers\Admin\PoliController::class, 'store'])
        ->name('polis.store');
    Route::put('polis/{id}', [\App\Http\Controllers\Admin\PoliController::class, 'update'])
        ->name('polis.update');
    Route::delete('polis/{id}', [\App\Http\Controllers\Admin\PoliController::class, 'destroy'])
        ->name('polis.destroy');

    Route::get('doctors', [\App\Http\Controllers\Admin\DoctorController::class, 'index'])
        ->name('doctors');
    Route::post('doctors', [\App\Http\Controllers\Admin\DoctorController::class, 'store'])
        ->name('doctors.store');
    Route::put('doctors/{id}', [\App\Http\Controllers\Admin\DoctorController::class, 'update'])
        ->name('doctors.update');
    Route::delete('doctors/{id}', [\App\Http\Controllers\Admin\DoctorController::class, 'destroy'])
        ->name('doctors.destroy');
});