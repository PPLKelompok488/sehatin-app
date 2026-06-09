<?php

use App\Console\Commands\SendAppointmentReminders;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Task Scheduling — Pengingat Janji Temu H-1
|--------------------------------------------------------------------------
| Scheduler ini berjalan setiap menit untuk mendeteksi janji temu besok.
| Jalankan dengan: php artisan schedule:work
|
| Kolom `reminder_sent` pada tabel `appointments` memastikan setiap
| pasien hanya mendapatkan SATU email pengingat, bukan setiap menit.
|--------------------------------------------------------------------------
*/
Schedule::command(SendAppointmentReminders::class)
    ->everyMinute()
    ->name('send-appointment-reminders')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/reminders.log'));
