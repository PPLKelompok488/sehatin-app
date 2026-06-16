import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrandLogo } from '@/components/ui/brand-logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ToastHandler } from '@/components/toast-handler';
import { SharedData } from '@/types';
import { getInitials } from '@/lib/utils';
import { Link, usePage, router } from '@inertiajs/react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import {
    LayoutDashboard,
    Calendar,
    User,
    Stethoscope,
    Activity,
    PlusCircle,
    LogOut,
    Palette,
    Info,
    Upload,
    X,
    Plus,
} from 'lucide-react';
import * as React from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { props, url } = usePage<SharedData>();
    const { auth } = props;
    const user = auth.user;

    const [isThemeSheetOpen, setIsThemeSheetOpen] = React.useState(false);
    const [localPrimary, setLocalPrimary] = React.useState(props.themes?.primary_color || '#5ba7f7');
    const [localSecondary, setLocalSecondary] = React.useState(props.themes?.secondary_color || '#475569');
    const [logoPreview, setLogoPreview] = React.useState<string | null>(props.themes?.brand_logo || null);
    const [logoFile, setLogoFile] = React.useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const logoInputRef = React.useRef<HTMLInputElement>(null);
    const primaryInputRef = React.useRef<HTMLInputElement>(null);
    const secondaryInputRef = React.useRef<HTMLInputElement>(null);

    const primaryPresets = ['#5ba7f7', '#2563eb', '#10b981', '#f59e0b', '#ef4444'];
    const secondaryPresets = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];

    React.useEffect(() => {
        if (props.themes) {
            setLocalPrimary(props.themes.primary_color);
            setLocalSecondary(props.themes.secondary_color);
            setLogoPreview(props.themes.brand_logo);
        }
    }, [props.themes]);

    React.useEffect(() => {
        if (isThemeSheetOpen) {
            document.documentElement.style.setProperty('--primary', localPrimary);
            document.documentElement.style.setProperty('--secondary', localSecondary);
        }
    }, [localPrimary, localSecondary, isThemeSheetOpen]);

    const handleClose = () => {
        setIsThemeSheetOpen(false);
        document.documentElement.style.setProperty('--primary', props.themes?.primary_color || '#5ba7f7');
        document.documentElement.style.setProperty('--secondary', props.themes?.secondary_color || '#475569');
        setLocalPrimary(props.themes?.primary_color || '#5ba7f7');
        setLocalSecondary(props.themes?.secondary_color || '#475569');
        setLogoPreview(props.themes?.brand_logo || null);
        setLogoFile(null);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post(
            route('admin.theme.update'),
            {
                primary_color: localPrimary,
                secondary_color: localSecondary,
                brand_logo: logoFile,
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    setIsThemeSheetOpen(false);
                    setLogoFile(null);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };
    React.useEffect(() => {
        if (url === '/admin/theme') {
            setIsThemeSheetOpen(true);
        }
    }, [url]);

    const navItems = React.useMemo(() => {
        const role = user.role as 'admin' | 'doctor' | 'patient';
        const items = {
            patient: [
                { title: 'Kunjungan', url: '/patient/kunjungan', icon: Activity },
                { title: 'Buat Kunjungan', url: '/patient/buat-kunjungan', icon: PlusCircle },
            ],
            doctor: [
                { title: 'Jadwal Saya', url: '/doctor/schedule', icon: Calendar },
            ],
            admin: [
                { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
                { title: 'Poli', url: '/admin/polis', icon: Activity },
                { title: 'Dokter', url: '/admin/doctors', icon: Stethoscope },
                { title: 'Jadwal', url: '/admin/schedules', icon: Calendar },
                { title: 'Tema', url: '/admin/theme', icon: Palette },
            ],
        };
        return items[role] || [];
    }, [user.role]);

    return (
        <div className="min-h-screen bg-surface selection:bg-primary/10 selection:text-primary">
            <ToastHandler />

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 w-full bg-white border-b border-outline-variant/30 backdrop-blur-md">
                <div className="w-full px-4 sm:px-8 lg:px-12">
                    <div className="flex justify-between h-20">
                        {/* Left Section: Logo & Nav */}
                        <div className="flex items-center gap-8 lg:gap-12">
                            <Link href="/dashboard" className="flex-shrink-0 flex items-center group">
                                <BrandLogo size={9} className="transition-transform group-hover:scale-105" />
                            </Link>

                            <nav className="flex h-full gap-2 sm:gap-6 lg:gap-8">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = url === item.url || url.startsWith(item.url + '/');
                                    return (
                                        <Link
                                            key={item.url}
                                            href={item.url}
                                            className={`relative flex items-center h-full px-2 sm:px-1 text-sm transition-all duration-300 gap-2 ${isActive
                                                ? 'text-primary font-extrabold'
                                                : 'text-on-surface-variant hover:text-primary font-semibold'
                                                }`}
                                        >
                                            <Icon className={`size-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                            <span className="hidden sm:inline-block">{item.title}</span>
                                            {isActive && (
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(var(--primary-rgb),0.3)] animate-in fade-in slide-in-from-bottom-1" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Right Section: Profile */}
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-px bg-outline-variant/30 mx-2 hidden sm:block" />

                            <div className="flex items-center gap-4">
                                <div className="hidden lg:flex flex-col items-end">
                                    <span className="text-sm font-bold text-on-surface leading-none">{user.name}</span>
                                    <span className="text-[12px] font-bold text-on-surface-variant capitalize mt-1.5 opacity-60">
                                        {user.role}
                                    </span>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-3 p-1 rounded-full hover:bg-surface-container transition-all focus:outline-hidden ring-offset-2 focus:ring-2 focus:ring-primary/20 group">
                                            <Avatar className="size-10 transition-all hover:opacity-80 border-none ring-0">
                                                <AvatarImage src={user.avatar || ''} alt={user.name} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-3 py-4 mb-2 bg-surface-container/50 rounded-xl lg:hidden">
                                            <p className="font-bold text-on-surface leading-none">{user.name}</p>
                                            <p className="text-[10px] capitalize font-bold text-on-surface-variant mt-1.5 opacity-60 tracking-wider">
                                                {user.role}
                                            </p>
                                        </div>
                                        {user.role === 'patient' && (
                                            <DropdownMenuItem
                                                asChild
                                                className="rounded-xl gap-3 py-3 font-semibold cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
                                            >
                                                <Link href={route('patient.settings.profile')}>
                                                    <User className="size-4 opacity-70" />
                                                    Profil Saya
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        {user.role === 'admin' && (
                                            <>
                                                <DropdownMenuItem
                                                    asChild
                                                    className="rounded-xl gap-3 py-3 font-semibold cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
                                                >
                                                    <Link href={route('profile.edit')}>
                                                        <User className="size-4 opacity-70" />
                                                        Profil Saya
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setIsThemeSheetOpen(true)}
                                                    className="rounded-xl gap-3 py-3 font-semibold cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
                                                >
                                                    <Palette className="size-4 opacity-70" />
                                                    Kustomisasi Tema
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {user.role === 'doctor' && (
                                            <DropdownMenuItem
                                                asChild
                                                className="rounded-xl gap-3 py-3 font-semibold cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
                                            >
                                                <button type="button">
                                                    <User className="size-4 opacity-70" />
                                                    Profil Saya
                                                </button>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator className="my-2" />
                                        <DropdownMenuItem
                                            asChild
                                            className="rounded-xl gap-3 py-3 font-bold text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer transition-colors"
                                        >
                                            <Link href={route('logout')} method="post">
                                                <LogOut className="size-4 opacity-70" />
                                                Keluar Aplikasi
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {user.role === 'admin' && (
                                    <button
                                        onClick={() => setIsThemeSheetOpen(true)}
                                        className="hidden p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors md:flex items-center justify-center cursor-pointer"
                                        aria-label="Kustomisasi tema"
                                        title="Kustomisasi tema"
                                    >
                                        <Palette size={20} />
                                    </button>
                                )}

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    className="hidden p-2 text-on-surface-variant hover:text-red-500 hover:bg-surface-container rounded-full transition-colors md:flex items-center justify-center"
                                    aria-label="Keluar"
                                    title="Keluar"
                                >
                                    <LogOut size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
            </main>

            {/* Theme Customization Sheet for Admin */}
            {user.role === 'admin' && (
                <Sheet open={isThemeSheetOpen} onOpenChange={(open) => { if (!open) handleClose(); else setIsThemeSheetOpen(true); }}>
                    <SheetContent side="right" className="sm:max-w-md flex flex-col justify-between h-full p-8">
                        <div className="space-y-8 overflow-y-auto pr-1 flex-1">
                            <SheetHeader className="text-left space-y-1.5">
                                <div className="flex items-center gap-2 text-primary">
                                    <Palette className="size-5" />
                                    <SheetTitle className="text-lg font-bold text-slate-800">Kustomisasi Tema</SheetTitle>
                                </div>
                                <SheetDescription className="text-sm text-slate-500">
                                    Ubah logo dan skema warna untuk brand klinik Anda.
                                </SheetDescription>
                            </SheetHeader>

                            {/* Brand Logo Upload */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700">Logo Brand Klinik</label>
                                <input
                                    type="file"
                                    ref={logoInputRef}
                                    onChange={handleLogoChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div
                                    onClick={() => logoInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 hover:border-primary/50 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50"
                                >
                                    {logoPreview ? (
                                        <div className="relative flex flex-col items-center justify-center gap-2 py-2">
                                            <img src={logoPreview} alt="Logo brand" className="h-16 object-contain rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setLogoPreview(null);
                                                    setLogoFile(null);
                                                }}
                                                className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                                            >
                                                <X className="size-3" />
                                                hapus logo
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-2 text-slate-500 py-2">
                                            <div className="p-3 bg-white rounded-xl shadow-xs">
                                                <Upload className="size-5 text-slate-400" />
                                            </div>
                                            <span className="text-sm font-semibold">Klik untuk unggah logo</span>
                                            <span className="text-xs text-slate-400">Rekomendasi ukuran 256x256px (PNG/SVG)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Primary Color selection */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-slate-700">Warna Primer (Primary)</label>
                                    <span className="text-xs font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                        {localPrimary}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3 items-center">
                                    {primaryPresets.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setLocalPrimary(color)}
                                            style={{ backgroundColor: color }}
                                            className={`h-9 w-9 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                                                localPrimary.toLowerCase() === color.toLowerCase()
                                                    ? 'ring-2 ring-offset-2 ring-slate-900 shadow-sm'
                                                    : 'border border-slate-200/50'
                                            }`}
                                        />
                                    ))}
                                    {/* Render custom primary if not a preset */}
                                    {!primaryPresets.some((color) => color.toLowerCase() === localPrimary.toLowerCase()) && (
                                        <button
                                            type="button"
                                            onClick={() => primaryInputRef.current?.click()}
                                            style={{ backgroundColor: localPrimary }}
                                            className="h-9 w-9 rounded-full cursor-pointer transition-all duration-200 ring-2 ring-offset-2 ring-slate-900 shadow-sm"
                                        />
                                    )}
                                    {/* Custom picker trigger */}
                                    <button
                                        type="button"
                                        onClick={() => primaryInputRef.current?.click()}
                                        className="h-9 w-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-500 cursor-pointer"
                                        title="Pilih warna kustom"
                                    >
                                        <Plus className="size-4" />
                                    </button>
                                    <input
                                        type="color"
                                        ref={primaryInputRef}
                                        value={localPrimary}
                                        onChange={(e) => setLocalPrimary(e.target.value)}
                                        className="sr-only"
                                    />
                                </div>
                            </div>

                            {/* Secondary Color selection */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-slate-700">Warna Sekunder (Secondary)</label>
                                    <span className="text-xs font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                        {localSecondary}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3 items-center">
                                    {secondaryPresets.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setLocalSecondary(color)}
                                            style={{ backgroundColor: color }}
                                            className={`h-9 w-9 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                                                localSecondary.toLowerCase() === color.toLowerCase()
                                                    ? 'ring-2 ring-offset-2 ring-slate-900 shadow-sm'
                                                    : 'border border-slate-200/50'
                                            }`}
                                        />
                                    ))}
                                    {/* Render custom secondary if not a preset */}
                                    {!secondaryPresets.some((color) => color.toLowerCase() === localSecondary.toLowerCase()) && (
                                        <button
                                            type="button"
                                            onClick={() => secondaryInputRef.current?.click()}
                                            style={{ backgroundColor: localSecondary }}
                                            className="h-9 w-9 rounded-full cursor-pointer transition-all duration-200 ring-2 ring-offset-2 ring-slate-900 shadow-sm"
                                        />
                                    )}
                                    {/* Custom picker trigger */}
                                    <button
                                        type="button"
                                        onClick={() => secondaryInputRef.current?.click()}
                                        className="h-9 w-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-500 cursor-pointer"
                                        title="Pilih warna kustom"
                                    >
                                        <Plus className="size-4" />
                                    </button>
                                    <input
                                        type="color"
                                        ref={secondaryInputRef}
                                        value={localSecondary}
                                        onChange={(e) => setLocalSecondary(e.target.value)}
                                        className="sr-only"
                                    />
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex gap-3 text-xs text-blue-700 font-semibold leading-relaxed">
                                <Info className="size-5 shrink-0 text-blue-500 mt-0.5" />
                                <span>
                                    Perubahan warna akan mempengaruhi seluruh elemen visual di dashboard admin, termasuk tombol, link, dan indikator status.
                                </span>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-6 border-t border-slate-100 mt-6">
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full h-14 rounded-xl gap-2 font-bold transition-all hover:scale-[1.01]"
                            >
                                {isSubmitting ? 'menyimpan...' : 'Simpan & Terapkan Tema'}
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
}
