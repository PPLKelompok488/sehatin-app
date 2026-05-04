<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return match (auth()->user()->role) {
            'admin'   => redirect()->route('admin.dashboard'),
            'doctor'  => redirect()->route('doctor.schedule'),
            'patient' => redirect()->route('patient.kunjungan'),
            default   => redirect('/'),
        };
    })->name('dashboard');

    require __DIR__.'/admin.php';
    require __DIR__.'/doctor.php';
    require __DIR__.'/patient.php';
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';