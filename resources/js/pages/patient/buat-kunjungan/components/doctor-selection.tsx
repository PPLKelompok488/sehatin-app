import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Clock, Timer } from 'lucide-react';
import * as React from 'react';

interface Schedule {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
}

interface Doctor {
    id: number;
    user: {
        name: string;
    };
    avatar_url?: string;
    specialization: string;
    schedules: Schedule[];
}

interface BookedSlot {
    doctor_id: number;
    date: string;
    time: string;
}

interface DoctorSelectionProps {
    doctors: Doctor[];
    selectedDate: Date | null;
    selectedDayName: string | null;
    bookedSlots: BookedSlot[];
    selectedDoctorId: number | null;
    onDoctorSelect: (id: number) => void;
    selectedTime: string | null;
    onTimeSelect: (time: string) => void;
}

export default function DoctorSelection({
    doctors,
    selectedDate,
    selectedDayName,
    bookedSlots,
    selectedDoctorId,
    onDoctorSelect,
    selectedTime,
    onTimeSelect,
}: DoctorSelectionProps) {
    const allActiveScheduleIds = React.useMemo(() => {
        if (!selectedDayName) return [];
        const ids: string[] = [];
        doctors.forEach(doctor => {
            doctor.schedules.forEach(schedule => {
                if (schedule.day_of_week === selectedDayName) {
                    ids.push(`${doctor.id}-${schedule.id}`);
                }
            });
        });
        return ids;
    }, [doctors, selectedDayName]);

    const getTimeSlots = (schedule: Schedule) => {
        const slots = [];
        const [startHours, startMinutes] = schedule.start_time.split(':').map(Number);
        const [endHours, endMinutes] = schedule.end_time.split(':').map(Number);

        let current = new Date();
        current.setHours(startHours, startMinutes, 0, 0);

        const stop = new Date();
        stop.setHours(endHours, endMinutes, 0, 0);

        while (current < stop) {
            slots.push(current.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).replace('.', ':'));
            current = new Date(current.getTime() + schedule.slot_duration * 60000);
        }
        return slots;
    };

    const isSlotBooked = (doctorId: number, date: Date | null, time: string) => {
        if (!date) return false;
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return bookedSlots.some(
            slot => Number(slot.doctor_id) === doctorId && slot.date === dateStr && slot.time === time
        );
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-on-surface-variant">Dokter Tersedia</h3>
            </div>

            <Accordion type="multiple" defaultValue={allActiveScheduleIds} className="w-full space-y-4">
                {doctors.map((doctor) => {
                    const activeSchedules = doctor.schedules.filter(s => s.day_of_week === selectedDayName);
                    return activeSchedules.map((schedule) => {
                        const itemId = `${doctor.id}-${schedule.id}`;
                        const slots = getTimeSlots(schedule);

                        return (
                            <AccordionItem
                                key={itemId}
                                value={itemId}
                                className={cn(
                                    "border transition-all duration-300",
                                    selectedDoctorId === doctor.id && selectedTime && slots.includes(selectedTime)
                                        ? "border-primary shadow-lg shadow-primary/5"
                                        : "border-border hover:border-border/80"
                                )}
                            >
                                <AccordionTrigger className="hover:no-underline [&>svg]:size-5 [&>svg]:text-on-surface-variant/40">
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <Avatar className="size-10 transition-all hover:opacity-80 border-none ring-0">
                                                <AvatarImage src={doctor.avatar_url || ''} alt={doctor.user.name} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {getInitials(doctor.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3.5 h-3.5 rounded-full border-3 border-white"></div>
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="font-bold text-lg text-on-surface">Dr. {doctor.user.name}</span>
                                            <div className="flex items-center gap-3 text-sm text-on-surface-variant/80 font-medium">
                                                <span>{doctor.specialization}</span>
                                                <span className="w-1 h-1 rounded-full bg-border"></span>
                                                <div className="flex items-center gap-1.5 bg-primary px-3 py-1 rounded-full text-white text-[10px]">
                                                    <Clock className="size-3" />
                                                    <span>{schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-medium text-on-surface-variant/60 flex items-center gap-1.5">
                                                <Timer className="size-3.5" />
                                                Waktu konsultasi ({schedule.slot_duration} menit)
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
                                            {slots.map((slot) => {
                                                const isSelectedTime = selectedTime === slot && selectedDoctorId === doctor.id;
                                                const isBooked = isSlotBooked(doctor.id, selectedDate, slot);

                                                return (
                                                    <button
                                                        key={slot}
                                                        disabled={isBooked}
                                                        onClick={() => {
                                                            if (isSelectedTime) {
                                                                onDoctorSelect(-1);
                                                                onTimeSelect('');
                                                            } else {
                                                                onDoctorSelect(doctor.id);
                                                                onTimeSelect(slot);
                                                            }
                                                        }}
                                                        className={cn(
                                                            "py-2.5 px-2 rounded-lg text-sm font-bold border cursor-pointer",
                                                            isSelectedTime
                                                                ? "bg-primary border-primary text-on-primary"
                                                                : isBooked
                                                                    ? "bg-muted opacity-50 border-muted/50 hover:border-muted cursor-not-allowed grayscale-[1]"
                                                                    : "bg-white border-border text-on-surface hover:border-primary/40"
                                                        )}
                                                    >
                                                        {slot}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    });
                })}
            </Accordion>
        </div>
    );
}
