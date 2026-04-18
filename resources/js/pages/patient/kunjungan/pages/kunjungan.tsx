import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface ClosestAppointment {
    date: string;
    time: string;
    doctor_name: string;
}

interface AppointmentItem {
    id: number;
    doctor_name: string;
    poli_name: string;
    raw_date: string;
    date_time: string;
    queue_number: string;
    status: string;
}

interface Props {
    appointments: AppointmentItem[];
    closestAppointment: ClosestAppointment | null;
    totalKunjungan: number;
}

export default function Kunjungan({ appointments, closestAppointment, totalKunjungan }: Props) {
    const [filterStatus, setFilterStatus] = useState<'booked' | 'completed'>('booked');
    const [filterDate, setFilterDate] = useState<string>('');

    const filteredAppointments = appointments?.filter(a => {
        const matchStatus = filterStatus === 'booked' ? a.status === 'booked' : a.status !== 'booked';
        const matchDate = filterDate ? a.raw_date === filterDate : true;
        return matchStatus && matchDate;
    }) || [];

    return (
        <AppLayout>
            <Head title="Kunjungan Anda" />
            
            <PageHeader 
                title="Kunjungan Anda"
                subtitle="Pantau jadwal konsultasi aktif dan tinjau kembali catatan medis dari kunjungan sebelumnya."
                button={{
                    label: "Tambah Kunjungan",
                    show: true,
                    href: route('patient.buat-kunjungan')
                }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-2 font-['Manrope']">
                {/* Total Kunjungan */}
                <div className="bg-surface border border-outline-variant/30 rounded-[20px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_today</span>
                        </div>
                        <span className="material-symbols-outlined text-primary text-[20px] font-bold" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-on-surface-variant/70 mb-2">Total Kunjungan (2026)</p>
                        <h2 className="text-[28px] font-extrabold text-on-surface leading-tight">{totalKunjungan}</h2>
                    </div>
                </div>

                {/* Jadwal Terdekat */}
                <div className="bg-[#4188F1] rounded-[20px] p-6 flex flex-col justify-between shadow-md text-white">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-2 py-1.5 rounded-full border border-white/20">
                            <div className="w-6 h-6 rounded-full bg-white/30 overflow-hidden shrink-0 flex justify-center items-center">
                                <span className="material-symbols-outlined text-white text-xs">face</span>
                            </div>
                            <div className="text-[10px] font-semibold pr-2">
                                <span className="font-normal text-white/80 text-[8px] block leading-none mb-0.5">Dengan</span>
                                {closestAppointment?.doctor_name || '-'}
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-white/80 mb-2">Jadwal Terdekat</p>
                        <h2 className="text-[22px] font-extrabold flex items-center gap-2 leading-tight">{closestAppointment?.date || 'Tidak Ada'}</h2>
                        <p className="text-xs font-medium text-white/80 mt-1">{closestAppointment?.time || '-'}</p>
                    </div>
                </div>

                {/* Vitals Summary */}
                <div className="bg-surface border border-outline-variant/30 rounded-[20px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>monitoring</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[#10B981] mt-1.5 mr-1 shadow-[0_0_0_4px_rgba(16,185,129,0.15)] hidden md:block"></div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-on-surface-variant/70 mb-3">Vitals Summary</p>
                        <div className="flex items-center gap-3">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[15px] font-extrabold text-on-surface">120/80</span>
                            </div>
                            <div className="flex items-baseline gap-1 bg-surface-container px-2.5 py-1 rounded-md">
                                <span className="text-[10px] font-bold text-on-surface-variant">72 BPM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter and Tab Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 font-['Manrope']">
                <div className="flex bg-surface-container/50 p-1 rounded-[14px] border border-outline-variant/30 text-sm font-medium w-full md:w-auto">
                    <button 
                        onClick={() => setFilterStatus('booked')}
                        className={`px-6 py-2 rounded-xl w-1/2 md:w-auto whitespace-nowrap transition-colors ${filterStatus === 'booked' ? 'bg-surface shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface font-medium'}`}>
                            Aktif
                    </button>
                    <button 
                        onClick={() => setFilterStatus('completed')}
                        className={`px-6 py-2 rounded-xl w-1/2 md:w-auto whitespace-nowrap transition-colors ${filterStatus === 'completed' ? 'bg-surface shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface font-medium'}`}>
                            Selesai
                    </button>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <label className="flex items-center gap-3 bg-surface-container/30 border border-outline-variant/30 px-3 py-2 rounded-xl text-xs font-semibold text-on-surface-variant cursor-pointer hover:bg-surface-container/50 transition-colors flex-1 md:flex-none justify-center">
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_today</span>
                        <input 
                            type="date" 
                            className="bg-transparent border-none p-0 text-xs focus:ring-0 text-on-surface-variant cursor-pointer outline-none"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </label>
                    <button 
                        onClick={() => setFilterDate('')}
                        className={`w-10 h-10 shrink-0 flex items-center justify-center border rounded-xl transition-colors ${filterDate ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface-container/30 border-outline-variant/30 text-on-surface-variant hover:bg-surface-container/50'}`}
                        title="Reset Filter"
                    >
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>{filterDate ? 'filter_alt_off' : 'filter_list'}</span>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4 font-['Manrope']">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((app) => (
                        <div key={app.id} className="bg-surface border border-outline-variant/30 rounded-[20px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 w-[280px]">
                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#E8F0FE] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#4188F1] text-[24px]">face</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-extrabold text-on-surface text-[15px]">{app.doctor_name}</h3>
                                    <p className="text-[11px] font-semibold text-[#4188F1] mt-0.5">{app.poli_name}</p>
                                </div>
                            </div>

                            <div className="flex items-center md:gap-14 flex-1 text-xs font-bold text-on-surface-variant justify-between md:justify-start w-full md:w-auto">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#4188F1] text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
                                    {app.date_time}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#FF9500] text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>local_activity</span>
                                    {app.queue_number}
                                </div>
                                <div className={`flex items-center gap-1.5 text-[9px] bg-transparent md:mx-6 tracking-wide font-extrabold ${app.status === 'booked' ? 'text-[#4188F1]' : 'text-[#34C759]'}`}>
                                    <div className={`w-1 h-1 rounded-full ${app.status === 'booked' ? 'bg-[#4188F1] animate-pulse' : 'bg-[#34C759]'}`}></div>
                                    {app.status === 'booked' ? 'AKTIF' : 'SELESAI'}
                                </div>
                            </div>

                            <div className="shrink-0 flex justify-end w-full md:w-auto mt-2 md:mt-0">
                                <button className="bg-surface-container/50 hover:bg-surface-container text-on-surface-variant font-bold text-sm px-5 py-2 rounded-xl flex items-center gap-1 transition-colors">
                                    Detail
                                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center text-on-surface-variant font-medium text-sm">
                        Belum ada data kunjungan.
                    </div>
                )}
            </div>

            <div className="mt-8 mb-4 flex justify-center">
               <button className="text-[11px] font-bold text-on-surface border border-outline-variant/60 hover:bg-surface-container/50 transition-all flex justify-center items-center py-2 px-4 rounded-lg bg-white/50 shadow-sm gap-1">
                   <span className="material-symbols-outlined text-[14px]">expand_more</span>
                   Tampilkan Lebih Banyak
               </button>
            </div>
        </AppLayout>
    );
}
