import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { FormSheet } from '@/components/ui/form-sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Activity,
    Baby,
    Bone,
    Brain,
    Building2,
    CheckCircle2,
    CircleOff,
    Dna,
    Ear,
    Eye,
    FileText,
    Heart,
    HeartPulse,
    Microscope,
    Pencil,
    Plus,
    Search,
    Stethoscope,
    Syringe,
    Trash2,
    X,
} from 'lucide-react';
import * as React from 'react';

/* ─────────────────────────── Types ─────────────────────────── */
interface Poli {
    id: number;
    name: string;
    icon: string | null;
    description: string | null;
    is_active: boolean;
    doctors_count: number;
}

interface Stats {
    total: number;
    active: number;
    inactive: number;
}

interface PageProps {
    polis: Poli[];
    stats: Stats;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

const AVAILABLE_ICONS = [
    { name: 'Stethoscope', icon: Stethoscope },
    { name: 'Brain', icon: Brain },
    { name: 'Baby', icon: Baby },
    { name: 'HeartPulse', icon: HeartPulse },
    { name: 'Activity', icon: Activity },
    { name: 'Heart', icon: Heart },
    { name: 'Bone', icon: Bone },
    { name: 'Eye', icon: Eye },
    { name: 'Ear', icon: Ear },
    { name: 'Microscope', icon: Microscope },
    { name: 'Dna', icon: Dna },
    { name: 'Syringe', icon: Syringe },
];

function getPoliIcon(iconName: string | null) {
    const found = AVAILABLE_ICONS.find(i => i.name === iconName);
    return found ? found.icon : Stethoscope;
}

/* ─────────────────────── Modal Component ───────────────────── */
interface PoliModalProps {
    poli?: Poli | null;
    open: boolean;
    onClose: () => void;
}

function PoliModal({ poli, open, onClose }: PoliModalProps) {
    const isEdit = !!poli;
    const [form, setForm] = React.useState({
        name: poli?.name ?? '',
        icon: poli?.icon ?? 'Stethoscope',
        description: poli?.description ?? '',
        is_active: poli?.is_active ?? true,
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [submitting, setSubmitting] = React.useState(false);

    // Update form when poli changes (for edit mode)
    React.useEffect(() => {
        if (open) {
            setForm({
                name: poli?.name ?? '',
                icon: poli?.icon ?? 'Stethoscope',
                description: poli?.description ?? '',
                is_active: poli?.is_active ?? true,
            });
            setErrors({});
        }
    }, [poli, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Nama poli wajib diisi.';
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        const payload = { ...form, is_active: form.is_active };

        if (isEdit) {
            router.put(route('admin.polis.update', poli!.id), payload, {
                onSuccess: () => { onClose(); },
                onError: (e) => { setErrors(e as Record<string, string>); setSubmitting(false); },
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post(route('admin.polis.store'), payload, {
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
            title={isEdit ? 'Edit Poli' : 'Tambah Poli Baru'}
            description={isEdit ? 'Perbarui informasi unit layanan kesehatan.' : 'Tambahkan unit layanan kesehatan baru.'}
            icon={isEdit ? Pencil : Plus}
            footer={
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1"
                    >
                        {submitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Poli'}
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="name">
                        Nama Poli <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                        placeholder="cth. Poli Umum, Poli Gigi..."
                        icon={Building2}
                        className={errors.name ? 'ring-2 ring-red-500' : ''}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1 px-1">{errors.name}</p>}
                </div>

                {/* Icon Selector */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-on-surface-variant px-1">
                        Pilih Icon Ilustrasi
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                        {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
                            <button
                                key={name}
                                type="button"
                                onClick={() => setForm({ ...form, icon: name })}
                                className={cn(
                                    "relative h-16 flex items-center justify-center rounded-2xl transition-all duration-200 border-2",
                                    form.icon === name
                                        ? "bg-blue-50 border-primary text-primary shadow-sm"
                                        : "bg-surface-container/50 border-transparent text-on-surface-variant/60 hover:bg-surface-container hover:text-on-surface-variant"
                                )}
                            >
                                <Icon className="size-7" />
                                {form.icon === name && (
                                    <div className="absolute top-1 right-1">
                                        <div className="bg-primary text-white rounded-full p-0.5">
                                            <CheckCircle2 className="size-3" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="description">
                        Deskripsi
                    </label>
                    <Textarea
                        id="description"
                        value={form.description ?? ''}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Deskripsi layanan poli ini..."
                        rows={4}
                        icon={FileText}
                        className="resize-none"
                    />
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1">Status</label>
                    <div className="flex gap-3 p-1 bg-surface-container rounded-xl">
                        {[
                            { value: true, label: 'Aktif', icon: CheckCircle2, activeClass: 'bg-white text-emerald-600 shadow-sm' },
                            { value: false, label: 'Nonaktif', icon: CircleOff, activeClass: 'bg-white text-slate-500 shadow-sm' },
                        ].map(({ value, label, icon: Icon, activeClass }) => (
                            <button
                                key={String(value)}
                                type="button"
                                onClick={() => setForm({ ...form, is_active: value })}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all hover:text-primary",
                                    form.is_active === value ? activeClass : "text-on-surface-variant"
                                )}
                            >
                                <Icon className="size-4" />
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
    poli: Poli;
    onClose: () => void;
}

function DeleteConfirm({ poli, onClose }: DeleteConfirmProps) {
    const [submitting, setSubmitting] = React.useState(false);

    const handleDelete = () => {
        setSubmitting(true);
        router.delete(route('admin.polis.destroy', poli.id), {
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
                        <h2 className="text-lg font-bold text-on-surface">Hapus Poli</h2>
                        <p className="text-sm text-on-surface-variant mt-1">
                            Apakah Anda yakin ingin menghapus <span className="font-semibold text-on-surface">"{poli.name}"</span>? Tindakan ini tidak dapat dibatalkan.
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

export default function Polis() {
    const { props } = usePage<PageProps>();
    const { polis, stats } = props;

    const [search, setSearch] = React.useState('');
    const [filter, setFilter] = React.useState<'all' | 'active' | 'inactive'>('all');
    const [page, setPage] = React.useState(1);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [editPoli, setEditPoli] = React.useState<Poli | null>(null);
    const [deletePoli, setDeletePoli] = React.useState<Poli | null>(null);

    /* ── Filter & Search ── */
    const filtered = React.useMemo(() => {
        return polis.filter((p) => {
            const matchSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.description ?? '').toLowerCase().includes(search.toLowerCase());
            const matchFilter =
                filter === 'all'
                    ? true
                    : filter === 'active'
                        ? p.is_active
                        : !p.is_active;
            return matchSearch && matchFilter;
        });
    }, [polis, search, filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // Reset to page 1 when search/filter changes
    React.useEffect(() => { setPage(1); }, [search, filter]);

    const openAdd = () => { setEditPoli(null); setModalOpen(true); };
    const openEdit = (p: Poli) => { setEditPoli(p); setModalOpen(true); };

    return (
        <AppLayout>
            <Head title="Kelola Poli" />

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-2">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">Kelola Poli</h1>
                    <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                        Manajemen unit layanan kesehatan dan spesialisasi klinis.
                    </p>
                </div>
                <button
                    id="btn-tambah-poli"
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                    <Plus className="size-5" />
                    Tambah Poli Baru
                </button>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                {[
                    {
                        label: 'Total Poli',
                        value: stats.total,
                        icon: Building2,
                        bg: 'bg-blue-50',
                        color: 'text-primary',
                    },
                    {
                        label: 'Poli Aktif',
                        value: stats.active,
                        icon: CheckCircle2,
                        bg: 'bg-emerald-50',
                        color: 'text-emerald-600',
                    },
                    {
                        label: 'Poli Tidak Aktif',
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
                {/* Search */}
                <div className="relative w-full sm:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant/50 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari unit spesialisasi..."
                        className="w-full pl-11 pr-4 py-3 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface placeholder:text-on-surface-variant/50 transition-all text-sm"
                    />
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
                    {(['all', 'active', 'inactive'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                        >
                            {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : 'Nonaktif'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-container/60">
                            <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">Nama Poli</th>
                            <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-on-surface-variant uppercase hidden md:table-cell">Deskripsi</th>
                            <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-on-surface-variant uppercase text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                                        <Stethoscope className="size-10 opacity-30" />
                                        <p className="font-semibold text-sm">Tidak ada poli yang ditemukan</p>
                                        <p className="text-xs opacity-70">Coba ubah filter atau kata kunci pencarian</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginated.map((poli) => (
                                <tr
                                    key={poli.id}
                                    className="hover:bg-surface-container/30 transition-colors group"
                                >
                                    {/* Name */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                                                {React.createElement(getPoliIcon(poli.icon), { className: "size-6" })}
                                            </div>
                                            <div>
                                                <p className="font-bold text-on-surface text-sm">{poli.name}</p>
                                                <p className="text-[11px] text-on-surface-variant mt-0.5">
                                                    {poli.doctors_count} dokter terdaftar
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Description */}
                                    <td className="px-6 py-5 text-sm text-on-surface-variant leading-relaxed max-w-sm hidden md:table-cell">
                                        <p className="line-clamp-2">{poli.description || '—'}</p>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-2 h-2 rounded-full ${poli.is_active ? 'bg-emerald-500' : 'bg-slate-300'
                                                    }`}
                                            />
                                            <span
                                                className={`text-xs font-bold ${poli.is_active ? 'text-emerald-700' : 'text-slate-500'
                                                    }`}
                                            >
                                                {poli.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-5">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(poli)}
                                                title="Edit"
                                                className="p-2 rounded-lg border border-outline-variant/30 hover:bg-blue-50 hover:border-blue-200 hover:text-primary text-on-surface-variant transition-colors"
                                            >
                                                <Pencil className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeletePoli(poli)}
                                                title="Hapus"
                                                className="p-2 rounded-lg border border-outline-variant/30 hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-on-surface-variant transition-colors"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* ── Pagination ── */}
                <div className="px-6 py-4 flex items-center justify-between bg-surface-container/10 border-t border-outline-variant/20">
                    <p className="text-xs font-semibold text-on-surface-variant">
                        Menampilkan {Math.min(paginated.length, ITEMS_PER_PAGE)} dari {filtered.length} Poli
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
            <PoliModal
                open={modalOpen}
                poli={editPoli}
                onClose={() => { setModalOpen(false); setEditPoli(null); }}
            />
            {deletePoli && (
                <DeleteConfirm
                    poli={deletePoli}
                    onClose={() => setDeletePoli(null)}
                />
            )}
        </AppLayout>
    );
}
