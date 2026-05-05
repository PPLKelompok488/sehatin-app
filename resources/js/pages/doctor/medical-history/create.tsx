import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface Appointment {
    id: number;
    queue_number: string;
    appointment_date: string;
    start_time: string;
}

interface Patient {
    id: number;
    name: string;
    gender: string;
    age: number | null;
}

interface Doctor {
    name: string;
    specialization: string;
}

interface Props {
    appointment: Appointment;
    patient: Patient;
    doctor: Doctor;
}

export default function MedicalHistoryCreate({ appointment, patient, doctor }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
        blood_pressure: '',
        heart_rate: '',
        temperature: '',
        weight: '',
        blood_sugar: '',
        medicine: 'R/\n• ',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('doctor.medical-record.store', appointment.id));
    };

    const breadcrumbItems = [
        { title: 'Jadwal Saya', href: route('doctor.schedule') },
        { title: 'Ruang Pemeriksaan', href: '#' },
    ];

    return (
        <AppLayout>
            <Head title={`Pemeriksaan Pasien - ${patient.name}`} />

            <main className="max-w-7xl mx-auto pt-8 px-6 pb-12">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <Breadcrumbs breadcrumbs={breadcrumbItems} className="mb-2" />
                        <h2 className="text-3xl font-bold text-on-surface font-headline">Rekam Medis Pasien</h2>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={handleSubmit} 
                            disabled={processing}
                            className="px-8 py-6 rounded-2xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all h-auto"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Rekam Medis'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Left Column: Patient Info & Vitals */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                        {/* Patient Summary Card */}
                        <section className="bg-white p-6 rounded-2xl border border-border/10 shadow-sm flex flex-col gap-6 transition-all hover:border-primary/30">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16 rounded-xl shadow-inner border border-border/10">
                                    <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                                        {patient.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold text-on-surface">{patient.name}</h3>
                                    <p className="text-sm font-semibold text-on-surface-variant">
                                        {patient.gender}, {patient.age ? `${patient.age} Tahun` : '-'}
                                    </p>
                                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/5 rounded-full mt-1 inline-block uppercase tracking-wider">
                                        ID: {appointment.queue_number}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-surface-container p-4 rounded-xl border border-border/5">
                                    <p className="text-[10px] font-bold text-on-surface-variant/60 mb-1 uppercase tracking-widest">Kunjungan Terakhir</p>
                                    <p className="text-sm font-bold text-on-surface">Belum ada riwayat sebelumnya</p>
                                </div>
                                <Link href={route('doctor.medical-record.history', patient.id)} className="w-full">
                                    <Button variant="outline" className="w-full py-6 rounded-2xl border-primary/20 text-primary font-bold text-sm hover:bg-primary/5 transition-all flex items-center justify-center gap-2 h-auto">
                                        <span className="material-symbols-outlined text-lg">history</span>
                                        Histori Kunjungan
                                    </Button>
                                </Link>
                            </div>
                        </section>

                        {/* Vital Signs Card */}
                        <section className="bg-white p-6 rounded-2xl border border-border/10 shadow-sm">
                            <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-on-surface">
                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>ecg</span>
                                Tanda-Tanda Vital
                            </h4>
                            <div className="grid grid-cols-1 gap-5">
                                <VitalInput 
                                    label="Tekanan Darah (mmHg)" 
                                    icon="blood_pressure" 
                                    placeholder="120/80" 
                                    value={data.blood_pressure}
                                    onChange={(v) => setData('blood_pressure', v)}
                                    error={errors.blood_pressure}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <VitalInput 
                                        label="Detak Jantung (bpm)" 
                                        icon="favorite" 
                                        placeholder="72" 
                                        type="number"
                                        value={data.heart_rate}
                                        onChange={(v) => setData('heart_rate', v)}
                                        error={errors.heart_rate}
                                    />
                                    <VitalInput 
                                        label="Suhu (°C)" 
                                        icon="thermostat" 
                                        placeholder="36.5" 
                                        value={data.temperature}
                                        onChange={(v) => setData('temperature', v)}
                                        error={errors.temperature}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <VitalInput 
                                        label="Berat Badan (kg)" 
                                        icon="weight" 
                                        placeholder="70" 
                                        type="number"
                                        value={data.weight}
                                        onChange={(v) => setData('weight', v)}
                                        error={errors.weight}
                                    />
                                    <VitalInput 
                                        label="Gula Darah (mg/dL)" 
                                        icon="water_drop" 
                                        placeholder="95" 
                                        type="number"
                                        value={data.blood_sugar}
                                        onChange={(v) => setData('blood_sugar', v)}
                                        error={errors.blood_sugar}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: SOAP Form & Prescription */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Clinical Findings (SOAP) */}
                        <section className="bg-white p-6 rounded-2xl border border-border/10 shadow-sm transition-all hover:border-primary/20">
                            <h4 className="text-xl font-bold mb-8 flex items-center gap-3 text-on-surface">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">description</span>
                                </div>
                                Temuan Klinis (SOAP)
                            </h4>
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SoapField 
                                        letter="S" 
                                        title="Subjektif" 
                                        placeholder="Masukkan keluhan pasien..." 
                                        color="bg-[#E0F2FE] text-[#0284C7]" 
                                        value={data.subjective}
                                        onChange={(v) => setData('subjective', v)}
                                        error={errors.subjective}
                                    />
                                    <SoapField 
                                        letter="O" 
                                        title="Objektif" 
                                        placeholder="Masukkan hasil pemeriksaan fisik..." 
                                        color="bg-[#DCFCE7] text-[#166534]" 
                                        value={data.objective}
                                        onChange={(v) => setData('objective', v)}
                                        error={errors.objective}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#FEF3C7] text-[#92400E] font-bold">A</span>
                                        <Label className="font-bold text-on-surface">Assessment (Diagnosis)</Label>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-outline-variant text-xl group-focus-within:text-primary transition-colors">clinical_notes</span>
                                        </div>
                                        <Input 
                                            className="block w-full pl-11 pr-4 py-6 bg-surface-container border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-bold placeholder:font-medium placeholder:text-on-surface-variant/40 transition-all h-auto" 
                                            placeholder="Masukkan kode ICD-10 atau diagnosis..." 
                                            value={data.assessment}
                                            onChange={(e) => setData('assessment', e.target.value)}
                                        />
                                    </div>
                                    {errors.assessment && <p className="text-xs text-destructive font-semibold ml-1">{errors.assessment}</p>}
                                </div>
                                <SoapField 
                                    letter="P" 
                                    title="Rencana & Rekomendasi" 
                                    placeholder="Masukkan rencana tindakan atau edukasi..." 
                                    color="bg-[#F5F3FF] text-[#6D28D9]" 
                                    value={data.plan}
                                    onChange={(v) => setData('plan', v)}
                                    error={errors.plan}
                                />
                            </div>
                        </section>

                        {/* Prescription Section */}
                        <section className="bg-white rounded-2xl border border-border/10 shadow-sm overflow-hidden transition-all hover:border-primary/20">
                            <div className="p-6 pb-4">
                                <h4 className="text-lg font-bold flex items-center gap-2 text-on-surface">
                                    <span className="material-symbols-outlined text-primary">prescriptions</span>
                                    Resep & Obat-Obatan
                                </h4>
                            </div>
                            <div className="px-6 pb-6">
                                <div className="flex items-center gap-1 bg-surface-container p-2 rounded-t-2xl border-b border-border/5">
                                    <ToolbarButton icon="format_bold" />
                                    <ToolbarButton icon="format_italic" />
                                    <div className="w-px h-6 bg-outline-variant/20 mx-1"></div>
                                    <ToolbarButton icon="format_list_bulleted" />
                                    <Button variant="outline" size="sm" className="ml-auto px-4 bg-white rounded-lg text-xs font-bold text-primary shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">list_alt</span>
                                        Gunakan Template
                                    </Button>
                                </div>
                                <Textarea 
                                    className="w-full bg-surface-container border-none rounded-b-2xl rounded-t-none px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-body leading-relaxed text-on-surface font-bold placeholder:font-medium placeholder:text-on-surface-variant/30 min-h-[200px]" 
                                    placeholder="Masukkan resep obat..." 
                                    value={data.medicine}
                                    onChange={(e) => setData('medicine', e.target.value)}
                                />
                                {errors.medicine && <p className="text-xs text-destructive font-semibold mt-2 ml-1">{errors.medicine}</p>}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}

function VitalInput({ label, icon, placeholder, type = 'text', value, onChange, error }: { label: string; icon: string; placeholder: string; type?: string; value: string; onChange: (v: string) => void; error?: string }) {
    return (
        <div className="space-y-2">
            <Label className="text-[10px] font-bold text-on-surface-variant/60 ml-1 uppercase tracking-wider">{label}</Label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline-variant text-xl group-focus-within:text-primary transition-colors">{icon}</span>
                </div>
                <Input 
                    type={type}
                    className="block w-full pl-11 pr-4 py-6 bg-surface-container border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-sm text-on-surface font-bold placeholder:font-medium placeholder:text-on-surface-variant/40 transition-all h-auto" 
                    placeholder={placeholder} 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
            {error && <p className="text-[10px] text-destructive font-semibold ml-1">{error}</p>}
        </div>
    );
}

function SoapField({ letter, title, placeholder, color, value, onChange, error }: { letter: string; title: string; placeholder: string; color: string; value: string; onChange: (v: string) => void; error?: string }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <span className={cn("w-10 h-10 flex items-center justify-center rounded-xl font-bold", color)}>{letter}</span>
                <Label className="font-bold text-on-surface">{title}</Label>
            </div>
            <Textarea 
                className="w-full bg-surface-container border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-body leading-relaxed text-on-surface font-bold placeholder:font-medium placeholder:text-on-surface-variant/30 min-h-[120px]" 
                placeholder={placeholder} 
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <p className="text-xs text-destructive font-semibold ml-1">{error}</p>}
        </div>
    );
}

function ToolbarButton({ icon }: { icon: string }) {
    return (
        <button className="p-2 hover:bg-white rounded-lg transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-xl">{icon}</span>
        </button>
    );
}
