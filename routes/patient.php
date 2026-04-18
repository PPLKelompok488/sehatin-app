<?php

use App\Http\Controllers\Patient\AppointmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['role:patient'])->prefix('patient')->name('patient.')->group(function () {

    Route::get('kunjungan', [AppointmentController::class, 'index'])
        ->name('kunjungan');

    Route::get('buat-kunjungan', [AppointmentController::class, 'create'])
        ->name('buat-kunjungan');
});