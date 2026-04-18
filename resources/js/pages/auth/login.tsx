import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { BrandLogo } from '@/components/ui/brand-logo';
import InputError from '@/components/input-error';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="bg-surface font-body text-on-surface antialiased overflow-x-hidden">
            <Head title="Masuk" />
            <main className="min-h-screen grid lg:grid-cols-[4fr_6fr]">
                {/* Left Section — identical to Register */}
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
                            Catat dan lacak rekam medis, riwayat kunjungan, dan rekomendasi dokter dengan mudah secara mandiri tanpa kertas.
                        </p>
                    </div>
                </section>

                {/* Right Section — Login Form */}
                <section className="relative flex flex-col min-h-[100dvh] bg-background">
                    <div className="flex-1 flex flex-col justify-center px-6 py-10 md:px-12 lg:px-16">
                        <div className="w-full max-w-md mx-auto space-y-10">
                            {/* Mobile logo */}
                            <div className="lg:hidden flex justify-center mb-6">
                                <BrandLogo size={8} />
                            </div>

                            {/* Header */}
                            <div>
                                <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
                                    Selamat Datang Kembali
                                </h2>
                                <p className="mt-2 text-sm text-on-surface-variant font-medium">
                                    Silakan masukkan detail akun Anda untuk mengakses dashboard.
                                </p>
                            </div>

                            {/* Status message (e.g. after password reset) */}
                            {status && (
                                <div className="text-center text-sm font-medium text-success rounded-lg bg-success/10 py-3 px-4">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-on-surface-variant mb-2 ml-1">
                                        Email
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-xl text-on-surface-variant/60 group-focus-within:text-primary transition-colors">mail</span>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="block w-full pl-11 pr-4 py-3.5 bg-surface-container border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface text-on-surface placeholder:text-on-surface-variant/50 transition-all duration-200"
                                            placeholder="nama@contoh.com"
                                            onChange={(e) => setData('email', e.target.value)}
                                            autoComplete="email"
                                            autoFocus
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-1.5 ml-1" />
                                </div>

                                {/* Password Input */}
                                <div>
                                    <div className="flex items-center justify-between mb-2 ml-1">
                                        <label htmlFor="password" className="block text-sm font-bold text-on-surface-variant">
                                            Kata Sandi
                                        </label>
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-xs font-semibold text-primary hover:underline underline-offset-4"
                                            >
                                                Lupa kata sandi?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-xl text-on-surface-variant/60 group-focus-within:text-primary transition-colors">lock</span>
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            className="block w-full pl-11 pr-12 py-3.5 bg-surface-container border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface text-on-surface placeholder:text-on-surface-variant/50 transition-all duration-200"
                                            placeholder="••••••••"
                                            onChange={(e) => setData('password', e.target.value)}
                                            autoComplete="current-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant/60 text-primary cursor-pointer transition-colors"
                                            tabIndex={-1}
                                        >
                                            <span className="material-symbols-outlined text-xl">
                                                {showPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-1.5 ml-1" />
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center gap-3 px-1">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-surface-container cursor-pointer"
                                    />
                                    <label htmlFor="remember" className="text-sm font-medium text-on-surface-variant cursor-pointer select-none">
                                        Ingat saya di perangkat ini
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full bg-primary text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group mt-2 ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? 'Memproses...' : 'Masuk'}
                                    {!processing && (
                                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                                            arrow_forward
                                        </span>
                                    )}
                                </button>
                            </form>

                            <p className="text-center font-medium text-on-surface-variant text-sm">
                                Belum punya akun?{' '}
                                <Link href={route('register')} className="text-primary font-bold hover:underline underline-offset-4">
                                    Daftar
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
