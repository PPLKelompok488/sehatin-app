<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClinicStatistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'stat_date',
        'poli_id',
        'doctor_id',
        'total_appointments',
        'total_completed',
        'total_cancelled',
        'total_no_show',
        'total_new_patients',
    ];

    public function poli(): BelongsTo
    {
        return $this->belongsTo(Poli::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }
}
