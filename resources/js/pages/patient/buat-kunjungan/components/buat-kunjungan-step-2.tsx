import { cn } from '@/lib/utils';
import { Check, Clock, CalendarDays } from 'lucide-react';
import CalendarPicker from './calendar-picker';

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

interface BuatKunjunganStep2Props {
    doctors: Doctor[];
    bookedSlots: BookedSlot[];
    selectedDate: Date | null;
    onDateSelect: (date: Date) => void;
    selectedDoctorId: number | null;
    onDoctorSelect: (id: number) => void;
    selectedTime: string | null;
    onTimeSelect: (time: string) => void;
}

export default function BuatKunjunganStep2({
    doctors,
    bookedSlots,
    selectedDate,
    onDateSelect,
    selectedDoctorId,
    onDoctorSelect,
    selectedTime,
    onTimeSelect,
}: BuatKunjunganStep2Props) {
    const indonesianDay = (date: Date) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[date.getDay()];
    };

    const selectedDayName = selectedDate ? indonesianDay(selectedDate) : null;

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

    const isSlotBooked = (doctorId: number, date: Date, time: string) => {
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return bookedSlots.some(
            slot => Number(slot.doctor_id) === doctorId && slot.date === dateStr && slot.time === time
        );
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
            {/* Header Section */}
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Pilih Dokter & Jadwal</h2>
                <p className="text-on-surface-variant max-w-xl">
                    Tentukan dokter pilihan Anda dan pilih waktu konsultasi yang tersedia.
                </p>
            </div>

            {/* Date Picker Component */}
            <CalendarPicker 
                selectedDate={selectedDate}
                onDateSelect={onDateSelect}
                onResetSelection={() => {
                    onDoctorSelect(-1);
                    onTimeSelect('');
                }}
            />

            {/* Doctor List Section */}
            {selectedDate && (
                <div className="space-y-8">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-on-surface-variant">Dokter Tersedia</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-8">
                        {doctors.map((doctor) => {
                            const activeSchedules = doctor.schedules.filter(s => s.day_of_week === selectedDayName);
                            if (activeSchedules.length === 0) return null;

                            return activeSchedules.map((schedule) => {
                                const slots = getTimeSlots(schedule);

                                return (
                                    <div 
                                        key={`${doctor.id}-${schedule.id}`}
                                        className={cn(
                                            "bg-white rounded-[2rem] p-8 flex flex-col md:flex-row gap-10 transition-all duration-500 border-2",
                                            selectedDoctorId === doctor.id && selectedTime && slots.includes(selectedTime)
                                                ? "border-primary shadow-2xl shadow-primary/10" 
                                                : "border-outline-variant/10 hover:border-primary/20"
                                        )}
                                    >
                                        {/* Doctor Identity */}
                                        <div className="flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left">
                                            <div className="relative group mb-4">
                                                <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-blue-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                                <img 
                                                    src={doctor.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user.name)}&background=random&color=fff&size=200`} 
                                                    alt={doctor.user.name}
                                                    className="relative w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl"
                                                />
                                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-xl text-on-surface leading-tight">{doctor.user.name}</h4>
                                                <p className="text-sm text-primary font-bold mt-1">{doctor.specialization}</p>
                                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-on-surface-variant bg-surface-container/50 px-4 py-2 rounded-full w-fit mx-auto md:mx-0">
                                                    <Clock className="size-3 text-primary" />
                                                    Sesi: {schedule.start_time.substring(0,5)} - {schedule.end_time.substring(0,5)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Time Slots Selection */}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-5">
                                                <p className="text-[10px] font-black text-on-surface-variant tracking-[0.2em] uppercase opacity-40">Waktu Konsultasi ({schedule.slot_duration} Menit)</p>
                                                {selectedDoctorId === doctor.id && selectedTime && slots.includes(selectedTime) && (
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                                        <Check className="size-3" /> Terpilih
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                                                {slots.map((slot) => {
                                                    const isSelectedTime = selectedTime === slot && selectedDoctorId === doctor.id;
                                                    const isBooked = isSlotBooked(doctor.id, selectedDate, slot);
                                                    
                                                    return (
                                                        <button
                                                            key={slot}
                                                            disabled={isBooked}
                                                            onClick={() => {
                                                                onDoctorSelect(doctor.id);
                                                                onTimeSelect(slot);
                                                            }}
                                                            className={cn(
                                                                "py-4 rounded-2xl text-sm font-bold transition-all duration-300 border-2",
                                                                isSelectedTime
                                                                    ? "bg-primary border-primary text-on-primary shadow-lg shadow-primary/30"
                                                                    : isBooked 
                                                                        ? "bg-surface-container/30 border-outline-variant/10 text-on-surface-variant/30 cursor-not-allowed italic"
                                                                        : "bg-surface border-outline-variant/5 text-on-surface hover:border-primary/40 hover:bg-primary/5 shadow-sm"
                                                            )}
                                                        >
                                                            {isBooked ? "Penuh" : slot}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                        })}

                        {/* Empty State for selected Day */}
                        {doctors.filter(d => d.schedules.some(s => s.day_of_week === selectedDayName)).length === 0 && (
                            <div className="py-24 text-center space-y-6 bg-surface-container/30 rounded-[3rem] border-2 border-dashed border-outline-variant/30 px-6">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                                    <CalendarDays className="size-10 text-on-surface-variant/20" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-on-surface text-xl font-black">Tidak Ada Jadwal Praktek</p>
                                    <p className="text-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                                        Maaf, tidak ada dokter yang tersedia untuk poliklinik ini pada hari {selectedDayName}. Silakan pilih tanggal lain.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Hint Initial State */}
            {!selectedDate && (
                <div className="py-20 text-center space-y-4 bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/10">
                    <CalendarDays className="size-12 text-primary/20 mx-auto" />
                    <p className="font-bold text-on-surface-variant">Pilih tanggal terlebih dahulu untuk melihat ketersediaan dokter</p>
                </div>
            )}
        </div>
    );
}
