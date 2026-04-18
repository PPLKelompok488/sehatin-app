import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import * as React from 'react';
import BuatKunjunganStep1 from '../components/buat-kunjungan-step-1';
import BuatKunjunganStep2 from '../components/buat-kunjungan-step-2';
import BuatKunjunganStep3 from '../components/buat-kunjungan-step-3';
import { BuatKunjunganStepper } from '../components/buat-kunjungan-stepper';
import { BuatKunjunganFooter } from '../components/buat-kunjungan-footer';

interface Schedule {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
}

interface Doctor {
    id: number;
    user: {
        name: string;
    };
    avatar_url?: string;
    specialization: string;
    schedules: Schedule[];
}

interface BookedSlot {
    doctor_id: number;
    date: string;
    time: string;
}

interface Poli {
    id: number;
    name: string;
    description: string;
    icon: string;
}

interface BuatKunjunganProps {
    polis: Poli[];
    doctors: Doctor[];
    bookedSlots: BookedSlot[];
}

export default function BuatKunjungan({ polis, doctors, bookedSlots }: BuatKunjunganProps) {
    const { auth } = usePage<SharedData>().props;
    const [step, setStep] = React.useState(1);
    const [selectedPoli, setSelectedPoli] = React.useState<string | null>(null);
    const [selectedDoctorId, setSelectedDoctorId] = React.useState<number | null>(null);
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

    const nextStep = () => {
        if (step === 1 && selectedPoli) {
            router.get(
                route('patient.buat-kunjungan'),
                { poli_id: selectedPoli },
                {
                    preserveState: true,
                    only: ['doctors', 'bookedSlots'],
                    onSuccess: () => setStep(2)
                }
            );
        } else if (step < 3) {
            setStep(step + 1);
        }
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
                            <BuatKunjunganStep2
                                doctors={doctors}
                                bookedSlots={bookedSlots}
                                selectedDate={selectedDate}
                                onDateSelect={setSelectedDate}
                                selectedDoctorId={selectedDoctorId}
                                onDoctorSelect={setSelectedDoctorId}
                                selectedTime={selectedTime}
                                onTimeSelect={setSelectedTime}
                            />
                        )}
                        {step === 3 && (
                            <BuatKunjunganStep3
                                patientName={auth.user.name}
                                selectedPoli={polis.find(p => p.id.toString() === selectedPoli) || null}
                                selectedDoctor={doctors.find(d => d.id === selectedDoctorId) || null}
                                selectedDate={selectedDate}
                                selectedTime={selectedTime}
                            />
                        )}
                    </div>
                </div>
            </AppLayout>

            <BuatKunjunganFooter
                step={step}
                onNext={nextStep}
                onPrevious={prevStep}
                canNext={
                    step === 1 ? !!selectedPoli :
                        step === 2 ? (selectedDoctorId !== null && selectedDoctorId !== -1 && !!selectedDate && !!selectedTime) :
                            true
                }
            />
        </>
    );
}
