<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public Appointment $appointment)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🔔 Pengingat Janji Temu Anda Besok — RS Sehatin',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $appointment = $this->appointment;

        // Format data for the template
        $patientName   = $appointment->patient->user->name ?? 'Pasien';
        $doctorName    = $appointment->doctor->user->name ?? 'Dokter';
        $specialization = $appointment->doctor->specialization ?? 'Umum';
        $poliName      = $appointment->poli->name ?? 'Umum';
        $appointmentDate = \Carbon\Carbon::parse($appointment->appointment_date)
            ->locale('id')
            ->translatedFormat('l, d F Y');
        $appointmentTime = \Carbon\Carbon::parse($appointment->start_time)->format('H:i') . ' WIB';
        $queueNumber   = $appointment->queue_number;
        $appointmentUrl = url('/patient/kunjungan/' . $appointment->id);

        return new Content(
            view: 'emails.reminder',
            with: [
                'patientName'    => $patientName,
                'doctorName'     => $doctorName,
                'specialization' => $specialization,
                'poliName'       => $poliName,
                'appointmentDate'=> $appointmentDate,
                'appointmentTime'=> $appointmentTime,
                'queueNumber'    => $queueNumber,
                'appointmentUrl' => $appointmentUrl,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
