import { Button } from '@/components/ui/button';
import { FormSheet } from '@/components/ui/form-sheet';
import { SheetClose } from '@/components/ui/sheet';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Clock, Plus, Timer, Trash2, X } from 'lucide-react';
import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { SchedulesFormData, validateSchedule } from '../schema/schedules.schema';
import { cn } from '@/lib/utils';

interface Doctor {
    id: number;
    name: string;
    avatar_url?: string;
    specialization: string;
}

interface SchedulesFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    doctors: Doctor[];
}

const DURATIONS = [15, 20, 30, 45, 60];
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export function SchedulesFormSheet({ open, onOpenChange, doctors }: SchedulesFormSheetProps) {
    const { data, setData, post, processing, errors, setError, clearErrors, reset } = useForm<SchedulesFormData>({
        day_of_week: 'Senin',
        start_time: '09:00',
        end_time: '12:00',
        slot_duration: 30,
        is_active: true,
        doctor_ids: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateSchedule(data, setError as (key: keyof SchedulesFormData, message: string) => void, clearErrors as (key?: keyof SchedulesFormData) => void)) {
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
        <FormSheet
            open={open}
            onOpenChange={onOpenChange}
            title="Tambah Jadwal Praktik"
            description="Sesuai hari operasional dan rotasi tenaga medis."
            icon={Calendar}
            footer={
                <div className="flex flex-col gap-4">
                    <Button type="submit" form="schedule-form" disabled={processing} className="w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-primary/20">
                        Simpan Perubahan
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                        <SheetClose asChild>
                            <Button type="button" variant="secondary" className="h-14 rounded-xl font-bold bg-surface-container hover:bg-outline-variant border-none">
                                Batal
                            </Button>
                        </SheetClose>
                        <Button type="button" variant="ghost" className="h-14 rounded-xl font-bold text-destructive hover:bg-destructive/5 transition-colors gap-2">
                            <Trash2 className="size-5" />
                            Hapus Sesi
                        </Button>
                    </div>
                </div>
            }
        >
            <form id="schedule-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Hari Praktik */}
                <div className="space-y-4">
                    <Label className="text-sm font-bold text-on-surface/80 px-1">Hari Praktik</Label>
                    <Select 
                        value={data.day_of_week} 
                        onValueChange={(v) => setData('day_of_week', v)}
                    >
                        <SelectTrigger 
                            icon={Calendar} 
                            className={cn(
                                "h-14 rounded-xl bg-surface-container border-2 border-transparent focus:border-primary focus:bg-white transition-all",
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
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Label className="text-sm font-bold text-on-surface/80 px-1">Waktu Mulai</Label>
                        <Input 
                            type="time" 
                            icon={Clock}
                            value={data.start_time}
                            onChange={e => setData('start_time', e.target.value)}
                            className={cn(
                                "h-14 rounded-xl bg-surface-container border-2 border-transparent focus-visible:border-primary focus-visible:bg-white transition-all text-on-surface",
                                "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:left-0",
                                errors.start_time && "ring-2 ring-destructive border-destructive"
                            )}
                        />
                        {errors.start_time && <p className="text-destructive text-xs mt-1 px-1">{errors.start_time}</p>}
                    </div>
                    <div className="space-y-4">
                        <Label className="text-sm font-bold text-on-surface/80 px-1">Waktu Selesai</Label>
                        <Input 
                            type="time" 
                            icon={Clock}
                            value={data.end_time}
                            onChange={e => setData('end_time', e.target.value)}
                            className={cn(
                                "h-14 rounded-xl bg-surface-container border-2 border-transparent focus-visible:border-primary focus-visible:bg-white transition-all text-on-surface",
                                "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:left-0",
                                errors.end_time && "ring-2 ring-destructive border-destructive"
                            )}
                        />
                        {errors.end_time && <p className="text-destructive text-xs mt-1 px-1">{errors.end_time}</p>}
                    </div>
                </div>

                {/* Durasi */}
                <div className="space-y-4">
                    <Label className="text-sm font-bold text-on-surface/80 px-1">Durasi Per Pasien</Label>
                    <Select 
                        value={data.slot_duration.toString()} 
                        onValueChange={(v) => setData('slot_duration', parseInt(v))}
                    >
                        <SelectTrigger 
                            icon={Timer} 
                            className={cn(
                                "h-14 rounded-xl bg-surface-container border-2 border-transparent focus:border-primary focus:bg-white transition-all",
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
                <div className="space-y-5">
                    <Label className="text-sm font-bold text-on-surface/80 px-1">Tenaga Medis Terdaftar</Label>
                    <div className="space-y-3">
                        {selectedDoctors.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-container border-2 border-transparent animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-11 rounded-lg">
                                        <AvatarImage src={doc.avatar_url} />
                                        <AvatarFallback className="bg-primary/5 text-primary font-bold">{doc.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-on-surface truncate">Dr. {doc.name}</p>
                                        <p className="text-xs text-on-surface-variant truncate font-medium">{doc.specialization}</p>
                                    </div>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-9 rounded-full text-on-surface-variant/40 hover:text-destructive hover:bg-destructive/5 transition-colors"
                                    onClick={() => toggleDoctor(doc.id)}
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                        ))}
                        
                        <Select 
                            key={data.doctor_ids.length}
                            onValueChange={(v) => toggleDoctor(parseInt(v))}
                        >
                            <SelectTrigger 
                                hideChevron 
                                className="h-14 rounded-xl border-2 border-dashed border-outline-variant/60 hover:border-primary hover:text-primary text-on-surface-variant/60 flex items-center justify-center gap-2 font-bold !border-dashed focus:ring-0 focus:ring-transparent"
                            >
                                <Plus className="size-4" />
                                <span className="font-bold text-on-surface/60 group-hover:text-primary transition-colors">Tambah Dokter Ke Sesi</span>
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.filter(d => !data.doctor_ids.includes(d.id)).map((doc) => (
                                    <SelectItem hideIndicator key={doc.id} value={doc.id.toString()}>{doc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {errors.doctor_ids && <p className="text-destructive text-xs mt-1 px-1">{errors.doctor_ids}</p>}
                </div>

                {/* Status Sesi */}
                <div className="space-y-4 pb-6">
                    <Label className="text-sm font-bold text-on-surface/80 px-1">Status Sesi</Label>
                    <RadioGroup
                        value={data.is_active ? 'aktif' : 'nonaktif'}
                        onValueChange={(v) => setData('is_active', v === 'aktif')}
                        className="flex gap-4"
                    >
                        <div className="flex-1">
                            <Label
                                htmlFor="status-aktif"
                                className={cn(
                                    "flex items-center justify-center gap-3 p-4 bg-surface-container rounded-xl cursor-pointer border-2 font-bold text-sm h-14",
                                    data.is_active ? "border-primary bg-white text-primary" : "border-transparent text-on-surface-variant/60"
                                )}
                            >
                                <RadioGroupItem value="aktif" id="status-aktif" className="sr-only" />
                                <span className={cn("size-2 rounded-full", data.is_active ? "bg-primary" : "bg-outline-variant")} />
                                Aktif
                            </Label>
                        </div>
                        <div className="flex-1">
                            <Label
                                htmlFor="status-nonaktif"
                                className={cn(
                                    "flex items-center justify-center gap-3 p-4 bg-surface-container rounded-xl cursor-pointer border-2 font-bold text-sm h-14",
                                    !data.is_active ? "border-destructive/50 bg-white text-destructive" : "border-transparent text-on-surface-variant/60"
                                )}
                            >
                                <RadioGroupItem value="nonaktif" id="status-nonaktif" className="sr-only" />
                                <span className={cn("size-2 rounded-full", !data.is_active ? "bg-destructive" : "bg-outline-variant")} />
                                Nonaktif
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </form>
        </FormSheet>
    );
}


