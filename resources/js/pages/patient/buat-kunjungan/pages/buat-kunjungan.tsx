import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import * as React from 'react';
import BuatKunjunganStep1 from '../components/buat-kunjungan-step-1';
import { BuatKunjunganStepper } from '../components/buat-kunjungan-stepper';
import { BuatKunjunganFooter } from '../components/buat-kunjungan-footer';

interface Poli {
    id: number;
    name: string;
    description: string;
    icon: string;
}

interface BuatKunjunganProps {
    polis: Poli[];
}

export default function BuatKunjungan({ polis }: BuatKunjunganProps) {
    const [step, setStep] = React.useState(1);
    const [selectedPoli, setSelectedPoli] = React.useState<string | null>(null);

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <>
            <AppLayout>
                <Head title="Buat Kunjungan" />
                
                <div className="max-w-5xl mx-auto pt-6 pb-24">
                    <BuatKunjunganStepper currentStep={step} />

                    {/* Content Section */}
                    <div className="min-h-[400px]">
                        {step === 1 && (
                            <BuatKunjunganStep1 
                                selectedPoliId={selectedPoli}
                                onSelect={(id) => setSelectedPoli(id)}
                                polis={polis}
                            />
                        )}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Pilih Dokter & Jadwal</h2>
                                    <p className="text-on-surface-variant max-w-xl">
                                        Pilih tenaga medis dan waktu yang tersedia untuk melakukan pemeriksaan.
                                    </p>
                                </div>
                                <div className="flex items-center justify-center h-48 border-2 border-dashed border-outline-variant rounded-3xl text-on-surface-variant/40 font-bold italic">
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Konfirmasi Kunjungan</h2>
                                    <p className="text-on-surface-variant max-w-xl">
                                        Tinjau kembali detail kunjungan Anda sebelum melakukan konfirmasi akhir.
                                    </p>
                                </div>
                                <div className="flex items-center justify-center h-48 border-2 border-dashed border-outline-variant rounded-3xl text-on-surface-variant/40 font-bold italic">
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AppLayout>

            <BuatKunjunganFooter 
                step={step}
                onNext={nextStep}
                onPrevious={prevStep}
                canNext={step === 1 ? !!selectedPoli : true}
            />
        </>
    );
}
