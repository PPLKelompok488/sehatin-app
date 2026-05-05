<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['role:doctor'])->prefix('doctor')->name('doctor.')->group(function () {

    Route::get('schedule', fn() => Inertia::render('doctor/schedule/pages/schedule'))
        ->name('schedule');
});