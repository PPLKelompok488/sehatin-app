import { type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState, type ChangeEvent } from 'react';

interface PatientData {
    id: number;
    user_id: number;
    date_of_birth: string;
    gender: string;
    address: string;
    blood_type: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    nik: string;
    avatar_url?: string | null;
}

interface ProfileProps {
    user: User;
    patient: PatientData;
    status?: string;
}

export default function PatientProfile({ user, patient, status }: ProfileProps) {
    const { auth } = usePage<SharedData>().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar_url ?? null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: user.name,
        phone: user.phone,
        date_of_birth: patient.date_of_birth,
        gender: patient.gender,
        blood_type: patient.blood_type,
        address: patient.address,
        avatar: null,
        password: '',
        password_confirmation: '',
    });

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setData('avatar', file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleAvatarRemove = () => {
        router.delete(route('patient.settings.profile.avatar.destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                setData('avatar', null);
                setAvatarPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                router.reload({ only: ['auth'] });
            },
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('patient.settings.profile.update'), {
            onSuccess: () => {
                router.reload({ only: ['auth'] });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Ubah Profil Pasien" />

            <main className="pt-8 pb-16 px-6 max-w-6xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="flex mb-6 text-sm text-on-surface-variant/60 font-medium" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        <li><a href={route('patient.kunjungan')} className="hover:text-primary">Pasien</a></li>
                        <li className="text-on-surface-variant">/</li>
                        <li className="text-on-surface font-semibold">Pengaturan Profil</li>
                    </ol>
                </nav>

                {/* Status Message */}
                {status && (
                    <div className="mb-6 p-4 bg-green-50/80 border border-green-200/50 rounded-xl text-green-700 text-sm font-medium">
                        {status}
                    </div>
                )}

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left: Profile Sidebar Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-2xl border border-outline-variant/50 shadow-sm text-center">
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-primary/10 bg-surface-container">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-4xl font-bold text-primary/40">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-on-surface leading-tight">{user.name}</h2>
                            <p className="text-sm text-on-surface-variant font-medium mt-1">{user.email}</p>

                            <div className="mt-6 flex flex-col gap-2 px-6">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleAvatarChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full px-4 py-3 rounded-xl border border-outline-variant text-sm font-bold text-primary hover:bg-primary/10 transition-all"
                                >
                                    Ganti Foto Profil
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAvatarRemove}
                                    className="w-full px-4 py-3 rounded-xl border border-transparent text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                                >
                                    Hapus Foto Profil
                                </button>
                                {errors.avatar && <p className="text-xs text-red-500 px-1">{errors.avatar}</p>}
                            </div>

                            <div className="mt-8 pt-6 border-t border-outline-variant/30">
                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                    Kelola informasi profil Anda. Informasi ini akan diperlukan untuk keperluan rekam medis Anda.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Account Settings Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden">
                            <div className="p-8 pb-4">
                                <h3 className="text-2xl font-bold text-on-surface tracking-tight">Data Profil Pasien</h3>
                                <p className="text-on-surface-variant text-sm mt-1">Lengkapi informasi diri Anda untuk mendapatkan layanan kesehatan terbaik.</p>
                            </div>

                            <form onSubmit={submit} className="p-8 pt-4 space-y-6">
                                {/* Personal Info Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="name">
                                            Nama Lengkap
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                                                    person
                                                </span>
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

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="phone">
                                            Nomor Ponsel
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                                                    call
                                                </span>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* NIK */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="nik">
                                            NIK (16 Digit)
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                                                    badge
                                                </span>
                                            </div>
                                            <input
                                                id="nik"
                                                type="text"
                                                value={user.nik}
                                                disabled
                                                className="block w-full pl-11 pr-4 py-3 bg-surface-container border-none rounded-xl text-on-surface-variant/70 cursor-not-allowed font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Email (Locked) */}
                                    <div className="space-y-2 text-on-surface/50">
                                        <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="email">
                                            Alamat Email
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                                                    mail
                                                </span>
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="block w-full pl-11 pr-4 py-3 bg-surface-container border-none rounded-xl text-on-surface-variant/70 cursor-not-allowed font-medium"
                                            />
                                            <div className="absolute inset-y-0 right-4 flex items-center">
                                                <span className="material-symbols-outlined text-green-500 text-lg">verified</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Birth Date */}
                                    <div className="space-y-2 md:col-span-1">
                                        <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="dob">
                                            Tanggal Lahir
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                                                    calendar_month
                                                </span>
                                            </div>
                                            <input
                                                id="dob"
                                                type="date"
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-medium transition-all"
                                            />
                                        </div>
                                        {errors.date_of_birth && <p className="text-xs text-red-500 px-1">{errors.date_of_birth}</p>}
                                    </div>

                                    {/* Gender */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-on-surface-variant px-1">
                                            Jenis Kelamin
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                                                    wc
                                                </span>
                                            </div>
                                            <select
                                                value={data.gender}
                                                onChange={(e) => setData('gender', e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-medium transition-all appearance-none"
                                            >
                                                <option value="">Pilih Jenis Kelamin</option>
                                                <option value="pria">Laki-laki</option>
                                                <option value="wanita">Perempuan</option>
                                            </select>
                                        </div>
                                        {errors.gender && <p className="text-xs text-red-500 px-1">{errors.gender}</p>}
                                    </div>

                                    {/* Blood Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-on-surface-variant px-1">
                                            Golongan Darah
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                                                    bloodtype
                                                </span>
                                            </div>
                                            <select
                                                value={data.blood_type}
                                                onChange={(e) => setData('blood_type', e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-medium transition-all appearance-none"
                                            >
                                                <option value="">Pilih Golongan Darah</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="AB">AB</option>
                                                <option value="O">O</option>
                                            </select>
                                        </div>
                                        {errors.blood_type && <p className="text-xs text-red-500 px-1">{errors.blood_type}</p>}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="address">
                                        Alamat Lengkap
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                                            <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                                                home
                                            </span>
                                        </div>
                                        <textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-medium transition-all min-h-[100px]"
                                        />
                                    </div>
                                    {errors.address && <p className="text-xs text-red-500 px-1">{errors.address}</p>}
                                </div>

                                {/* Change Password Section */}
                                <div className="pt-6 mt-6 border-t border-outline-variant/30">
                                    <h4 className="text-lg font-bold text-on-surface mb-4">Ganti Kata Sandi</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="password">
                                                Kata Sandi Baru
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                                                        lock
                                                    </span>
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
                                            <label className="text-sm font-bold text-on-surface-variant px-1" htmlFor="password_confirmation">
                                                Konfirmasi Sandi Baru
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                                                        lock_reset
                                                    </span>
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

                                {/* Submit Buttons */}
                                <div className="pt-8 flex justify-end gap-3">
                                    <a
                                        href={route('patient.kunjungan')}
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
