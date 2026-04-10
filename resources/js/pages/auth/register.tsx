import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Register() {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors, setError } = useForm({
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

    const validateStep1 = () => {
        clearErrors();
        let isValid = true;

        if (!data.name) {
            setError('name', 'Nama lengkap wajib diisi');
            isValid = false;
        }
        if (!data.email) {
            setError('email', 'Email wajib diisi');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            setError('email', 'Format email tidak valid');
            isValid = false;
        }
        if (!data.phone) {
            setError('phone', 'Nomor ponsel wajib diisi');
            isValid = false;
        }
        if (!data.password) {
            setError('password', 'Kata sandi wajib diisi');
            isValid = false;
        } else if (data.password.length < 8) {
            setError('password', 'Kata sandi minimal 8 karakter');
            isValid = false;
        }
        if (data.password !== data.password_confirmation) {
            setError('password_confirmation', 'Konfirmasi sandi tidak cocok');
            isValid = false;
        }

        return isValid;
    };

    const validateStep2 = () => {
        let isValid = true;

        if (!data.nik) {
            setError('nik', 'NIK wajib diisi');
            isValid = false;
        } else if (data.nik.length !== 16) {
            setError('nik', 'NIK harus 16 digit');
            isValid = false;
        }
        if (!data.date_of_birth) {
            setError('date_of_birth', 'Tanggal lahir wajib diisi');
            isValid = false;
        }
        if (!data.blood_type) {
            setError('blood_type', 'Golongan darah wajib diisi');
            isValid = false;
        }
        if (!data.gender) {
            setError('gender', 'Jenis kelamin wajib dipilih');
            isValid = false;
        }
        if (!data.address) {
            setError('address', 'Alamat wajib diisi');
            isValid = false;
        }

        return isValid;
    };

    const nextStep = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const prevStep = () => setStep(1);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (validateStep2()) {
            post(route('register'), {
                onFinish: () => reset('password', 'password_confirmation'),
            });
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
                        <div className="flex items-center gap-2 mb-16">
                            <img src="/images/sehatin.png" alt="Sehatin Logo" className="h-10 filter grayscale brightness-0 invert" />
                        </div>
                        <h1 className="font-headline text-5xl font-extrabold text-white leading-tight tracking-tight mb-6 max-w-md">
                            Sehatin adalah platform kesehatan digital untuk klinik kecil.
                        </h1>
                        <p className="text-white/80 text-lg max-w-sm leading-relaxed">
                            Catat dan lapor rekam medis, riwayat kunjungan, dan rekomendasi dokter dengan mudah secara mandiri tanpa kertas.
                        </p>
                    </div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 -left-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                </section>

                {/* Right Section */}
                <section className="flex items-center justify-center p-6 md:p-12 lg:p-16 bg-background">
                    <div className="w-full max-w-2xl space-y-10">
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="flex items-center gap-2">
                                <img src="/images/sehatin.png" alt="Sehatin Logo" className="h-8" />
                            </div>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 ? 'bg-primary text-on-primary ring-4 ring-primary/10' : 'bg-primary text-on-primary'}`}>
                                    {step > 1 ? <span className="material-symbols-outlined text-lg">check</span> : '1'}
                                </div>
                                <span className={`text-xs font-semibold ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>Buat Akun</span>
                            </div>
                            <div className={`flex-1 h-px stepper-rail mx-4 -mt-6 ${step > 1 ? 'active' : ''}`}></div>
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-primary text-on-primary ring-4 ring-primary/10' : 'bg-surface-container text-on-surface-variant'}`}>
                                    2
                                </div>
                                <span className={`text-xs font-semibold ${step === 2 ? 'text-primary' : 'text-on-surface-variant'}`}>Data Diri</span>
                            </div>
                        </div>

                        {step === 1 ? (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2 text-center lg:text-left">
                                    <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Buat Akun</h2>
                                    <p className="text-on-surface-variant font-medium">Mulai perjalanan pengelolaan kesehatan yang lebih baik hari ini.</p>
                                </div>

                                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="name">Nama Lengkap</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-outline-variant text-xl group-focus-within:text-primary transition-colors">person</span>
                                                </div>
                                                <Input
                                                    className={`pl-11 ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => { setData('name', e.target.value); clearErrors('name'); }}
                                                    placeholder="Masukkan nama lengkap Anda"
                                                    type="text"
                                                />
                                            </div>
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="email">Email</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <span className="material-symbols-outlined text-outline-variant text-xl group-focus-within:text-primary transition-colors">mail</span>
                                                    </div>
                                                    <Input
                                                        className={`pl-11 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                                                        id="email"
                                                        value={data.email}
                                                        onChange={(e) => { setData('email', e.target.value); clearErrors('email'); }}
                                                        placeholder="nama@contoh.com"
                                                        type="email"
                                                    />
                                                </div>
                                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="phone">Nomor Ponsel</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <span className="material-symbols-outlined text-outline-variant text-xl group-focus-within:text-primary transition-colors">call</span>
                                                    </div>
                                                    <Input
                                                        className={`pl-11 ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                                                        id="phone"
                                                        value={data.phone}
                                                        onChange={(e) => { setData('phone', e.target.value); clearErrors('phone'); }}
                                                        placeholder="08xx-xxxx-xxxx"
                                                        type="tel"
                                                    />
                                                </div>
                                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="password">Kata Sandi</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <span className="material-symbols-outlined text-outline-variant text-xl group-focus-within:text-primary transition-colors">lock</span>
                                                    </div>
                                                    <Input
                                                        className={`pl-11 pr-12 ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                                                        id="password"
                                                        value={data.password}
                                                        onChange={(e) => { setData('password', e.target.value); clearErrors('password'); }}
                                                        placeholder="••••••••"
                                                        type={showPassword ? 'text' : 'password'}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="cursor-pointer absolute inset-y-0 right-0 pr-4 flex items-center text-primary hover:text-primary transition-colors focus:outline-hidden"
                                                    >
                                                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                                    </button>
                                                </div>
                                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="password_confirmation">Konfirmasi Sandi</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <span className="material-symbols-outlined text-outline-variant text-xl group-focus-within:text-primary transition-colors">lock_reset</span>
                                                    </div>
                                                    <Input
                                                        className={`pl-11 pr-12 ${errors.password_confirmation ? 'ring-2 ring-red-500' : ''}`}
                                                        id="password_confirmation"
                                                        value={data.password_confirmation}
                                                        onChange={(e) => { setData('password_confirmation', e.target.value); clearErrors('password_confirmation'); }}
                                                        placeholder="••••••••"
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="cursor-pointer absolute inset-y-0 right-0 pr-4 flex items-center text-primary hover:text-primary transition-colors focus:outline-hidden"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                                    </button>
                                                </div>
                                                {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full mt-8 group"
                                        type="submit"
                                    >
                                        Selanjutnya
                                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Button>
                                </form>
                                <p className="text-center font-medium text-on-surface-variant pt-4">
                                    Sudah punya akun?
                                    <Link className="text-secondary font-bold hover:text-primary transition-colors ml-1" href={route('login')}>Masuk</Link>
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2 text-center lg:text-left">
                                    <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Lengkapi Data Diri</h2>
                                    <p className="text-on-surface-variant font-medium">Informasi ini diperlukan untuk rekam medis Anda.</p>
                                </div>

                                <form className="space-y-6" onSubmit={submit}>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="nik">NIK (Nomor Induk Kependudukan)</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-outline-variant text-xl group-focus-within:text-primary transition-colors">badge</span>
                                                </div>
                                                <Input
                                                    className={`pl-11 ${errors.nik ? 'ring-2 ring-red-500' : ''}`}
                                                    id="nik"
                                                    value={data.nik}
                                                    onChange={(e) => { setData('nik', e.target.value); clearErrors('nik'); }}
                                                    placeholder="16 digit nomor induk kependudukan"
                                                    type="text"
                                                    maxLength={16}
                                                />
                                            </div>
                                            {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="date_of_birth">Tanggal Lahir</Label>
                                                <DatePicker
                                                    value={data.date_of_birth}
                                                    onChange={(value) => {
                                                        setData('date_of_birth', value);
                                                        clearErrors('date_of_birth');
                                                    }}
                                                    placeholder="Pilih tanggal lahir"
                                                    error={!!errors.date_of_birth}
                                                />
                                                {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="blood_type">Golongan Darah</Label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                                        <span className="material-symbols-outlined text-outline-variant text-xl group-focus-within:text-primary transition-colors">bloodtype</span>
                                                    </div>
                                                    <Select
                                                        value={data.blood_type}
                                                        onValueChange={(value) => { setData('blood_type', value); clearErrors('blood_type'); }}
                                                    >
                                                        <SelectTrigger
                                                            className={cn(
                                                                "w-full pl-11",
                                                                errors.blood_type && "ring-2 ring-red-500"
                                                            )}
                                                            id="blood_type"
                                                        >
                                                            <SelectValue placeholder="Pilih" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="A">A</SelectItem>
                                                            <SelectItem value="B">B</SelectItem>
                                                            <SelectItem value="AB">AB</SelectItem>
                                                            <SelectItem value="O">O</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                {errors.blood_type && <p className="text-red-500 text-xs mt-1">{errors.blood_type}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-on-surface-variant px-1">Jenis Kelamin</label>
                                            <RadioGroup
                                                value={data.gender}
                                                onValueChange={(value) => { setData('gender', value); clearErrors('gender'); }}
                                                className="flex gap-4"
                                            >
                                                <div className="flex-1">
                                                    <Label
                                                        htmlFor="gender-pria"
                                                        className={`flex items-center gap-3 p-4 bg-surface-container rounded-lg cursor-pointer transition-all duration-200 border-2 ${data.gender === 'pria' ? 'border-primary bg-white' : 'border-transparent'} ${errors.gender ? 'border-red-500' : ''}`}
                                                    >
                                                        <RadioGroupItem value="pria" id="gender-pria" />
                                                        <span className="text-on-surface font-bold">Laki-laki</span>
                                                    </Label>
                                                </div>
                                                <div className="flex-1">
                                                    <Label
                                                        htmlFor="gender-wanita"
                                                        className={`flex items-center gap-3 p-4 bg-surface-container rounded-lg cursor-pointer transition-all duration-200 border-2 ${data.gender === 'wanita' ? 'border-primary bg-white' : 'border-transparent'} ${errors.gender ? 'border-red-500' : ''}`}
                                                    >
                                                        <RadioGroupItem value="wanita" id="gender-wanita" />
                                                        <span className="text-on-surface font-bold">Perempuan</span>
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="address">Alamat Lengkap</label>
                                            <div className="relative group">
                                                <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                                                    <span className="material-symbols-outlined text-outline-variant text-xl group-focus-within:text-primary transition-colors">home</span>
                                                </div>
                                                <Textarea
                                                    className={`pl-11 ${errors.address ? 'ring-2 ring-red-500' : ''}`}
                                                    id="address"
                                                    value={data.address}
                                                    onChange={(e) => { setData('address', e.target.value); clearErrors('address'); }}
                                                    placeholder="Masukkan alamat lengkap Anda saat ini"
                                                />
                                            </div>
                                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            type="button"
                                            onClick={prevStep}
                                        >
                                            Kembali
                                        </Button>
                                        <Button
                                            className="flex-[2] group"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                                            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
