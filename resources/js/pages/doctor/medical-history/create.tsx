import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
        medicine: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('doctor.medical-record.store', appointment.id));
    };

    const breadcrumbItems = [
        { title: 'Jadwal Saya', href: route('doctor.schedule') },
        { title: 'Ruang Pemeriksaan', href: '#' },
    ];

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
            <Head title={`Input Rekam Medis - ${patient.name}`} />

            <main className="max-w-7xl mx-auto pb-20 pt-8 px-6">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <Breadcrumbs breadcrumbs={breadcrumbItems} className="mb-2" />
                        <h2 className="text-3xl font-bold text-on-surface font-headline">Rekam Medis Pasien</h2>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('doctor.schedule')}>
                            <Button variant="outline" className="px-8 h-12 rounded-xl border-border/40 text-on-surface-variant font-bold text-sm">
                                Batal
                            </Button>
                        </Link>
                        <Button 
                            onClick={handleSubmit}
                            disabled={processing}
                            className="px-8 h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:translate-y-[-2px] active:translate-y-0 transition-all"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Rekam Medis'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Patient Info & Vitals */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Patient Summary Card */}
                        <section className="bg-white p-6 rounded-3xl border border-border/10 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-4 mb-6 relative">
                                <Avatar className="w-16 h-16 rounded-2xl border-2 border-border/5 shadow-inner">
                                    <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                                        {getInitials(patient.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-bold text-on-surface text-lg">{patient.name}</h4>
                                    <p className="text-xs font-medium text-on-surface-variant/70">{patient.gender}, {patient.age ? `${patient.age} Tahun` : '-'}</p>
                                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/5 rounded-full mt-1 inline-block">ID: {patient.id}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-4 border-t border-border/5">
                                <div className="bg-surface-container/30 p-4 rounded-2xl">
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

                        {/* Vital Signs Input */}
                        <section className="bg-white p-8 rounded-3xl border border-border/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">monitoring</span>
                                </div>
                                <h3 className="text-xl font-bold text-on-surface">Tanda Vital</h3>
                            </div>

                            <div className="space-y-5">
                                <VitalInput 
                                    label="Tekanan Darah" 
                                    placeholder="120/80" 
                                    unit="mmHg" 
                                    icon="blood_pressure"
                                    value={data.blood_pressure}
                                    onChange={v => setData('blood_pressure', v)}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <VitalInput 
                                        label="Detak Jantung" 
                                        placeholder="80" 
                                        unit="bpm" 
                                        icon="favorite"
                                        value={data.heart_rate}
                                        onChange={v => setData('heart_rate', v)}
                                    />
                                    <VitalInput 
                                        label="Suhu" 
                                        placeholder="36.5" 
                                        unit="°C" 
                                        icon="thermostat"
                                        value={data.temperature}
                                        onChange={v => setData('temperature', v)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <VitalInput 
                                        label="Berat Badan" 
                                        placeholder="65" 
                                        unit="kg" 
                                        icon="weight"
                                        value={data.weight}
                                        onChange={v => setData('weight', v)}
                                    />
                                    <VitalInput 
                                        label="Gula Darah" 
                                        placeholder="90" 
                                        unit="mg/dL" 
                                        icon="monitoring"
                                        value={data.blood_sugar}
                                        onChange={v => setData('blood_sugar', v)}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: SOAP Form & Prescription */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Clinical Findings (SOAP) */}
                        <section className="bg-white p-8 rounded-3xl border border-border/10 shadow-sm transition-all hover:border-primary/20">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">description</span>
                                </div>
                                <h3 className="text-xl font-bold text-on-surface">Temuan Klinis (SOAP)</h3>
                            </div>

                            <div className="space-y-10">
                                {/* Subjective & Objective Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold">S</span>
                                            <label className="font-bold text-on-surface">Subjektif</label>
                                        </div>
                                        <Textarea 
                                            placeholder="Masukkan keluhan pasien..." 
                                            className="min-h-[120px] rounded-2xl bg-surface-container/30 border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none p-5 font-medium leading-relaxed"
                                            value={data.subjective}
                                            onChange={e => setData('subjective', e.target.value)}
                                        />
                                        {errors.subjective && <p className="text-red-500 text-xs mt-1">{errors.subjective}</p>}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold">O</span>
                                            <label className="font-bold text-on-surface">Objektif</label>
                                        </div>
                                        <Textarea 
                                            placeholder="Masukkan hasil pemeriksaan fisik..." 
                                            className="min-h-[120px] rounded-2xl bg-surface-container/30 border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none p-5 font-medium leading-relaxed"
                                            value={data.objective}
                                            onChange={e => setData('objective', e.target.value)}
                                        />
                                        {errors.objective && <p className="text-red-500 text-xs mt-1">{errors.objective}</p>}
                                    </div>
                                </div>

                                {/* Assessment Full Width */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold">A</span>
                                        <label className="font-bold text-on-surface">Assessment (Diagnosis)</label>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-on-surface-variant/30 text-xl group-focus-within:text-primary transition-colors">clinical_notes</span>
                                        </div>
                                        <Input 
                                            placeholder="Masukkan diagnosis atau kode ICD-10..." 
                                            className="block w-full pl-14 pr-5 py-7 bg-surface-container/30 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-bold transition-all"
                                            value={data.assessment}
                                            onChange={e => setData('assessment', e.target.value)}
                                        />
                                    </div>
                                    {errors.assessment && <p className="text-red-500 text-xs mt-1">{errors.assessment}</p>}
                                </div>

                                {/* Plan Full Width */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold">P</span>
                                        <label className="font-bold text-on-surface">Rencana & Rekomendasi</label>
                                    </div>
                                    <Textarea 
                                        placeholder="Masukkan rencana tindakan atau edukasi..." 
                                        className="min-h-[120px] rounded-2xl bg-surface-container/30 border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none p-5 font-medium leading-relaxed"
                                        value={data.plan}
                                        onChange={e => setData('plan', e.target.value)}
                                    />
                                    {errors.plan && <p className="text-red-500 text-xs mt-1">{errors.plan}</p>}
                                </div>
                            </div>
                        </section>

                        {/* Prescription Section */}
                        <section className="bg-white rounded-3xl border border-border/10 shadow-sm overflow-hidden transition-all hover:border-primary/20">
                            <div className="p-8 pb-4">
                                <h4 className="text-lg font-bold flex items-center gap-3 text-on-surface">
                                    <span className="material-symbols-outlined text-primary">prescriptions</span>
                                    Resep & Obat-Obatan
                                </h4>
                            </div>
                            <div className="px-8 pb-8">
                                {/* Mockup Toolbar */}
                                <div className="flex items-center gap-2 bg-surface-container/30 p-2 rounded-t-2xl border-b border-border/5">
                                    <div className="flex gap-1">
                                        <button className="p-2 hover:bg-white rounded-lg transition-colors text-on-surface-variant/60">
                                            <span className="material-symbols-outlined text-lg">format_bold</span>
                                        </button>
                                        <button className="p-2 hover:bg-white rounded-lg transition-colors text-on-surface-variant/60">
                                            <span className="material-symbols-outlined text-lg">format_italic</span>
                                        </button>
                                        <button className="p-2 hover:bg-white rounded-lg transition-colors text-on-surface-variant/60">
                                            <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
                                        </button>
                                    </div>
                                    <div className="ml-auto">
                                        <Button variant="ghost" className="h-9 text-xs font-bold text-primary hover:bg-primary/5 rounded-xl gap-2">
                                            <span className="material-symbols-outlined text-sm">list_alt</span>
                                            Gunakan Template
                                        </Button>
                                    </div>
                                </div>
                                <Textarea 
                                    placeholder="Masukkan resep obat..." 
                                    className="min-h-[200px] rounded-b-2xl bg-surface-container/30 border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none p-6 font-mono text-sm leading-relaxed border-t-0"
                                    value={data.medicine}
                                    onChange={e => setData('medicine', e.target.value)}
                                />
                                {errors.medicine && <p className="text-red-500 text-xs mt-1">{errors.medicine}</p>}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}

function VitalInput({ label, placeholder, unit, icon, value, onChange }: { label: string; placeholder: string; unit: string; icon: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest ml-1">{label} ({unit})</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant/20 text-xl group-focus-within:text-primary transition-colors">{icon}</span>
                </div>
                <Input 
                    placeholder={placeholder}
                    className="h-14 block w-full pl-12 pr-4 bg-surface-container/30 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-sm text-on-surface font-bold placeholder:font-normal placeholder:text-on-surface-variant/30 transition-all"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
