import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, Lock, LockKeyhole, Mail, Phone, User } from 'lucide-react';
import * as React from 'react';
import { RegisterFormData, RegisterFieldName } from '../schema/register.schema';

interface RegisterStep1Props {
    data: RegisterFormData;
    setData: (key: RegisterFieldName, value: string) => void;
    errors: Partial<Record<RegisterFieldName, string>>;
    clearErrors: (key?: RegisterFieldName) => void;
    onNext: () => void;
}

export default function RegisterStep1({ data, setData, errors, clearErrors, onNext }: RegisterStep1Props) {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2 text-center lg:text-left">
                <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Buat Akun</h2>
                <p className="text-on-surface-variant font-medium">Mulai perjalanan pengelolaan kesehatan yang lebih baik hari ini.</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="name">Nama Lengkap</label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => { setData('name', e.target.value); clearErrors('name'); }}
                            placeholder="Masukkan nama lengkap Anda"
                            type="text"
                            icon={User}
                            className={errors.name ? 'ring-2 ring-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="email">Email</label>
                            <Input
                                id="email"
                                value={data.email}
                                onChange={(e) => { setData('email', e.target.value); clearErrors('email'); }}
                                placeholder="nama@contoh.com"
                                type="email"
                                icon={Mail}
                                className={errors.email ? 'ring-2 ring-red-500' : ''}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="phone">Nomor Ponsel</label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => { 
                                    const val = e.target.value.replace(/\D/g, ''); 
                                    setData('phone', val); 
                                    clearErrors('phone'); 
                                }}
                                placeholder="08xx-xxxx-xxxx"
                                type="tel"
                                icon={Phone}
                                className={errors.phone ? 'ring-2 ring-red-500' : ''}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="password">Kata Sandi</label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => { 
                                        const val = e.target.value.replace(/\s/g, '');
                                        setData('password', val); 
                                        clearErrors('password'); 
                                    }}
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    icon={Lock}
                                    className={`pr-12 ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="cursor-pointer absolute inset-y-0 right-0 pr-4 flex items-center text-primary transition-opacity focus:outline-hidden hover:opacity-80"
                                >
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="password_confirmation">Konfirmasi Sandi</label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => { 
                                        const val = e.target.value.replace(/\s/g, '');
                                        setData('password_confirmation', val); 
                                        clearErrors('password_confirmation'); 
                                    }}
                                    placeholder="••••••••"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    icon={LockKeyhole}
                                    className={`pr-12 ${errors.password_confirmation ? 'ring-2 ring-red-500' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="cursor-pointer absolute inset-y-0 right-0 pr-4 flex items-center text-primary transition-opacity focus:outline-hidden hover:opacity-80"
                                >
                                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                        </div>
                    </div>
                </div>

                <Button className="w-full mt-8 group" type="submit">
                    Selanjutnya
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </Button>
            </form>
            <p className="text-center font-medium text-on-surface-variant pt-4">
                Sudah punya akun?
                <Link className="text-secondary font-bold hover:text-primary transition-colors ml-1" href={route('login')}>Masuk</Link>
            </p>
        </div>
    );
}
