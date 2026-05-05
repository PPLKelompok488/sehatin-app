import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Appointment {
    id: number;
    date_short: string;
    time: string;
    queue_number: string;
    status: string;
    poli_name: string;
    doctor: {
        name: string;
        specialization: string;
        avatar: string | null;
    };
    has_record: boolean;
}

interface Patient {
    id: number;
    name: string;
    gender: string;
    age: number | null;
}

interface Stats {
    total_visits: number;
    upcoming_visit: {
        date: string;
        time: string;
        doctor: string;
        avatar: string | null;
    } | null;
    latest_vitals: {
        blood_pressure: string;
        heart_rate: string;
    } | null;
}

interface Filters {
    status: 'all' | 'booked' | 'completed';
    search: string;
    date_start: string;
    date_end: string;
}

interface Props {
    patient: Patient;
    appointments: {
        data: Appointment[];
        next_page_url: string | null;
    };
    stats: Stats;
    filters: Filters;
}

export default function MedicalHistoryList({ patient, appointments, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [dateStart, setDateStart] = useState(filters.date_start || '');
    const [dateEnd, setDateEnd] = useState(filters.date_end || '');
    const [localAppointments, setLocalAppointments] = useState(appointments.data);
    const [nextPageUrl, setNextPageUrl] = useState(appointments.next_page_url);

    useEffect(() => {
        setLocalAppointments(appointments.data);
        setNextPageUrl(appointments.next_page_url);
    }, [appointments.data]);

    const handleFilter = (status: string) => {
        router.get(route('doctor.medical-record.history', patient.id), 
            { status, search, date_start: dateStart, date_end: dateEnd }, 
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const submitSearch = () => {
        router.get(route('doctor.medical-record.history', patient.id), 
            { status: filters.status, search, date_start: dateStart, date_end: dateEnd }, 
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleLoadMore = () => {
        if (!nextPageUrl) return;

        router.get(nextPageUrl, {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['appointments'],
            onSuccess: (page: any) => {
                setLocalAppointments([...localAppointments, ...page.props.appointments.data]);
                setNextPageUrl(page.props.appointments.next_page_url);
            }
        });
    };

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
            <Head title={`Histori Kunjungan - ${patient.name}`} />

            <main className="max-w-7xl mx-auto pb-12 pt-8 px-6 flex flex-col gap-10">
                {/* Header Section */}
                <header className="space-y-6">
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-on-surface">Kunjungan Pasien</h1>
                            <p className="text-on-surface-variant font-medium mt-1">Seluruh histori kunjungan {patient.name} di klinik.</p>
                        </div>
                    </div>

                    {/* Dashboard Stats section (Slim Style) */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Total Kunjungan Card */}
                        <div className="bg-white p-5 rounded-xl border border-border/10 flex items-center gap-4 transition-all hover:border-primary/30 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-primary text-2xl">calendar_month</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-on-surface-variant">Total Kunjungan</h3>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-bold text-on-surface">{stats.total_visits}</span>
                                </div>
                            </div>
                        </div>

                        {/* Jadwal Terdekat Card */}
                        {stats.upcoming_visit ? (
                            <div className="bg-gradient-to-r from-primary to-blue-500 p-5 rounded-xl text-white flex items-center gap-4 transition-all shadow-lg shadow-primary/20">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-white text-2xl">schedule</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium opacity-80">Jadwal Terdekat</h3>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold leading-tight">{stats.upcoming_visit.date}</span>
                                        <span className="text-[10px] font-medium opacity-80 mt-0.5">{stats.upcoming_visit.time} WIB</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pl-4 border-l border-white/20">
                                    <Avatar className="w-8 h-8 rounded-full border border-white/30 flex-shrink-0">
                                        <AvatarImage src={stats.upcoming_visit.avatar || ''} />
                                        <AvatarFallback className="text-[10px] bg-white/10 text-white">
                                            {getInitials(stats.upcoming_visit.doctor)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] opacity-80">Dengan</span>
                                        <span className="text-sm font-semibold truncate max-w-[80px]">{stats.upcoming_visit.doctor.split(' ')[0]}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-surface-container/50 p-5 rounded-xl flex items-center gap-4 border border-border/10 opacity-60">
                                <div className="w-12 h-12 rounded-xl bg-on-surface/5 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-on-surface-variant text-2xl">event_busy</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-on-surface-variant">Jadwal Terdekat</h3>
                                    <p className="text-sm font-bold text-on-surface">Tidak ada jadwal</p>
                                </div>
                            </div>
                        )}

                        {/* Vitals Summary Card */}
                        <div className="bg-white p-5 rounded-xl border border-border/10 flex items-center gap-4 transition-all hover:border-primary/30 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-primary text-2xl">monitoring</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h3 className="text-sm font-semibold text-on-surface-variant mb-1">Vitals Terakhir</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 px-2 py-0.5 bg-surface-container rounded-md text-[9px] font-bold text-on-surface-variant">
                                        {stats.latest_vitals?.blood_pressure || '-'}
                                    </div>
                                    <div className="flex-shrink-0 px-2 py-0.5 bg-surface-container rounded-md text-[9px] font-bold text-on-surface-variant">
                                        {stats.latest_vitals?.heart_rate ? `${stats.latest_vitals.heart_rate} BPM` : '-'}
                                    </div>
                                </div>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        </div>
                    </section>

                    {/* Filters & Tabs Container */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-surface-container-low rounded-2xl">
                        {/* Custom Tab UI */}
                        <div className="flex bg-surface-container p-1 rounded-xl w-full sm:w-auto">
                            <button 
                                onClick={() => handleFilter('all')}
                                className={cn(
                                    "flex-1 sm:flex-none px-10 py-3 rounded-lg text-sm font-semibold transition-all",
                                    filters.status === 'all' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
                                )}
                            >
                                Semua
                            </button>
                            <button 
                                onClick={() => handleFilter('booked')}
                                className={cn(
                                    "flex-1 sm:flex-none px-10 py-3 rounded-lg text-sm font-semibold transition-all",
                                    filters.status === 'booked' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
                                )}
                            >
                                Aktif
                            </button>
                            <button 
                                onClick={() => handleFilter('completed')}
                                className={cn(
                                    "flex-1 sm:flex-none px-10 py-3 rounded-lg text-sm font-semibold transition-all",
                                    filters.status === 'completed' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
                                )}
                            >
                                Selesai
                            </button>
                        </div>
                        {/* Search & Date Filter Container */}
                        <div className="flex flex-col md:flex-row items-center gap-3 w-full sm:w-auto">
                            {/* Search Input */}
                            <div className="relative group w-full md:w-64">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-on-surface-variant/40 text-xl">search</span>
                                </div>
                                <input 
                                    className="block w-full pl-12 pr-4 py-3.5 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface text-sm placeholder:text-on-surface-variant/40 transition-all duration-200 font-medium" 
                                    placeholder="Cari dokter/poli..." 
                                    type="text"
                                    value={search}
                                    onChange={handleSearch}
                                    onKeyPress={(e) => e.key === 'Enter' && submitSearch()}
                                />
                            </div>

                            {/* Date Inputs */}
                            <div className="flex items-center bg-surface-container rounded-xl px-4 py-1 gap-2 w-full md:w-auto">
                                <input 
                                    className="block w-28 py-2.5 bg-transparent border-none focus:ring-0 text-on-surface text-[10px] font-bold uppercase tracking-wider" 
                                    type="date"
                                    value={dateStart}
                                    onChange={(e) => setDateStart(e.target.value)}
                                />
                                <span className="text-on-surface-variant/40 text-[10px] font-bold">TO</span>
                                <input 
                                    className="block w-28 py-2.5 bg-transparent border-none focus:ring-0 text-on-surface text-[10px] font-bold uppercase tracking-wider" 
                                    type="date"
                                    value={dateEnd}
                                    onChange={(e) => setDateEnd(e.target.value)}
                                />
                            </div>

                            <button 
                                onClick={submitSearch}
                                className="p-3.5 bg-surface-container rounded-xl text-on-surface-variant hover:text-primary hover:bg-white transition-all shadow-sm active:scale-95"
                            >
                                <span className="material-symbols-outlined">filter_list</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Appointment List */}
                <section className="grid grid-cols-1 gap-6">
                    {localAppointments.length > 0 ? (
                        localAppointments.map((apt) => (
                            <div key={apt.id} className="group bg-white p-6 rounded-xl flex flex-col md:flex-row md:items-center gap-8 transition-all relative overflow-hidden border border-border/10 hover:border-primary/30 shadow-sm">
                                {/* Doctor Avatar & Basic Info */}
                                <div className="flex items-center gap-6 min-w-[280px]">
                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface-container border border-border/10">
                                        <Avatar className="w-full h-full rounded-none">
                                            <AvatarImage src={apt.doctor.avatar || ''} className="object-cover" />
                                            <AvatarFallback className="rounded-none bg-primary/5 text-primary text-xl font-bold">
                                                {getInitials(apt.doctor.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-on-surface">{apt.doctor.name}</h3>
                                        <p className="text-sm text-primary font-semibold">{apt.doctor.specialization}</p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-8 md:pl-8 md:border-l border-border/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-xl">schedule</span>
                                        </div>
                                        <span className="text-sm font-semibold text-on-surface">{apt.date_short}, {apt.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange/5 flex items-center justify-center text-orange">
                                            <span className="material-symbols-outlined text-xl">confirmation_number</span>
                                        </div>
                                        <span className="text-sm font-semibold text-on-surface">{apt.queue_number}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={cn(
                                            "px-5 py-2 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-2",
                                            apt.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-primary/5 text-primary"
                                        )}>
                                            <span className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                apt.status === 'completed' ? "bg-emerald-500" : "bg-primary animate-pulse"
                                            )}></span>
                                            {apt.status === 'completed' ? 'Selesai' : 'Aktif'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="md:ml-4">
                                    <Link href={route('doctor.medical-record.show', apt.id)} className="w-full md:w-auto">
                                        <button className="w-full md:w-auto px-10 py-4 rounded-xl bg-surface-container text-on-surface-variant font-bold text-sm hover:bg-primary hover:text-white transition-all group flex items-center justify-center gap-2">
                                            <span>Detail</span>
                                            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">chevron_right</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-surface-container/20 rounded-3xl p-20 text-center border-2 border-dashed border-border/30">
                            <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4">folder_open</span>
                            <p className="text-on-surface-variant font-medium">Belum ada riwayat kunjungan yang sesuai.</p>
                        </div>
                    )}

                    {/* Load More functionality */}
                    {nextPageUrl && (
                        <div className="flex justify-center py-8">
                            <button 
                                onClick={handleLoadMore}
                                className="text-sm font-bold text-on-surface-variant/40 flex items-center gap-2 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">expand_more</span>
                                Tampilkan Lebih Banyak
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </AppLayout>
    );
}
