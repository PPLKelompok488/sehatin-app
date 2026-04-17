import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrandLogo } from '@/components/ui/brand-logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ToastHandler } from '@/components/toast-handler';
import { SharedData } from '@/types';
import { getInitials } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';

import { 
    LayoutDashboard, 
    Calendar, 
    User, 
    Stethoscope, 
    Activity, 
    PlusCircle,
    LogOut,
} from 'lucide-react';
import * as React from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { props, url } = usePage<SharedData>();
    const { auth } = props;
    const user = auth.user;

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
                                            className={`relative flex items-center h-full px-2 sm:px-1 text-sm transition-all duration-300 gap-2 ${
                                                isActive 
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
                                            <p className="text-[10px] uppercase font-bold text-on-surface-variant mt-1.5 opacity-60 tracking-wider">
                                                {user.role}
                                            </p>
                                        </div>
                                        <DropdownMenuItem className="rounded-xl gap-3 py-3 font-semibold cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">
                                            <User className="size-4 opacity-70" />
                                            Profil Saya
                                        </DropdownMenuItem>
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

                                <Link 
                                    href={route('logout')} 
                                    method="post"
                                    className="hidden p-2.5 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-xl transition-all md:flex items-center justify-center border border-transparent hover:border-red-100"
                                    title="Keluar"
                                >
                                    <LogOut className="size-5" />
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
        </div>
    );
}
