import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface MedicalRecord {
    subjective: string | null;
    objective: string | null;
    assessment: string | null;
    plan: string | null;
    blood_pressure: string | null;
    heart_rate: string | null;
    temperature: string | null;
    weight: string | null;
    blood_sugar: string | null;
    medicine: string | null;
}

interface AppointmentDetail {
    id: number;
    doctor_name: string;
    poli_name: string;
    date: string;
    time: string;
    queue_number: string;
    status: string;
    cancel_reason: string | null;
    cancelled_by: string | null;
    medical_record: MedicalRecord | null;
}

interface Props {
    appointment: AppointmentDetail;
}

export default function DetailKunjungan({ appointment }: Props) {
    const { medical_record } = appointment;

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'completed':
                return { label: 'SELESAI', dotClass: 'bg-success', textClass: 'text-success', bgClass: 'bg-success/10' };
            case 'cancelled':
                return { label: 'DIBATALKAN', dotClass: 'bg-destructive', textClass: 'text-destructive', bgClass: 'bg-destructive/10' };
            default:
                return { label: 'AKTIF', dotClass: 'bg-primary animate-pulse', textClass: 'text-primary', bgClass: 'bg-primary/10' };
        }
    };

    const statusConfig = getStatusConfig(appointment.status);

    const vitalSigns = [
        { label: 'Tekanan Darah', value: medical_record?.blood_pressure, unit: '', icon: 'vital_signs' },
        { label: 'Detak Jantung', value: medical_record?.heart_rate, unit: ' bpm', icon: 'cardiology' },
        { label: 'Suhu Tubuh', value: medical_record?.temperature, unit: ' °C', icon: 'thermostat' },
        { label: 'Berat Badan', value: medical_record?.weight, unit: ' kg', icon: 'monitor_weight' },
        { label: 'Gula Darah', value: medical_record?.blood_sugar, unit: ' mg/dL', icon: 'water_drop' },
    ];

    const soapItems = [
        { key: 'S', title: 'Subjektif', subtitle: 'Keluhan pasien', value: medical_record?.subjective, icon: 'record_voice_over' },
        { key: 'O', title: 'Objektif', subtitle: 'Hasil pemeriksaan', value: medical_record?.objective, icon: 'stethoscope' },
        { key: 'A', title: 'Assessment', subtitle: 'Diagnosis dokter', value: medical_record?.assessment, icon: 'diagnosis' },
        { key: 'P', title: 'Plan', subtitle: 'Rencana tindak lanjut', value: medical_record?.plan, icon: 'clinical_notes' },
    ];

    return (
        <AppLayout>
            <Head title="Detail Kunjungan" />

            {/* Back Button */}
            <div className="mb-6">
                <Link
                    href={route('patient.kunjungan')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Kembali ke Riwayat Kunjungan
                </Link>
            </div>

            {/* Header Card: Doctor Info & Appointment Meta */}
            <div className="bg-surface border border-outline-variant/30 rounded-[20px] p-6 mb-6 shadow-sm font-['Manrope']">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[28px]">face</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-on-surface">{appointment.doctor_name}</h2>
                            <p className="text-sm font-semibold text-primary mt-0.5">{appointment.poli_name}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-5 text-sm">
                        <div className="flex items-center gap-2 text-on-surface-variant font-semibold">
                            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
                            {appointment.date}, {appointment.time}
                        </div>
                        <div className="flex items-center gap-2 text-on-surface-variant font-semibold">
                            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>local_activity</span>
                            {appointment.queue_number}
                        </div>
                        <div className={`flex items-center gap-1.5 text-[10px] tracking-wider font-extrabold px-3 py-1.5 rounded-full ${statusConfig.bgClass} ${statusConfig.textClass}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`}></div>
                            {statusConfig.label}
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Record Content */}
            {medical_record ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-['Manrope']">
                    {/* Left Column: SOAP & Prescription */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* SOAP Section */}
                        <div>
                            <h3 className="text-lg font-extrabold text-on-surface mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[22px]">medical_information</span>
                                Temuan Klinis (SOAP)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {soapItems.map((item) => (
                                    <div
                                        key={item.key}
                                        className="bg-surface border border-outline-variant/30 rounded-[16px] p-5 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-[18px]">{item.icon}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-on-surface text-sm">{item.title}</h4>
                                                <p className="text-[10px] text-on-surface-variant font-medium">{item.subtitle}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">
                                            {item.value || 'Tidak ada data.'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Prescription Section */}
                        <div>
                            <h3 className="text-lg font-extrabold text-on-surface mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[22px]">medication</span>
                                Resep Obat & Dosis
                            </h3>
                            <div className="bg-surface border border-outline-variant/30 rounded-[16px] p-5 shadow-sm">
                                <p className="text-sm text-on-surface-variant whitespace-pre-line leading-relaxed">
                                    {medical_record.medicine || 'Tidak ada resep obat.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Vital Signs */}
                    <div>
                        <h3 className="text-lg font-extrabold text-on-surface mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[22px]">monitoring</span>
                            Tanda Vital
                        </h3>
                        <div className="space-y-3">
                            {vitalSigns.map((vital) => (
                                <div
                                    key={vital.label}
                                    className="bg-surface border border-outline-variant/30 rounded-[16px] p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary text-[20px]">{vital.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-semibold text-on-surface-variant">{vital.label}</p>
                                        <p className="text-lg font-extrabold text-on-surface leading-tight">
                                            {vital.value ? `${vital.value}${vital.unit}` : '-'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : appointment.status === 'cancelled' ? (
                <div className="bg-surface border border-destructive/20 rounded-[20px] p-8 font-['Manrope']">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-destructive text-[24px]">event_busy</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-on-surface">Kunjungan Dibatalkan</h3>
                            <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                                Dibatalkan oleh {appointment.cancelled_by === 'patient' ? 'Pasien' : (appointment.cancelled_by === 'doctor' ? 'Dokter' : 'Admin')}
                            </p>
                        </div>
                    </div>
                    {appointment.cancel_reason && (
                        <div className="bg-destructive/5 border border-destructive/10 rounded-xl p-4">
                            <p className="text-xs font-bold text-on-surface-variant mb-1.5">Alasan Pembatalan</p>
                            <p className="text-sm text-on-surface leading-relaxed">{appointment.cancel_reason}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-surface border border-outline-variant/30 rounded-[20px] p-8 text-center font-['Manrope']">
                    <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-warning text-[32px]">pending</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-on-surface mb-2">Rekam Medis Belum Tersedia</h3>
                    <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                        Rekam medis untuk kunjungan ini belum diisi oleh dokter. Silakan kembali lagi nanti setelah pemeriksaan selesai.
                    </p>
                </div>
            )}

            {/* Footer Action */}
            <div className="mt-8">
                <Button variant="secondary" size="sm" asChild>
                    <Link href={route('patient.kunjungan')}>
                        <ArrowLeft className="size-4" />
                        Kembali ke Riwayat
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
}
