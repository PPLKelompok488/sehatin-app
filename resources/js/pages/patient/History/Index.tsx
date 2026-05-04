import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface HistoryItem {
    id: number;
    date: string;       // Contoh: "12"
    month: string;      // Contoh: "Apr"
    full_date: string;
    time: string;       // Contoh: "14:30"
    doctor_name: string;
    poli_name: string;
    complaint: string;  // Subjective
    diagnosis: string;  // Assessment
    treatment: string;  // Plan
}

interface Props {
    history: HistoryItem[];
}

export default function Index({ history }: Props) {
    return (
        <AppLayout>
            <Head title="Riwayat Kunjungan" />

            <main className="min-h-screen bg-background pb-24 md:pb-8 font-['Manrope']">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Header - Sesuai HTML lo */}
                    <div className="flex flex-col gap-1 mb-10">
                        <h1 className="text-2xl font-extrabold text-on-surface tracking-tight leading-tight">
                            Riwayat Kunjungan
                        </h1>
                        <p className="text-sm font-medium text-on-surface-variant">
                            Pantau riwayat kesehatan dan konsultasi Anda secara berkala
                        </p>
                    </div>

                    {/* Section Timeline */}
                    <section className="relative space-y-0">
                        {history && history.length > 0 ? (
                            history.map((item, index) => (
                                <div key={item.id} className="relative pl-10 pb-12 group last:pb-0">
                                    
                                    {/* Garis Vertikal Timeline */}
                                    {index !== history.length - 1 && (
                                        <div className="absolute left-[5px] top-4 bottom-0 w-[2px] bg-outline-variant/30 group-hover:bg-primary/20 transition-colors duration-500" />
                                    )}

                                    {/* Dot Indicator */}
                                    <div className="absolute left-0 top-3 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10 group-hover:scale-125 transition-transform duration-300 z-10" />

                                    <div className="flex flex-col md:flex-row gap-6">
                                        
                                        {/* Tanggal di Samping (Desktop) */}
                                        <div className="w-16 pt-1 flex flex-col items-start md:items-center text-on-surface-variant/40 shrink-0">
                                            <span className="text-2xl font-black leading-none">{item.date}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{item.month}</span>
                                        </div>

                                        {/* Main Card */}
                                        <div className="flex-1 bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group/card relative overflow-hidden">
                                            
                                            {/* Status Badge & Time */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-outline-variant/20">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover/card:scale-110 transition-transform duration-500">
                                                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                                                            medical_services
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-on-surface text-base leading-tight">
                                                            Poli {item.poli_name}
                                                        </h3>
                                                        <p className="text-xs font-semibold text-on-surface-variant/70">
                                                            dr. {item.doctor_name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/20 shadow-inner">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
                                                        Selesai • {item.time} WIB
                                                    </span>
                                                </div>
                                            </div>

                                            {/* SOAP Details - Sesuai Data Riwayat */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-widest flex items-center gap-2">
                                                        <span className="w-1 h-1 rounded-full bg-primary/40" />
                                                        Keluhan
                                                    </p>
                                                    <p className="text-sm font-semibold text-on-surface leading-relaxed line-clamp-3">
                                                        {item.complaint || '-'}
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-widest flex items-center gap-2">
                                                        <span className="w-1 h-1 rounded-full bg-secondary/40" />
                                                        Diagnosa
                                                    </p>
                                                    <p className="text-sm font-semibold text-on-surface leading-relaxed line-clamp-3">
                                                        {item.diagnosis || '-'}
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-widest flex items-center gap-2">
                                                        <span className="w-1 h-1 rounded-full bg-tertiary/40" />
                                                        Tindakan
                                                    </p>
                                                    <p className="text-sm font-semibold text-on-surface leading-relaxed line-clamp-3">
                                                        {item.treatment || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Empty State - Persis kaya di screenshot lo */
                            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface-container/20 rounded-[40px] border-2 border-dashed border-outline-variant/30 mt-8">
                                <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-6 shadow-inner">
                                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/20">
                                        history_toggle_off
                                    </span>
                                </div>
                                <h3 className="text-xl font-extrabold text-on-surface mb-2">Belum ada riwayat</h3>
                                <p className="text-sm font-medium text-on-surface-variant max-w-xs mx-auto mb-8 leading-relaxed">
                                    Anda belum memiliki catatan kunjungan medis. Riwayat berobat Anda akan muncul di sini.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </AppLayout>
    );
}
