import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/page-header';

interface Doctor {
    name: string;
    specialization: string;
    avatar: string | null;
}

interface Appointment {
    id: number;
    appointment_date: string;
    start_time: string;
    queue_number: string;
    status: 'booked' | 'completed' | 'cancelled';
    doctor: Doctor;
    has_record: boolean;
}

interface Patient {
    id: number;
    name: string;
}

interface Props {
    patient: Patient;
    appointments: Appointment[];
}

export default function MedicalHistoryHistory({ patient, appointments }: Props) {
    const totalVisits = appointments.filter(a => a.status === 'completed').length;

    return (
        <AppLayout>
            <Head title={`Histori Kunjungan - ${patient.name}`} />

            <main className="max-w-7xl mx-auto pt-8 px-6 pb-12">
                <Breadcrumbs 
                    breadcrumbs={[
                        { title: 'Jadwal Saya', href: route('doctor.schedule') },
                        { title: 'Rekam Medis', href: '#' }, // This would ideally go back to the current record
                        { title: 'Histori Kunjungan', href: '#' },
                    ]} 
                    className="mb-6"
                />

                <header className="mb-10">
                    <PageHeader 
                        title="Histori Kunjungan"
                        subtitle={`Seluruh histori kunjungan pasien ${patient.name} di klinik.`}
                    />
                </header>

                {/* Dashboard Stats section (Slim Style) */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Total Kunjungan Card */}
                    <div className="bg-white p-5 rounded-2xl border border-border/10 shadow-sm flex items-center gap-4 transition-all hover:border-primary/30">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary text-2xl">calendar_month</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Kunjungan</h3>
                            <div className="flex items-baseline gap-1.5 mt-1">
                                <span className="text-2xl font-bold text-on-surface">{totalVisits}</span>
                            </div>
                        </div>
                    </div>

                    {/* Vitals Summary Card Simulation */}
                    <div className="bg-white p-5 rounded-2xl border border-border/10 shadow-sm flex items-center gap-4 transition-all hover:border-primary/30">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary text-2xl">monitoring</span>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Status Terakhir</h3>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-bold uppercase">Stabil</span>
                                <span className="text-[10px] text-on-surface-variant/60 font-medium tracking-tight whitespace-nowrap">Diperiksa 12 Okt 2023</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Card */}
                    <div className="bg-gradient-to-r from-primary to-blue-500 p-5 rounded-2xl text-white flex items-center gap-4 transition-all shadow-lg shadow-primary/20">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-white text-2xl">person</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xs font-medium opacity-80 uppercase tracking-widest leading-none">Pasien</h3>
                            <span className="text-lg font-bold leading-tight mt-1 block truncate">{patient.name}</span>
                        </div>
                    </div>
                </section>

                {/* Appointment List */}
                <section className="grid grid-cols-1 gap-4">
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <div 
                                key={appointment.id}
                                className="group bg-white p-6 rounded-2xl flex flex-col md:flex-row md:items-center gap-8 transition-all relative overflow-hidden border border-border/10 hover:border-primary/30 shadow-sm"
                            >
                                {/* Doctor Info */}
                                <div className="flex items-center gap-6 min-w-[280px]">
                                    <Avatar className="w-16 h-16 rounded-xl border border-border/10 shadow-inner">
                                        <AvatarImage src={appointment.doctor.avatar || ''} alt={appointment.doctor.name} />
                                        <AvatarFallback className="bg-surface-container text-primary font-bold">
                                            {appointment.doctor.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-xl text-on-surface leading-tight">{appointment.doctor.name}</h3>
                                        <p className="text-sm text-primary font-semibold mt-1">{appointment.doctor.specialization}</p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-8 md:pl-8 md:border-l border-border/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-xl">schedule</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Waktu</span>
                                            <span className="text-sm font-bold text-on-surface mt-1">{appointment.appointment_date}, {appointment.start_time}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange/5 flex items-center justify-center text-orange">
                                            <span className="material-symbols-outlined text-xl">confirmation_number</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">ID Janji</span>
                                            <span className="text-sm font-bold text-on-surface mt-1">{appointment.queue_number}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={cn(
                                            "px-5 py-2 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-2",
                                            appointment.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-primary/5 text-primary"
                                        )}>
                                            <span className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                appointment.status === 'completed' ? "bg-emerald-500" : "bg-primary animate-pulse"
                                            )}></span>
                                            {appointment.status === 'completed' ? 'Selesai' : 'Aktif'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="md:ml-4 flex-shrink-0">
                                    <Link href={route('doctor.medical-record.show', appointment.id)}>
                                        <Button className="w-full md:w-auto px-8 py-6 rounded-xl bg-surface-container text-on-surface-variant font-bold text-sm hover:bg-primary hover:text-white transition-all group flex items-center justify-center gap-2 h-auto border-none shadow-none">
                                            <span>Detail</span>
                                            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">chevron_right</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-border/40">
                            <p className="text-on-surface-variant font-medium">Tidak ada histori kunjungan.</p>
                        </div>
                    )}
                </section>
            </main>
        </AppLayout>
    );
}
