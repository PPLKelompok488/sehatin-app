import { Head, useForm } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';
import { BrandLogo } from '@/components/ui/brand-logo';

import RegisterStep1 from '../components/register-step-1';
import RegisterStep2 from '../components/register-step-2';
import { validateStep1, validateStep2, RegisterFormData, RegisterFieldName } from '../schema/register.schema';

export default function Register() {
    const [step, setStep] = React.useState(1);

    const { data, setData, post, processing, errors, reset, clearErrors, setError } = useForm<RegisterFormData>({
        nik: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        date_of_birth: '',
        gender: '',
        address: '',
        blood_type: '',
    });

    const nextStep = () => {
        if (validateStep1(data, (key, msg) => setError(key, msg), (key) => key ? clearErrors(key) : clearErrors())) {
            setStep(2);
        }
    };

    const prevStep = () => setStep(1);

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        if (validateStep2(data, (key, msg) => setError(key, msg))) {
            post(route('register'), {
                onFinish: () => reset('password', 'password_confirmation'),
            });
        }
    };

    React.useEffect(() => {
        const step1Fields: RegisterFieldName[] = ['name', 'email', 'phone', 'password', 'password_confirmation'];
        const hasStep1Errors = Object.keys(errors).some((key) => 
            step1Fields.includes(key as RegisterFieldName)
        );
        
        if (hasStep1Errors && step === 2) {
            setStep(1);
        }
    }, [errors, step]);


    const handleClearErrors = (key?: RegisterFieldName) => {
        if (key) {
            clearErrors(key);
        } else {
            clearErrors();
        }
    };

    return (
        <div className="bg-surface font-body text-on-surface antialiased overflow-x-hidden">
            <Head title="Pendaftaran Pasien" />
            <main className="min-h-screen grid lg:grid-cols-[4fr_6fr]">
                {/* Left Section */}
                <section className="hidden lg:flex relative bg-primary flex-col p-12 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            alt="Modern clinical interior"
                            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQtABvl0nfzAqk61IK5RIfnCnAy_MRuJordUukhu52NnitF4fhDxjAL4N2na5tnKyyUHE1NIFXIkZt2CwFzr2tRxhsrDu88nlXT_lKsJr4e-JwyloJ1toe8VtMbvqtEPDUZy2zIvjsW8ABOyGoPTjbUUqMlucuon5lXXjgkdhfRCXAlVkPb9LkF-z9pmz1UIQfiWHZzPOpsKwr6lBKbDWUBYB3hd9ZHF3QUZLys5pR054NOenFX5D5BeQ6LF_ZDQKN2O9-kJ8zHr4"
                        />
                    </div>
                    <div className="relative z-10 flex flex-col justify-center h-full text-left items-start">
                        <BrandLogo className="mb-16" iconClassName="grayscale brightness-0 invert" size={10} />
                        <h1 className="font-headline text-5xl font-extrabold text-white leading-tight tracking-tight mb-6 max-w-md">
                            Sehatin adalah platform kesehatan digital untuk klinik kecil.
                        </h1>
                        <p className="text-white/80 text-lg max-w-sm leading-relaxed">
                            Catat dan lapor rekam medis, riwayat kunjungan, dan rekomendasi dokter dengan mudah secara mandiri tanpa kertas.
                        </p>
                    </div>
                </section>

                {/* Right Section */}
                <section className="relative flex flex-col min-h-[100dvh] bg-background">
                    <div className="sticky top-0 z-20 w-full bg-background/95 backdrop-blur-xl px-6 md:px-12 py-8 lg:py-0 lg:px-16 lg:pt-24">
                        <div className="w-full max-w-2xl mx-auto">
                            <div className="lg:hidden flex justify-center mb-6">
                                <BrandLogo size={8} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 ? 'bg-primary text-on-primary ring-4 ring-primary/10' : 'bg-primary text-on-primary'}`}>
                                        {step > 1 ? <Check className="size-5" /> : '1'}
                                    </div>
                                    <span className={`text-xs font-semibold ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>Buat Akun</span>
                                </div>
                                <div className={`flex-1 h-px stepper-rail mx-4 -mt-5 ${step > 1 ? 'active' : ''}`}></div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-primary text-on-primary ring-4 ring-primary/10' : 'bg-surface-container text-on-surface-variant'}`}>
                                        2
                                    </div>
                                    <span className={`text-xs font-semibold ${step === 2 ? 'text-primary' : 'text-on-surface-variant'}`}>Data Diri</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center px-6 py-10 md:px-12 lg:px-16">
                        <div className="w-full max-w-2xl mx-auto space-y-10">
                            {step === 1 ? (
                                <RegisterStep1
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    clearErrors={handleClearErrors}
                                    onNext={nextStep}
                                />
                            ) : (
                                <RegisterStep2
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    clearErrors={handleClearErrors}
                                    processing={processing}
                                    onPrevious={prevStep}
                                    onSubmit={submit}
                                />
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
