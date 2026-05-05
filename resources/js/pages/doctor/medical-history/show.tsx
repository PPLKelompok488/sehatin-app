import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MedicalRecord {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    blood_pressure: string;
    heart_rate: string;
    temperature: string;
    weight: string;
    blood_sugar: string;
    medicine: string;
}

interface Appointment {
    id: number;
    queue_number: string;
    appointment_date: string;
    start_time: string;
    status: 'booked' | 'completed' | 'cancelled';
}

interface Patient {
    id: number;
    name: string;
    gender: string;
    age: number | null;
    avatar: string | null;
}

interface Doctor {
    name: string;
    specialization: string;
    avatar: string | null;
}

interface Props {
    appointment: Appointment;
    patient: Patient;
    doctor: Doctor;
    medical_record: MedicalRecord | null;
}

export default function MedicalHistoryShow({ appointment, patient, doctor, medical_record }: Props) {
    const isCompleted = appointment.status === 'completed';

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <AppLayout>
            <Head title={`Rekam Medis - ${patient.name}`} />

            <main className="max-w-7xl mx-auto pb-16 pt-8">
                {/* Summary Card */}
                <section className="mb-12">
                    <div className="bg-white rounded-2xl p-8 md:p-10 border border-border/40 shadow-sm flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 select-none pointer-events-none text-primary">
                            <span className="material-symbols-outlined text-9xl">person</span>
                        </div>
                        <div className="flex-shrink-0">
                            <Avatar className="w-32 h-32 rounded-2xl border-2 border-border/10 shadow-inner">
                                <AvatarImage src={patient.avatar || ''} alt={patient.name} className="object-cover" />
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                    {getInitials(patient.name)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-on-surface">{patient.name}</h1>
                                    <p className="text-sm font-medium text-on-surface-variant mt-1">
                                        {patient.gender}, {patient.age ? `${patient.age} Tahun` : '-'}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <Button className="w-full bg-primary text-white font-semibold shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0 transition-all">
                                        <span className="material-symbols-outlined text-lg">edit_note</span>
                                        Rekam Medis Pasien
                                    </Button>
                                    <Button variant="outline" className="w-full border-primary/20 text-primary font-semibold hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-lg">history</span>
                                        Histori Kunjungan
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-8 mt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                                    </div>
                                    <span className="text-sm font-semibold text-on-surface">
                                        {appointment.appointment_date}, {appointment.start_time}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange/5 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-orange text-xl">confirmation_number</span>
                                    </div>
                                    <span className="text-sm font-semibold text-on-surface">ID: {appointment.queue_number}</span>
                                </div>
                                <div className="flex items-center gap-3 pl-6 border-l border-border/30">
                                    <Avatar className="w-8 h-8 rounded-full border border-border/20 shadow-sm">
                                        <AvatarImage src={doctor.avatar || ''} alt={doctor.name} />
                                        <AvatarFallback className="text-[10px]">
                                            {getInitials(doctor.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-medium text-on-surface-variant leading-none">Oleh Dokter</span>
                                        <span className="text-sm font-semibold text-on-surface mt-1">{doctor.name} (Kamu)</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className={cn(
                                        "px-5 py-2 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-2",
                                        isCompleted ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-on-surface-variant"
                                    )}>
                                        <span className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            isCompleted ? "bg-emerald-500 animate-pulse" : "bg-on-surface-variant/40"
                                        )}></span>
                                        {isCompleted ? 'Selesai' : 'Terdaftar'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Timeline mapping equivalent */}
                            <div className="max-w-md mx-auto md:mx-0">
                                <div className="flex items-center justify-between relative h-12">
                                    <div className="absolute h-0.5 bg-surface-container left-0 right-0 top-1/2 -translate-y-1/2 z-0"></div>
                                    <div className={cn(
                                        "absolute h-0.5 bg-primary left-0 top-1/2 -translate-y-1/2 z-0 transition-all duration-500",
                                        isCompleted ? "w-full" : "w-1/2"
                                    )}></div>
                                    
                                    <TimelineStep label="Booked" active={true} />
                                    <TimelineStep label="Visit" active={true} />
                                    <TimelineStep label="Completed" active={isCompleted} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {medical_record ? (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                        {/* Clinical Findings & Prescriptions */}
                        <div className="xl:col-span-8 space-y-8">
                            <div>
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">description</span>
                                    </div>
                                    Temuan Klinis
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ClinicalNote letter="S" title="Subjektif" color="bg-[#E0F2FE] text-[#0284C7]">
                                        {medical_record.subjective}
                                    </ClinicalNote>
                                    <ClinicalNote letter="O" title="Objektif" color="bg-[#DCFCE7] text-[#166534]">
                                        {medical_record.objective}
                                    </ClinicalNote>
                                    <ClinicalNote letter="D" title="Diagnosis" color="bg-[#FEF3C7] text-[#92400E]">
                                        {medical_record.assessment}
                                    </ClinicalNote>
                                    <ClinicalNote letter="R" title="Rekomendasi" color="bg-[#F5F3FF] text-[#6D28D9]">
                                        {medical_record.plan}
                                    </ClinicalNote>
                                </div>
                            </div>

                            {/* Prescriptions */}
                            <div className="mt-8">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">medication</span>
                                    </div>
                                    Resep Obat & Dosis
                                </h2>
                                <div className="bg-white p-8 rounded-2xl border border-border/10">
                                    <div className="space-y-6">
                                        <p className="text-on-surface-variant text-sm whitespace-pre-line">
                                            {medical_record.medicine}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vital Signs Sidebar */}
                        <aside className="xl:col-span-4 space-y-8">
                            <div>
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">monitoring</span>
                                    </div>
                                    Tanda Vital
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <VitalSign icon="blood_pressure" label="Tekanan darah" value={medical_record.blood_pressure} normal="Normal: <120/80" iconColor="text-red-500" />
                                    <VitalSign icon="favorite" label="Detak jantung" value={`${medical_record.heart_rate} bpm`} normal="Normal: 60-100" iconColor="text-primary" />
                                    <VitalSign icon="device_thermostat" label="Suhu tubuh" value={`${medical_record.temperature}°C`} normal="Normal: 36.5-37.5" iconColor="text-amber-500" />
                                    <VitalSign icon="weight" label="Berat badan" value={`${medical_record.weight} kg`} normal="" iconColor="text-blue-400" />
                                    <div className="col-span-2">
                                        <VitalSign icon="water_drop" label="Gula darah" value={`${medical_record.blood_sugar} mg/dL`} normal="Normal: 70-110 mg/dL" iconColor="text-purple-500" />
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                ) : (
                    /* Empty State Content */
                    <div className="flex flex-col items-center justify-center py-32 px-6 bg-surface-container/30 border-2 border-dashed border-border rounded-3xl text-center">
                        <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center mb-8">
                            <span className="material-symbols-outlined text-primary/40 text-5xl">edit_note</span>
                        </div>
                        <h3 className="text-2xl font-bold text-on-surface mb-3">Rekam medis belum diisi</h3>
                        <p className="text-on-surface-variant max-w-md text-sm leading-relaxed mb-10">
                            Catatan medis (SOAP) dan resep obat untuk kunjungan ini belum tersedia. Silakan klik tombol periksa untuk mulai mengisi data pemeriksaan pasien.
                        </p>
                        <Button className="bg-primary text-white px-10 py-6 h-auto rounded-2xl font-semibold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-base">
                            Mulai Periksa Sekarang
                        </Button>
                    </div>
                )}
            </main>
        </AppLayout>
    );
}

function TimelineStep({ label, active }: { label: string; active: boolean }) {
    return (
        <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-3">
            <div className={cn(
                "w-4 h-4 rounded-full border-4 transition-all duration-500",
                active ? "bg-primary border-primary/20" : "bg-surface-container border-white"
            )}></div>
            <span className={cn(
                "text-[10px] font-bold tracking-wider transition-colors duration-500",
                active ? "text-primary" : "text-on-surface-variant"
            )}>{label}</span>
        </div>
    );
}

function ClinicalNote({ letter, title, color, children }: { letter: string; title: string; color: string; children: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-border/20 hover:border-primary/30 transition-all group">
            <div className="flex items-center gap-3 mb-4">
                <span className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold", color)}>
                    {letter}
                </span>
                <h3 className="font-bold text-on-surface">{title}</h3>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">{children || '-'}</p>
        </div>
    );
}

function VitalSign({ icon, label, value, normal, iconColor }: { icon: string; label: string; value: string; normal: string; iconColor: string }) {
    return (
        <div className="bg-white p-5 rounded-2xl flex flex-col items-center text-center border border-border/20">
            <span className={cn("material-symbols-outlined mb-3", iconColor)} style={{ fontVariationSettings: "'FILL' 1" }}>
                {icon}
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant/40 tracking-widest mb-1 uppercase">{label}</span>
            <span className="text-xl font-extrabold text-on-surface">{value || '-'}</span>
            {normal && <span className="text-[10px] text-on-surface-variant/60 mt-1">{normal}</span>}
        </div>
    );
}
