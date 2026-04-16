import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Plus, Timer, Trash2, X } from 'lucide-react';
import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { ScheduleFormData, validateSchedule } from '../schema/schedules.schema';
import { cn } from '@/lib/utils';

interface Doctor {
    id: number;
    name: string;
    avatar_url?: string;
    specialization: string;
}

interface ScheduleFormDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    doctors: Doctor[];
}

const DURATIONS = [15, 20, 30, 45, 60];
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export function ScheduleFormDrawer({ open, onOpenChange, doctors }: ScheduleFormDrawerProps) {
    const { data, setData, post, processing, errors, setError, clearErrors, reset } = useForm<ScheduleFormData>({
        day_of_week: 'Senin',
        start_time: '09:00',
        end_time: '12:00',
        slot_duration: 30,
        is_active: true,
        doctor_ids: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateSchedule(data, setError as any, clearErrors as any)) {
            post(route('admin.schedules.store'), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    const toggleDoctor = (doctorId: number) => {
        const currentIds = [...data.doctor_ids];
        const index = currentIds.indexOf(doctorId);
        if (index > -1) {
            currentIds.splice(index, 1);
        } else {
            currentIds.push(doctorId);
        }
        setData('doctor_ids', currentIds);
    };

    const selectedDoctors = doctors.filter(d => data.doctor_ids.includes(d.id));

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right" dismissible={false}>
            <DrawerContent side="right">
                <form onSubmit={handleSubmit} className="flex h-full flex-col">
                    <DrawerHeader className="border-b border-outline-variant/30 pb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Calendar className="size-6" />
                            </div>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <X className="size-5" />
                                </Button>
                            </DrawerClose>
                        </div>
                        <DrawerTitle className="font-headline text-3xl font-bold tracking-tight text-on-surface">Tambah Jadwal Praktik</DrawerTitle>
                        <DrawerDescription className="text-on-surface-variant font-medium">
                            Sesuai hari operasional dan rotasi tenaga medis.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Hari Praktik */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-on-surface-variant px-1">Hari Praktik</Label>
                            <Select 
                                value={data.day_of_week} 
                                onValueChange={(v) => setData('day_of_week', v)}
                            >
                                <SelectTrigger 
                                    icon={Calendar} 
                                    className={cn(
                                        "h-12 rounded-lg bg-surface-container border-2 border-transparent focus:border-primary focus:bg-white transition-all",
                                        errors.day_of_week && "ring-2 ring-destructive border-destructive"
                                    )}
                                >
                                    <SelectValue placeholder="Pilih Hari" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DAYS.map((day) => (
                                        <SelectItem key={day} value={day}>{day}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.day_of_week && <p className="text-destructive text-xs mt-1 px-1">{errors.day_of_week}</p>}
                        </div>

                        {/* Waktu Mulai & Selesai */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-on-surface-variant px-1">Waktu Mulai</Label>
                                <Input 
                                    type="time" 
                                    icon={Clock}
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                    className={cn(
                                        "h-12 rounded-lg bg-surface-container border-2 border-transparent focus-visible:border-primary focus-visible:bg-white transition-all text-on-surface",
                                        "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:left-0",
                                        errors.start_time && "ring-2 ring-destructive border-destructive"
                                    )}
                                />
                                {errors.start_time && <p className="text-destructive text-xs mt-1 px-1">{errors.start_time}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-on-surface-variant px-1">Waktu Selesai</Label>
                                <Input 
                                    type="time" 
                                    icon={Clock}
                                    value={data.end_time}
                                    onChange={e => setData('end_time', e.target.value)}
                                    className={cn(
                                        "h-12 rounded-lg bg-surface-container border-2 border-transparent focus-visible:border-primary focus-visible:bg-white transition-all text-on-surface",
                                        "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:left-0",
                                        errors.end_time && "ring-2 ring-destructive border-destructive"
                                    )}
                                />
                                {errors.end_time && <p className="text-destructive text-xs mt-1 px-1">{errors.end_time}</p>}
                            </div>
                        </div>

                        {/* Durasi */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-on-surface-variant px-1">Durasi Per Pasien</Label>
                            <Select 
                                value={data.slot_duration.toString()} 
                                onValueChange={(v) => setData('slot_duration', parseInt(v))}
                            >
                                <SelectTrigger 
                                    icon={Timer} 
                                    className={cn(
                                        "h-12 rounded-lg bg-surface-container border-2 border-transparent focus:border-primary focus:bg-white transition-all",
                                        errors.slot_duration && "ring-2 ring-destructive border-destructive"
                                    )}
                                >
                                    <SelectValue placeholder="Pilih Durasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DURATIONS.map((d) => (
                                        <SelectItem key={d} value={d.toString()}>{d} Menit</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.slot_duration && <p className="text-destructive text-xs mt-1 px-1">{errors.slot_duration}</p>}
                        </div>

                        {/* Tenaga Medis */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-on-surface-variant px-1">Tenaga Medis Terdaftar</Label>
                            <div className="space-y-3">
                                {selectedDoctors.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg bg-surface-container border-2 border-transparent animate-in fade-in zoom-in-95 duration-200">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-10 rounded-lg">
                                                <AvatarImage src={doc.avatar_url} />
                                                <AvatarFallback>{doc.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-on-surface truncate uppercase tracking-tight">{doc.name}</p>
                                                <p className="text-xs text-on-surface-variant truncate">{doc.specialization}</p>
                                            </div>
                                        </div>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="size-8 rounded-full text-on-surface-variant/40 hover:text-destructive hover:bg-destructive/5"
                                            onClick={() => toggleDoctor(doc.id)}
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                                
                                <Select onValueChange={(v) => toggleDoctor(parseInt(v))}>
                                    <SelectTrigger className="h-12 rounded-lg bg-white border-2 border-dashed border-outline-variant/60 hover:border-primary hover:bg-primary/5 transition-all text-on-surface-variant/60 flex items-center justify-center gap-2">
                                        <Plus className="size-4" />
                                        <span>Tambah Dokter Ke Sesi</span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctors.filter(d => !data.doctor_ids.includes(d.id)).map((doc) => (
                                            <SelectItem key={doc.id} value={doc.id.toString()}>{doc.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {errors.doctor_ids && <p className="text-destructive text-xs mt-1 px-1">{errors.doctor_ids}</p>}
                        </div>

                        {/* Status Sesi */}
                        <div className="space-y-2 pb-6">
                            <Label className="text-sm font-semibold text-on-surface-variant px-1">Status Sesi</Label>
                            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-lg bg-surface-container border-2 border-transparent">
                                <button
                                    type="button"
                                    onClick={() => setData('is_active', true)}
                                    className={cn(
                                        "flex h-11 items-center justify-center gap-2 rounded-md text-sm font-bold transition-all",
                                        data.is_active ? "bg-white text-primary shadow-sm ring-2 ring-primary/10" : "text-on-surface-variant/60 hover:text-on-surface"
                                    )}
                                >
                                    <span className={cn("size-2 rounded-full", data.is_active ? "bg-primary" : "bg-outline-variant")} />
                                    Aktif
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('is_active', false)}
                                    className={cn(
                                        "flex h-11 items-center justify-center gap-2 rounded-md text-sm font-bold transition-all",
                                        !data.is_active ? "bg-white text-destructive shadow-sm ring-2 ring-destructive/10" : "text-on-surface-variant/60 hover:text-on-surface"
                                    )}
                                >
                                    <span className={cn("size-2 rounded-full", !data.is_active ? "bg-destructive" : "bg-outline-variant")} />
                                    Nonaktif
                                </button>
                            </div>
                        </div>
                    </div>

                    <DrawerFooter className="border-t border-outline-variant/30 bg-surface-container-lowest/50 p-6 flex flex-col gap-3">
                        <Button type="submit" size="lg" disabled={processing} className="w-full">
                            Simpan Perubahan
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                            <DrawerClose asChild>
                                <Button type="button" variant="secondary" size="lg" className="w-full">
                                    Batal
                                </Button>
                            </DrawerClose>
                            <Button type="button" variant="ghost" size="lg" className="w-full text-destructive hover:bg-destructive/5 transition-colors gap-2">
                                <Trash2 className="size-4" />
                                Hapus Sesi
                            </Button>
                        </div>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
