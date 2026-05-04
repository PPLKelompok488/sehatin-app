import { Check } from 'lucide-react';
import * as React from 'react';

interface BuatKunjunganStepperProps {
    currentStep: number;
}

export function BuatKunjunganStepper({ currentStep }: BuatKunjunganStepperProps) {
    const steps = [
        { label: 'Pilih poli' },
        { label: 'Dokter & jadwal' },
        { label: 'Konfirmasi' },
    ];

    return (
        <div className="mb-16">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative px-4">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = currentStep >= stepNumber;
                    const isCompleted = currentStep > stepNumber;
                    
                    return (
                        <React.Fragment key={stepNumber}>
                            {/* Step Item */}
                            <div className="flex flex-col items-center gap-3 z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                                    isActive ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container text-on-surface-variant'
                                }`}>
                                    {isCompleted ? <Check className="size-5" /> : stepNumber}
                                </div>
                                <span className={`text-[10px] font-bold tracking-wider ${
                                    isActive ? 'text-primary' : 'text-on-surface-variant'
                                }`}>{step.label}</span>
                            </div>

                            {/* Rail between steps */}
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-px stepper-rail mx-4 -mt-8 ${currentStep > stepNumber ? 'active' : ''}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
