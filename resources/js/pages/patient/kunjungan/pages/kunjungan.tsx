import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
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
    const [filterStatus, setFilterStatus] = useState<'booked' | 'completed' | 'cancelled'>('booked');
    const [filterDate, setFilterDate] = useState<string>('');

    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedCancelId, setSelectedCancelId] = useState<number | null>(null);

    const { data: cancelData, setData: setCancelData, post: postCancel, processing: cancelProcessing, reset: resetCancel } = useForm({
        cancel_reason: ''
    });

    const openCancelModal = (id: number) => {
        setSelectedCancelId(id);
        setCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        setCancelModalOpen(false);
        setSelectedCancelId(null);
        resetCancel();
    };

    const confirmCancel = () => {
        if (!selectedCancelId || !cancelData.cancel_reason.trim()) return;
        postCancel(route('patient.kunjungan.cancel', { id: selectedCancelId }), {
            onSuccess: () => closeCancelModal(),
            preserveScroll: true
        });
    };

    const filteredAppointments = appointments?.filter(a => {
        const matchStatus = a.status === filterStatus;
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
                <div className="bg-primary rounded-[20px] p-6 flex flex-col justify-between shadow-md text-on-primary">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-2 py-1.5 rounded-full border border-white/20">
                            <div className="w-6 h-6 rounded-full bg-white/30 overflow-hidden shrink-0 flex justify-center items-center">
                                <span className="material-symbols-outlined text-on-primary text-xs">face</span>
                            </div>
                            <div className="text-[10px] font-semibold pr-2">
                                <span className="font-normal text-on-primary/80 text-[8px] block leading-none mb-0.5">Dengan</span>
                                {closestAppointment?.doctor_name || '-'}
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-on-primary/80 mb-2">Jadwal Terdekat</p>
                        <h2 className="text-[22px] font-extrabold flex items-center gap-2 leading-tight">{closestAppointment?.date || 'Tidak Ada'}</h2>
                        <p className="text-xs font-medium text-on-primary/80 mt-1">{closestAppointment?.time || '-'}</p>
                    </div>
                </div>

                {/* Vitals Summary */}
                <div className="bg-surface border border-outline-variant/30 rounded-[20px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>monitoring</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-success mt-1.5 mr-1 shadow-[0_0_0_4px_rgba(16,185,129,0.15)] hidden md:block"></div>
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
                        className={`px-4 py-2 rounded-xl w-1/3 md:w-auto whitespace-nowrap transition-colors ${filterStatus === 'booked' ? 'bg-surface shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface font-medium'}`}>
                            Aktif
                    </button>
                    <button 
                        onClick={() => setFilterStatus('completed')}
                        className={`px-4 py-2 rounded-xl w-1/3 md:w-auto whitespace-nowrap transition-colors ${filterStatus === 'completed' ? 'bg-surface shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface font-medium'}`}>
                            Selesai
                    </button>
                    <button 
                        onClick={() => setFilterStatus('cancelled')}
                        className={`px-4 py-2 rounded-xl w-1/3 md:w-auto whitespace-nowrap transition-colors ${filterStatus === 'cancelled' ? 'bg-surface shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface font-medium'}`}>
                            Batal
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
                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-[24px]">face</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-extrabold text-on-surface text-[15px]">{app.doctor_name}</h3>
                                    <p className="text-[11px] font-semibold text-primary mt-0.5">{app.poli_name}</p>
                                </div>
                            </div>

                            <div className="flex items-center md:gap-14 flex-1 text-xs font-bold text-on-surface-variant justify-between md:justify-start w-full md:w-auto">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
                                    {app.date_time}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-warning text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>local_activity</span>
                                    {app.queue_number}
                                </div>
                                <div className={`flex items-center gap-1.5 text-[9px] bg-transparent md:mx-6 tracking-wide font-extrabold ${app.status === 'booked' ? 'text-primary' : (app.status === 'completed' ? 'text-success' : 'text-destructive')}`}>
                                    <div className={`w-1 h-1 rounded-full ${app.status === 'booked' ? 'bg-primary animate-pulse' : (app.status === 'completed' ? 'bg-success' : 'bg-destructive')}`}></div>
                                    {app.status === 'booked' ? 'AKTIF' : (app.status === 'completed' ? 'SELESAI' : 'DIBATALKAN')}
                                </div>
                            </div>

                            <div className="shrink-0 flex justify-end w-full md:w-auto mt-4 md:mt-0 gap-3">
                                {app.status === 'booked' && (
                                    <button 
                                        onClick={() => openCancelModal(app.id)}
                                        className="bg-transparent border border-destructive/50 hover:bg-destructive/10 text-destructive font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-1 transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">cancel</span>
                                        Batalkan kunjungan
                                    </button>
                                )}
                                <Link 
                                    href={route('patient.kunjungan.show', { appointment: app.id })}
                                    className="bg-surface-container/50 hover:bg-surface-container text-on-surface-variant font-bold text-sm px-5 py-2 rounded-xl flex items-center gap-1 transition-colors"
                                >
                                    Detail
                                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                </Link>
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

            {/* Cancel Modal */}
            {cancelModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-['Manrope'] overflow-y-auto">
                    <div 
                        className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-6 pt-6 pb-4 flex justify-between items-center border-b border-border/40">
                            <h3 className="text-xl font-extrabold text-foreground">Batalkan Kunjungan</h3>
                            <button 
                                onClick={closeCancelModal}
                                className="w-8 h-8 rounded-full bg-surface-container/50 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <label className="block text-sm font-bold text-on-surface-variant mb-2">Alasan Pembatalan</label>
                            <textarea
                                className="w-full bg-surface-container/30 border border-outline-variant/40 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[120px] resize-none outline-none"
                                placeholder="Berikan alasan pembatalan Anda..."
                                value={cancelData.cancel_reason}
                                onChange={e => setCancelData('cancel_reason', e.target.value)}
                            ></textarea>
                            
                            <div className="mt-8 flex flex-col gap-3">
                                <button 
                                    onClick={confirmCancel}
                                    disabled={cancelProcessing || !cancelData.cancel_reason.trim()}
                                    className="w-full bg-destructive text-destructive-foreground border-none py-3.5 rounded-xl font-bold text-[15px] shadow-sm hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    {cancelProcessing ? 'Memproses...' : 'Konfirmasi Pembatalan'}
                                </button>
                                <button 
                                    onClick={closeCancelModal}
                                    disabled={cancelProcessing}
                                    className="w-full bg-surface-container/50 hover:bg-surface-container text-on-surface-variant border-none py-3.5 rounded-xl font-bold text-[15px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    Kembali
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
