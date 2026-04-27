import { useMemo } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { format, parseISO, addDays, isToday } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface Patient {
    id: number;
    user: {
        name: string;
    };
}

interface Poli {
    name: string;
}

interface Appointment {
    id: number;
    queue_number: string;
    appointment_date: string;
    start_time: string;
    end_time: string;
    status: 'booked' | 'completed' | 'cancelled';
    patient: Patient;
    poli: Poli | null;
}

interface Props {
    todayAppointments: Appointment[];
    upcomingAppointments: Record<string, Appointment[]>;
    stats: {
        total_today: number;
        total_week: number;
        next_patient: { name: string; time_slot: string } | null;
    };
    currentWeekStart: string;
}

const DOCTOR_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const WEEKEND_INDICES = [5, 6];

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function formatWeekRange(startDate: Date): string {
    const end = addDays(startDate, 6);
    const startStr = format(startDate, 'd MMM', { locale: idLocale });
    const endStr = format(end, 'd MMM yyyy', { locale: idLocale });
    return `${startStr} - ${endStr}`;
}

export default function DoctorSchedule({
    todayAppointments,
    upcomingAppointments,
    stats,
    currentWeekStart,
}: Props) {
    const weekStartDate = parseISO(currentWeekStart);

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));
    }, [currentWeekStart]);

    const handlePreviousWeek = () => {
        const prevWeek = format(addDays(weekStartDate, -7), 'yyyy-MM-dd');
        router.get(route('doctor.schedule'), { week_start: prevWeek }, { preserveScroll: true });
    };

    const handleNextWeek = () => {
        const nextWeek = format(addDays(weekStartDate, 7), 'yyyy-MM-dd');
        router.get(route('doctor.schedule'), { week_start: nextWeek }, { preserveScroll: true });
    };

    const getAppointmentsForTimeSlot = (date: Date, time: string): Appointment[] => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const appointments = upcomingAppointments[dateStr] || [];
        return appointments.filter(apt => apt.start_time.startsWith(time));
    };

    return (
        <AppLayout>
            <Head title="Jadwal Kunjungan" />

            <main className="max-w-7xl mx-auto pb-12">
                {/* Page Header with Week Navigator */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-on-surface">
                            Jadwal Kunjungan
                        </h2>
                        <p className="text-on-surface-variant mt-1 text-base">
                            Jadwal kunjungan pasienmu dalam 2 minggu.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
                        <button
                            onClick={handlePreviousWeek}
                            className="p-1.5 hover:bg-white rounded-lg transition-all text-on-surface-variant"
                        >
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </button>
                        <span className="font-semibold text-xs px-2 text-on-surface-variant whitespace-nowrap">
                            {formatWeekRange(weekStartDate)}
                        </span>
                        <button
                            onClick={handleNextWeek}
                            className="p-1.5 hover:bg-white rounded-lg transition-all text-on-surface-variant"
                        >
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Pasien Card */}
                    <div className="bg-white p-3.5 rounded-xl border border-outline-variant/10 flex items-center gap-5 group hover:border-primary/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-2xl">group</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium text-on-surface-variant/70 leading-none">
                                Total Pasien
                            </p>
                            <p className="text-2xl font-semibold text-on-surface mt-1.5">
                                {stats.total_week}
                            </p>
                        </div>
                    </div>

                    {/* Next Patient Card */}
                    {stats.next_patient ? (
                        <div className="bg-primary p-3.5 rounded-xl flex items-center justify-between text-white group hover:translate-y-[-1px] transition-all shadow-lg shadow-primary/20">
                            <div className="flex items-center gap-5">
                                <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/30 flex-shrink-0 bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                                    {getInitials(stats.next_patient.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-medium text-white/70 leading-none">
                                        Pasien Selanjutnya
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <h3 className="text-lg font-semibold truncate leading-none">
                                            {stats.next_patient.name}
                                        </h3>
                                        <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded-md font-semibold border border-white/10 flex-shrink-0">
                                            {stats.next_patient.time_slot} WIB
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-white/50 group-hover:text-white transition-colors text-xl">
                                arrow_forward
                            </span>
                        </div>
                    ) : (
                        <div className="bg-primary p-3.5 rounded-xl border border-outline-variant/10 flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-gray-200/50 flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-2xl">person</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-medium text-on-surface-variant/70 leading-none">
                                    Pasien Selanjutnya
                                </p>
                                <p className="text-sm font-semibold text-on-surface-variant mt-1.5">
                                    Tidak ada
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Today's Patients Card */}
                    <div className="bg-white p-3.5 rounded-xl border border-outline-variant/10 flex items-center justify-between group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-2xl">calendar_month</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-medium text-on-surface-variant/70 leading-none">
                                    Pasien Hari Ini
                                </p>
                                <p className="text-2xl font-semibold text-on-surface mt-1.5">
                                    {stats.total_today}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-semibold text-green-600">Aktif</span>
                        </div>
                    </div>
                </div>

                {/* Weekly Calendar Grid - SELALU TAMPIL */}
                <div className="bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 overflow-hidden shadow-sm">
                    {/* Grid Header */}
                    <div
                        className="bg-surface-container-low/50 border-b border-outline-variant/10"
                        style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)' }}
                    >
                        <div className="p-6"></div>
                        {weekDays.map((date, idx) => (
                            <div
                                key={idx}
                                className={`p-6 text-center border-l border-outline-variant/10 relative ${
                                    isToday(date) ? 'bg-primary/5' : ''
                                }`}
                            >
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${
                                    isToday(date)
                                        ? 'text-primary'
                                        : WEEKEND_INDICES.includes(idx)
                                          ? 'text-error/60'
                                          : 'text-on-surface-variant/60'
                                }`}>
                                    {DAY_NAMES[idx]}
                                </p>
                                <p className={`text-xl font-extrabold mt-1 ${
                                    isToday(date)
                                        ? 'text-primary'
                                        : WEEKEND_INDICES.includes(idx)
                                          ? 'text-error/80'
                                          : ''
                                }`}>
                                    {format(date, 'd')}
                                </p>
                                {isToday(date) && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Grid Body */}
                    <div className="relative">
                        {DOCTOR_HOURS.map((time, timeIdx) => (
                            <div key={timeIdx}>
                                {time === '12:00' ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)' }}>
                                        <div className="p-4 text-xs font-bold text-on-surface-variant/40 border-b border-outline-variant/5 flex items-center justify-center">
                                            {time}
                                        </div>
                                        <div
                                            className="border-l border-b border-outline-variant/5 bg-surface-container-low/30 p-2 flex items-center justify-center"
                                            style={{ gridColumn: '2 / -1' }}
                                        >
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 italic">
                                                Istirahat Makan Siang
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)' }}>
                                        <div className="p-4 text-xs font-bold text-on-surface-variant/40 border-b border-outline-variant/5 flex items-center justify-center">
                                            {time}
                                        </div>
                                        {weekDays.map((date, dayIdx) => {
                                            const appointments = getAppointmentsForTimeSlot(date, time);
                                            const isNextPatient =
                                                appointments.length > 0 &&
                                                appointments[0].status === 'booked' &&
                                                isToday(date) &&
                                                appointments[0].start_time === stats.next_patient?.time_slot;

                                            return (
                                                <div
                                                    key={`${dayIdx}-${time}`}
                                                    className="border-l border-b border-outline-variant/5 p-2 min-h-[60px]"
                                                >
                                                    {appointments.length > 0 && (
                                                        <div className={`rounded-xl p-2 h-full flex flex-col justify-center ${
                                                            isNextPatient
                                                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                                : 'bg-surface-container-high/50 border-l-4 border-primary'
                                                        }`}>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                                                                    isNextPatient
                                                                        ? 'bg-white/20 text-white'
                                                                        : 'bg-primary/20 text-primary'
                                                                }`}>
                                                                    {getInitials(appointments[0].patient.user.name)}
                                                                </div>
                                                                <span className="text-[10px] font-bold truncate leading-tight">
                                                                    {appointments[0].patient.user.name.length > 12
                                                                        ? appointments[0].patient.user.name.substring(0, 12) + '...'
                                                                        : appointments[0].patient.user.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}