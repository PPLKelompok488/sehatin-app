<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clinic_statistics', function (Blueprint $table) {
            $table->id();
            $table->date('stat_date');
            $table->foreignId('poli_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('total_appointments')->default(0);
            $table->integer('total_completed')->default(0);
            $table->integer('total_cancelled')->default(0);
            $table->integer('total_no_show')->default(0);
            $table->integer('total_new_patients')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinic_statistics');
    }
};
