<?php

namespace App\Console\Commands;

use App\Mail\AppointmentReminderMail;
use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendAppointmentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-appointment-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kirim email pengingat H-1 kepada pasien yang memiliki janji temu besok';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $tomorrow = Carbon::tomorrow()->toDateString();

        $this->info("🔍 Mencari janji temu pada tanggal: {$tomorrow}...");

        // Query janji temu besok yang statusnya booked dan belum dikirim pengingatnya
        $appointments = Appointment::with([
            'patient.user',
            'doctor.user',
            'poli',
        ])
            ->whereDate('appointment_date', $tomorrow)
            ->where('status', 'booked')
            ->where('reminder_sent', false)
            ->get();

        if ($appointments->isEmpty()) {
            $this->info('✅ Tidak ada janji temu H-1 yang perlu dikirim pengingatnya.');
            return self::SUCCESS;
        }

        $this->info("📋 Ditemukan {$appointments->count()} janji temu. Memulai pengiriman email...");

        $successCount = 0;
        $failCount    = 0;

        foreach ($appointments as $appointment) {
            // Pastikan data pasien dan user email tersedia
            $patientUser = optional($appointment->patient)->user;

            if (! $patientUser || ! $patientUser->email) {
                $this->warn("⚠️  Janji temu ID {$appointment->id}: email pasien tidak ditemukan. Dilewati.");
                $failCount++;
                continue;
            }

            try {
                // Kirim email ke alamat pasien masing-masing
                Mail::to($patientUser->email)->send(new AppointmentReminderMail($appointment));

                // Tandai sebagai sudah dikirim agar tidak dikirim ulang
                $appointment->update(['reminder_sent' => true]);

                $this->info("✉️  Email terkirim ke: {$patientUser->email} (Pasien: {$patientUser->name})");
                Log::info("AppointmentReminder: Email berhasil dikirim.", [
                    'appointment_id' => $appointment->id,
                    'patient_email'  => $patientUser->email,
                    'patient_name'   => $patientUser->name,
                    'appointment_date' => $tomorrow,
                ]);

                $successCount++;
            } catch (Throwable $e) {
                $this->error("❌ Gagal mengirim ke {$patientUser->email}: {$e->getMessage()}");
                Log::error("AppointmentReminder: Gagal mengirim email.", [
                    'appointment_id' => $appointment->id,
                    'patient_email'  => $patientUser->email,
                    'error'          => $e->getMessage(),
                ]);

                $failCount++;
            }
        }

        $this->newLine();
        $this->info("🎉 Selesai! Berhasil: {$successCount} | Gagal: {$failCount}");

        return self::SUCCESS;
    }
}
