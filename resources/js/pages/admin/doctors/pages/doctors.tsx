import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { FormSheet } from '@/components/ui/form-sheet';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    CircleOff,
    Mail,
    Phone,
    Pencil,
    Plus,
    Search,
    Trash2,
    UserCircle,
    User,
    Award,
    Hash,
    UserPlus,
    Camera,
    BriefcaseMedical,
    BadgeCheck,
    Lock
} from 'lucide-react';
import * as React from 'react';
import { PageHeader } from '@/components/page-header';

/* ─────────────────────────── Types ─────────────────────────── */
interface DoctorUser {
    name: string;
    email: string;
    phone: string;
    nik: string;
    is_active: boolean;
}

interface DoctorPoli {
    name: string;
}

interface Doctor {
    id: number;
    user_id: number;
    poli_id: number | null;
    specialization: string;
    str_number: string;
    avatar_url: string | null;
    user: DoctorUser;
    poli: DoctorPoli | null;
}

interface Stats {
    total: number;
    active: number;
    inactive: number;
}

interface PoliOption {
    id: number;
    name: string;
}

interface PageProps {
    doctors: Doctor[];
    stats: Stats;
    polis: PoliOption[];
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

/* ─────────────────────── Modal Component ───────────────────── */
interface DoctorModalProps {
    doctor?: Doctor | null;
    polis: PoliOption[];
    open: boolean;
    onClose: () => void;
}

/* ─────────────────────── Constants ───────────────────────── */
const POLI_SPECIALIZATIONS: Record<string, string[]> = {
    'Poli Umum': ['Dokter Umum'],
    'Poli Gigi & Mulut': ['Dokter Gigi Umum', 'Spesialis Bedah Mulut', 'Spesialis Konservasi Gigi', 'Spesialis Ortodonsia', 'Spesialis Kedokteran Gigi Anak', 'Spesialis Periodonsia', 'Spesialis Prostodonsia'],
    'Poli Anak (Pediatrik)': ['Spesialis Anak', 'Spesialis Bedah Anak', 'Spesialis Saraf Anak', 'Spesialis Jantung Anak'],
    'Poli Kandungan & Kebidanan (Obgyn)': ['Spesialis Obstetri dan Ginekologi (Kandungan)', 'Spesialis Fetomaternal', 'Spesialis Fertilitas Endokrinologi'],
    'Poli Saraf & Neurologi': ['Spesialis Saraf (Neurologi)', 'Spesialis Bedah Saraf'],
    'Poli Jantung & Pembuluh Darah': ['Spesialis Jantung dan Pembuluh Darah', 'Spesialis Bedah Toraks Kardiak dan Vaskular'],
    'Poli Penyakit Dalam (Internis)': ['Spesialis Penyakit Dalam', 'Spesialis Gastroenterohepatologi', 'Spesialis Endokrinologi', 'Spesialis Ginjal Hipertensi'],
    'Poli Mata': ['Spesialis Mata'],
    'Poli THT (Telinga, Hidung, Tenggorokan)': ['Spesialis THT-KL', 'Spesialis Bedah THT'],
    'Poli Kulit & Kelamin': ['Spesialis Kulit dan Kelamin', 'Spesialis Dermatovenereologi'],
    'Poli Bedah Umum': ['Spesialis Bedah Umum', 'Spesialis Bedah Onkologi', 'Spesialis Bedah Plastik', 'Spesialis Bedah Tulang'],
    'Poli Tulang & Sendi (Ortopedi)': ['Spesialis Ortopedi dan Traumatologi'],
    'Poli Psikiatri & Kesehatan Jiwa': ['Spesialis Kedokteran Jiwa (Psikiater)'],
    'Poli Paru & Pernapasan': ['Spesialis Paru (Pulmonologi)'],
};

const DEFAULT_SPECIALIZATIONS = [
    'Dokter Umum', 'Dokter Gigi', 'Spesialis Penyakit Dalam', 'Spesialis Anak', 'Spesialis Kandungan', 'Spesialis Bedah', 'Spesialis Saraf', 'Spesialis Jantung'
];

function DoctorModal({ doctor, polis, open, onClose }: DoctorModalProps) {
    const isEdit = !!doctor;
    const [form, setForm] = React.useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        is_active: true,
        poli_id: '',
        specialization: '',
        str_number: '',
    });
    const [avatar, setAvatar] = React.useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [submitting, setSubmitting] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (open) {
            setForm({
                name: doctor?.user.name ?? '',
                email: doctor?.user.email ?? '',
                password: '',
                phone: doctor?.user.phone ?? '',
                is_active: doctor?.user.is_active ?? true,
                poli_id: doctor?.poli_id ? String(doctor.poli_id) : (polis.length > 0 ? String(polis[0].id) : ''),
                specialization: doctor?.specialization ?? '',
                str_number: doctor?.str_number ?? '',
            });
            setAvatar(null);
            setAvatarPreview(doctor?.avatar_url ?? null);
            setErrors({});
        }
    }, [doctor, open, polis]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ ...errors, avatar: 'Ukuran file maksimal 2MB.' });
                return;
            }
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
            setErrors({ ...errors, avatar: '' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Nama dokter wajib diisi.';
        if (!form.email.trim()) errs.email = 'Email wajib diisi.';
        if (!isEdit && !form.password) errs.password = 'Password wajib diisi untuk pengguna baru.';
        if (!form.phone.trim()) errs.phone = 'Nomor telepon wajib diisi.';
        if (!form.poli_id) errs.poli_id = 'Poli wajib dipilih.';
        if (!form.specialization.trim()) errs.specialization = 'Spesialisasi wajib diisi.';
        if (!form.str_number.trim()) errs.str_number = 'Nomor STR wajib diisi.';

        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        
        const payload = new FormData();
        payload.append('name', form.name);
        payload.append('email', form.email);
        if (form.password) payload.append('password', form.password);
        payload.append('phone', form.phone);
        payload.append('is_active', form.is_active ? '1' : '0');
        payload.append('poli_id', form.poli_id);
        payload.append('specialization', form.specialization);
        payload.append('str_number', form.str_number);
        if (avatar) {
            payload.append('avatar', avatar);
        }

        if (isEdit) {
            payload.append('_method', 'put');
            router.post(route('admin.doctors.update', doctor!.id), payload, {
                onSuccess: () => { onClose(); },
                onError: (e) => { setErrors(e as Record<string, string>); setSubmitting(false); },
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post(route('admin.doctors.store'), payload, {
                onSuccess: () => { onClose(); },
                onError: (e) => { setErrors(e as Record<string, string>); setSubmitting(false); },
                onFinish: () => setSubmitting(false),
            });
        }
    };

    return (
        <FormSheet
            open={open}
            onOpenChange={(val) => !val && onClose()}
            title="Input Data Dokter"
            description="Lengkapi formulir di bawah ini dengan informasi yang valid."
            icon={UserPlus}
            footer={
                <Button onClick={handleSubmit} disabled={submitting} className="w-full py-6 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    {submitting ? 'Menyimpan...' : 'Simpan Data'}
                </Button>
            }
        >
            <div className="space-y-5">
                {/* Image Upload Placeholder */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-6 border-2 border-dashed border-outline-variant/40 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-surface-container/50 transition-colors relative overflow-hidden"
                >
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAvatarChange}
                    />
                    {avatarPreview ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary">
                            <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center text-on-surface-variant">
                            <Camera className="size-6" />
                        </div>
                    )}
                    <div className="text-center">
                        <p className="font-semibold text-sm text-on-surface">Unggah Foto Profil</p>
                        <p className="text-xs text-on-surface-variant mt-1">Format JPG, PNG atau WEBP (Maks 2MB)</p>
                    </div>
                </div>
                {errors.avatar && <p className="text-xs text-red-500 px-1">{errors.avatar}</p>}
                {/* Nama Lengkap & Gelar */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="name">
                        Nama Lengkap & Gelar
                    </label>
                    <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                        placeholder="Contoh: Dr. John Doe, Sp.M"
                        icon={User}
                        className={errors.name ? 'ring-2 ring-red-500' : ''}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1 px-1">{errors.name}</p>}
                </div>

                {/* Poli Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="poli_id">
                        Poli
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-on-surface-variant/50 pointer-events-none" />
                        <select
                            id="poli_id"
                            value={form.poli_id}
                            onChange={(e) => { 
                                setForm({ ...form, poli_id: e.target.value, specialization: '' }); 
                                setErrors({ ...errors, poli_id: '', specialization: '' }); 
                            }}
                            className={cn(
                                "w-full pl-11 pr-4 py-3 bg-surface-container/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface transition-all text-sm appearance-none",
                                errors.poli_id ? 'ring-2 ring-red-500' : ''
                            )}
                        >
                            <option value="" disabled>Pilih Poli</option>
                            {polis.map(poli => (
                                <option key={poli.id} value={poli.id}>{poli.name}</option>
                            ))}
                        </select>
                    </div>
                    {errors.poli_id && <p className="text-xs text-red-500 mt-1 px-1">{errors.poli_id}</p>}
                </div>

                {/* Spesialisasi */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="specialization">
                        Spesialisasi
                    </label>
                    <div className="relative">
                        <BriefcaseMedical className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-on-surface-variant/50 pointer-events-none" />
                        <select
                            id="specialization"
                            value={form.specialization}
                            onChange={(e) => { setForm({ ...form, specialization: e.target.value }); setErrors({ ...errors, specialization: '' }); }}
                            className={cn(
                                "w-full pl-11 pr-4 py-3 bg-surface-container/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface transition-all text-sm appearance-none",
                                errors.specialization ? 'ring-2 ring-red-500' : ''
                            )}
                            disabled={!form.poli_id}
                        >
                            <option value="" disabled>{form.poli_id ? "Pilih Spesialisasi" : "Pilih Poli Terlebih Dahulu"}</option>
                            {(POLI_SPECIALIZATIONS[polis.find(p => String(p.id) === form.poli_id)?.name ?? ''] || DEFAULT_SPECIALIZATIONS).map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </div>
                    {errors.specialization && <p className="text-xs text-red-500 mt-1 px-1">{errors.specialization}</p>}
                </div>

                {/* STR Number */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="str_number">
                        Nomor Izin (STR)
                    </label>
                    <Input
                        id="str_number"
                        value={form.str_number}
                        onChange={(e) => { setForm({ ...form, str_number: e.target.value }); setErrors({ ...errors, str_number: '' }); }}
                        placeholder="Masukkan 16 digit nomor STR"
                        icon={BadgeCheck}
                        className={errors.str_number ? 'ring-2 ring-red-500' : ''}
                    />
                    {errors.str_number && <p className="text-xs text-red-500 mt-1 px-1">{errors.str_number}</p>}
                </div>

                {/* Email and Phone are kept but integrated smoothly since they are required by backend but hidden in hifi view. */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="phone">No. Telepon</label>
                        <Input id="phone" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }} placeholder="08xx..." icon={Phone} className={errors.phone ? 'ring-2 ring-red-500' : ''} />
                        {errors.phone && <p className="text-xs text-red-500 mt-1 px-1">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="email">Email</label>
                        <Input id="email" type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }} placeholder="email@contoh.com" icon={Mail} className={errors.email ? 'ring-2 ring-red-500' : ''} />
                        {errors.email && <p className="text-xs text-red-500 mt-1 px-1">{errors.email}</p>}
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="password">
                        Kata Sandi
                    </label>
                    <Input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                        placeholder="Minimal 8 karakter"
                        icon={Lock}
                        className={errors.password ? 'ring-2 ring-red-500' : ''}
                    />
                    {errors.password && <p className="text-xs text-red-500 mt-1 px-1">{errors.password}</p>}
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1">Status</label>
                    <div className="flex gap-3">
                        {[
                            { value: true, label: 'Aktif', color: 'bg-emerald-500' },
                            { value: false, label: 'Nonaktif', color: 'bg-slate-400' },
                        ].map(({ value, label, color }) => (
                            <button
                                key={String(value)}
                                type="button"
                                onClick={() => setForm({ ...form, is_active: value })}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all border-2",
                                    form.is_active === value ? "border-primary text-primary bg-white shadow-sm" : "border-outline-variant/20 bg-surface-container/30 text-on-surface-variant"
                                )}
                            >
                                <div className={`w-2 h-2 rounded-full ${color}`} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </FormSheet>
    );
}

/* ─────────────────────── Delete Confirm ────────────────────── */
interface DeleteConfirmProps {
    doctor: Doctor;
    onClose: () => void;
}

function DeleteConfirm({ doctor, onClose }: DeleteConfirmProps) {
    const [submitting, setSubmitting] = React.useState(false);

    const handleDelete = () => {
        setSubmitting(true);
        router.delete(route('admin.doctors.destroy', doctor.id), {
            onSuccess: onClose,
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200 p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="size-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-on-surface">Hapus Dokter</h2>
                        <p className="text-sm text-on-surface-variant mt-1">
                            Apakah Anda yakin ingin menghapus <span className="font-semibold text-on-surface">"{doctor.user.name}"</span>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-outline-variant/40 text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={submitting}
                        className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-60"
                    >
                        {submitting ? 'Menghapus...' : 'Ya, Hapus'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────── Main Page ─────────────────────────── */
const ITEMS_PER_PAGE = 8;

export default function Doctors() {
    const { props } = usePage<PageProps>();
    const { doctors, stats, polis } = props;

    const [search, setSearch] = React.useState('');
    const [filter, setFilter] = React.useState<'all' | 'active' | 'inactive'>('all');
    const [filterOpen, setFilterOpen] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [editDoctor, setEditDoctor] = React.useState<Doctor | null>(null);
    const [deleteDoctor, setDeleteDoctor] = React.useState<Doctor | null>(null);

    /* ── Filter & Search ── */
    const filtered = React.useMemo(() => {
        return doctors.filter((d) => {
            const matchSearch =
                d.user.name.toLowerCase().includes(search.toLowerCase()) ||
                d.specialization.toLowerCase().includes(search.toLowerCase()) ||
                d.user.email.toLowerCase().includes(search.toLowerCase()) ||
                (d.poli?.name ?? '').toLowerCase().includes(search.toLowerCase());
            const matchFilter =
                filter === 'all'
                    ? true
                    : filter === 'active'
                        ? d.user.is_active
                        : !d.user.is_active;
            return matchSearch && matchFilter;
        });
    }, [doctors, search, filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    React.useEffect(() => { setPage(1); }, [search, filter]);

    const openAdd = () => { setEditDoctor(null); setModalOpen(true); };
    const openEdit = (d: Doctor) => { setEditDoctor(d); setModalOpen(true); };

    return (
        <AppLayout>
            <Head title="Kelola Dokter" />

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-2">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">Kelola Dokter</h1>
                    <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                        Manajemen informasi tenaga medis dan kredensial klinik.
                    </p>
                </div>
                <button
                    id="btn-tambah-dokter"
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                    <Plus className="size-5" />
                    Tambah Dokter Baru
                </button>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                {[
                    {
                        label: 'Total Dokter',
                        value: stats.total,
                        icon: UserCircle,
                        bg: 'bg-primary/5',
                        color: 'text-primary',
                    },
                    {
                        label: 'Aktif',
                        value: stats.active,
                        icon: CheckCircle2,
                        bg: 'bg-emerald-50',
                        color: 'text-emerald-600',
                    },
                    {
                        label: 'Non Aktif',
                        value: stats.inactive,
                        icon: CircleOff,
                        bg: 'bg-slate-100',
                        color: 'text-slate-500',
                    },
                ].map(({ label, value, icon: Icon, bg, color }) => (
                    <div
                        key={label}
                        className="bg-white p-6 rounded-2xl border border-outline-variant/30 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center ${color} flex-shrink-0`}>
                            <Icon className="size-6" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">{label}</p>
                            <p className="text-3xl font-extrabold text-on-surface">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Search & Filter ── */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5">
                <div className="relative w-full sm:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant/50 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama dokter..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50 transition-all text-sm shadow-sm"
                    />
                </div>

                <div className="relative">
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        onBlur={() => setTimeout(() => setFilterOpen(false), 200)}
                        className="flex items-center gap-2 pl-4 pr-3 py-3 bg-white border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface font-semibold transition-all text-sm shadow-sm cursor-pointer hover:bg-surface-container/50"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant">
                            <line x1="21" y1="4" x2="14" y2="4"></line>
                            <line x1="10" y1="4" x2="3" y2="4"></line>
                            <line x1="21" y1="12" x2="12" y2="12"></line>
                            <line x1="8" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="20" x2="16" y2="20"></line>
                            <line x1="12" y1="20" x2="3" y2="20"></line>
                            <line x1="14" y1="2" x2="14" y2="6"></line>
                            <line x1="8" y1="10" x2="8" y2="14"></line>
                            <line x1="16" y1="18" x2="16" y2="22"></line>
                        </svg>
                        Filter
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant ml-2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    {filterOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-outline-variant/30 rounded-xl shadow-lg z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-100">
                            {[
                                { value: 'all', label: 'Semua' },
                                { value: 'active', label: 'Aktif' },
                                { value: 'inactive', label: 'Nonaktif' },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setFilter(opt.value as any); setFilterOpen(false); }}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 text-sm transition-colors",
                                        filter === opt.value
                                            ? "bg-primary/5 text-primary font-bold"
                                            : "text-on-surface hover:bg-surface-container/50"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-outline-variant/20">
                                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant">Poli</th>
                                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant">Nama Dokter</th>
                                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant">Spesialisasi</th>
                                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant">Nomor Izin (STR)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                                            <UserCircle className="size-10 opacity-30" />
                                            <p className="font-semibold text-sm">Tidak ada dokter yang ditemukan</p>
                                            <p className="text-xs opacity-70">Coba ubah filter atau kata kunci pencarian</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((doctor) => (
                                    <tr
                                        key={doctor.id}
                                        className="hover:bg-surface-container/30 transition-colors group"
                                    >
                                        {/* Poli */}
                                        <td className="px-6 py-5 align-middle">
                                            <span className="font-medium text-sm text-primary">
                                                {doctor.poli?.name ?? '—'}
                                            </span>
                                        </td>

                                        {/* Nama Dokter */}
                                        <td className="px-6 py-5 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary flex-shrink-0 overflow-hidden border border-primary/10">
                                                    {doctor.avatar_url ? (
                                                        <img src={doctor.avatar_url} alt={doctor.user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="size-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-on-surface text-sm">{doctor.user.name}</p>
                                                    <p className="text-xs text-on-surface-variant mt-0.5">
                                                        {doctor.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Spesialisasi */}
                                        <td className="px-6 py-5 align-middle text-sm text-on-surface-variant">
                                            {doctor.specialization}
                                        </td>

                                        {/* Nomor Izin (STR) */}
                                        <td className="px-6 py-5 align-middle text-sm text-on-surface-variant">
                                            {doctor.str_number}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-5 align-middle">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${doctor.user.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                                />
                                                <span
                                                    className={`text-xs font-bold ${doctor.user.is_active ? 'text-emerald-700' : 'text-slate-500'}`}
                                                >
                                                    {doctor.user.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-5 align-middle text-center">
                                            <button
                                                onClick={() => openEdit(doctor)}
                                                className="px-4 py-1.5 rounded-full border border-outline-variant/40 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                                            >
                                                Kelola
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                <div className="px-6 py-4 flex items-center justify-between bg-surface-container/10 border-t border-outline-variant/20">
                    <p className="text-xs font-semibold text-on-surface-variant">
                        Menampilkan {Math.min(paginated.length, ITEMS_PER_PAGE)} dari {filtered.length} Dokter
                    </p>
                    {totalPages > 1 && (
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setPage(n)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${page === n
                                            ? 'bg-primary text-white shadow-md shadow-primary/30'
                                            : 'border border-outline-variant/30 text-on-surface-variant hover:text-primary'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modals ── */}
            <DoctorModal
                open={modalOpen}
                doctor={editDoctor}
                polis={polis}
                onClose={() => { setModalOpen(false); setEditDoctor(null); }}
            />
            {deleteDoctor && (
                <DeleteConfirm
                    doctor={deleteDoctor}
                    onClose={() => setDeleteDoctor(null)}
                />
            )}
        </AppLayout>
    );
}