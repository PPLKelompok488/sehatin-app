import { AlertCircle } from 'lucide-react';
import * as React from 'react';
import CalendarPicker from './calendar-picker';
import DoctorSelection from './doctor-selection';

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

    const availableDays = React.useMemo(() => {
        const days = new Set<string>();
        doctors.forEach(doctor => {
            doctor.schedules.forEach(schedule => {
                days.add(schedule.day_of_week);
            });
        });
        return Array.from(days);
    }, [doctors]);

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
                availableDays={availableDays}
                onDateSelect={onDateSelect}
                onResetSelection={() => {
                    onDoctorSelect(-1);
                    onTimeSelect('');
                }}
            />

            {/* Doctor Selection Component */}
            {selectedDate && (
                <DoctorSelection
                    key={selectedDate.toISOString().split('T')[0]}
                    doctors={doctors}
                    selectedDate={selectedDate}
                    selectedDayName={selectedDayName}
                    bookedSlots={bookedSlots}
                    selectedDoctorId={selectedDoctorId}
                    onDoctorSelect={onDoctorSelect}
                    selectedTime={selectedTime}
                    onTimeSelect={onTimeSelect}
                />
            )}

            {!selectedDate && (
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary rounded-full text-on-primary text-sm font-medium">
                        <AlertCircle className="size-4" />
                        <span>Pastikan kamu memilih tanggal terlebih dahulu</span>
                    </div>
                </div>
            )}
        </div>
    );
}
