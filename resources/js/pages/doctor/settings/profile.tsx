import { type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface ProfileProps {
    user: User;
    status?: string;
}

export default function DoctorProfile({ user, status }: ProfileProps) {
    const { auth } = usePage<SharedData>().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        phone: user.phone ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <AppLayout>
            <Head title="Ubah Profil Dokter" />

            <main className="pt-8 pb-16 px-6 max-w-6xl mx-auto">
                <nav className="flex mb-6 text-sm text-on-surface-variant/60 font-medium" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        <li><a href="/doctor/schedule" className="hover:text-primary">Dokter</a></li>
                        <li><span className="material-symbols-outlined text-sm">chevron_right</span></li>
                        <li className="text-on-surface font-semibold">Pengaturan Profil</li>
                    </ol>
                </nav>

                {status && (
                    <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-4 text-sm font-medium text-emerald-700">
                        {status}
                    </div>
                )}

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-2xl border border-outline-variant/50 shadow-sm text-center">
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-primary/10 bg-surface-container flex items-center justify-center">
                                    <span className="text-4xl font-bold text-primary/40">{auth.user.name.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-on-surface leading-tight">{user.name}</h2>
                            <p className="text-sm text-on-surface-variant font-medium mt-1">{user.email}</p>

                            <div className="mt-8 pt-6 border-t border-outline-variant/30">
                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                    Kelola data profil dokter Anda. Email tidak dapat diubah demi keamanan akses.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden">
                            <div className="p-8 pb-4">
                                <h3 className="text-2xl font-bold text-on-surface tracking-tight">Data Profil</h3>
                                <p className="text-on-surface-variant text-sm mt-1">Perbarui nama dan nomor telepon Anda di sini.</p>
                            </div>

                            <form onSubmit={submit} className="p-8 pt-4 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="name">Nama Lengkap</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">person</span>
                                            </div>
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-medium transition-all"
                                            />
                                        </div>
                                        {errors.name && <p className="text-xs text-red-500 px-1">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="phone">Nomor Telepon</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">call</span>
                                            </div>
                                            <input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-medium transition-all"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-xs text-red-500 px-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2 text-on-surface/50">
                                    <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="email">Alamat Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">mail</span>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="block w-full pl-11 pr-4 py-3 bg-surface-container border-none rounded-xl text-on-surface-variant/70 cursor-not-allowed font-medium"
                                        />
                                        <div className="absolute inset-y-0 right-4 flex items-center">
                                            <span className="material-symbols-outlined text-emerald-500 text-lg">verified</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] italic px-1 opacity-70">Email tidak dapat diubah untuk keamanan sistem.</p>
                                </div>

                                <div className="pt-6 mt-6 border-t border-outline-variant/30">
                                    <h4 className="text-lg font-bold text-on-surface mb-4">Ganti Kata Sandi</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="password">Kata Sandi Baru</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">lock</span>
                                                </div>
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Minimal 8 karakter"
                                                    className="block w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-medium transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-4 flex items-center text-on-surface-variant hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-xl">
                                                        {showPassword ? 'visibility_off' : 'visibility'}
                                                    </span>
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-xs text-red-500 px-1">{errors.password}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="password_confirmation">Konfirmasi Sandi Baru</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">lock_reset</span>
                                                </div>
                                                <input
                                                    id="password_confirmation"
                                                    type={showPasswordConfirm ? 'text' : 'password'}
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    placeholder="Ulangi kata sandi"
                                                    className="block w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-medium transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                                    className="absolute inset-y-0 right-4 flex items-center text-on-surface-variant hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-xl">
                                                        {showPasswordConfirm ? 'visibility_off' : 'visibility'}
                                                    </span>
                                                </button>
                                            </div>
                                            {errors.password_confirmation && <p className="text-xs text-red-500 px-1">{errors.password_confirmation}</p>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-on-surface-variant mt-3 italic leading-relaxed">
                                        Biarkan kosong jika tidak ingin mengganti kata sandi saat ini.
                                    </p>
                                </div>

                                <div className="pt-8 flex justify-end gap-3">
                                    <a
                                        href="/doctor/schedule"
                                        className="px-8 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-bold hover:bg-background transition-all"
                                    >
                                        Batal
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-12 py-3 rounded-xl bg-primary text-white font-extrabold shadow-lg shadow-primary/25 hover:translate-y-[-2px] active:translate-y-0 active:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </AppLayout>
    );
}
