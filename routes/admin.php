<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('dashboard', fn() => Inertia::render('admin/dashboard/pages/dashboard'))
        ->name('dashboard');

    Route::get('schedules', fn() => Inertia::render('admin/schedules/pages/schedules'))
        ->name('schedules');
});