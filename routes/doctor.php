<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['role:doctor'])->prefix('doctor')->name('doctor.')->group(function () {

    Route::get('jadwal', fn() => Inertia::render('doctor/jadwal/pages/jadwal'))
        ->name('jadwal');
});