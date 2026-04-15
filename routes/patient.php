<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['role:patient'])->prefix('patient')->name('patient.')->group(function () {

    Route::get('kunjungan', fn() => Inertia::render('patient/kunjungan/pages/kunjungan'))
        ->name('kunjungan');
});