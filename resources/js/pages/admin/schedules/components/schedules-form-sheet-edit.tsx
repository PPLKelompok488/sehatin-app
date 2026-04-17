import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { SchedulesFormSheet } from './schedules-form-sheet';
import { SchedulesFormData, validateSchedule } from '../schema/schedules.schema';
import { SchedulesSession } from './schedules-session-card';

interface Doctor {
    id: number;
    name: string;
    avatar_url?: string;
    specialization: string;
}

interface SchedulesFormSheetEditProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    doctors: Doctor[];
    session: SchedulesSession | null;
}

export function SchedulesFormSheetEdit({ open, onOpenChange, doctors, session }: SchedulesFormSheetEditProps) {
    const { data, setData, put, processing, errors, setError, clearErrors, reset } = useForm<SchedulesFormData>({
        day_of_week: session?.day_of_week ?? 'Senin',
        start_time: session?.start_time ?? '09:00',
        end_time: session?.end_time ?? '12:00',
        slot_duration: session?.slot_duration ?? 30,
        is_active: session?.is_active ?? true,
        doctor_ids: session?.doctors?.map(d => Number(d.id)) ?? [],
        old_day_of_week: session?.day_of_week,
        old_start_time: session?.start_time,
        old_end_time: session?.end_time,
        old_slot_duration: session?.slot_duration,
    });


    React.useEffect(() => {
        if (open && session) {
            setData({
                day_of_week: session.day_of_week,
                start_time: session.start_time,
                end_time: session.end_time,
                slot_duration: session.slot_duration,
                is_active: session.is_active,
                doctor_ids: session.doctors?.map(d => Number(d.id)) ?? [],
                old_day_of_week: session.day_of_week,
                old_start_time: session.start_time,
                old_end_time: session.end_time,
                old_slot_duration: session.slot_duration,
            });
            clearErrors();
        }
    }, [open, session, setData, clearErrors]);

    const isUnchanged = React.useMemo(() => {
        if (!session) return true;

        const normalizeTime = (t: string) => (t || '').slice(0, 5);

        const currentDoctors = [...data.doctor_ids].map(Number).sort();
        const initialDoctors = (session.doctors?.map(d => d.id) ?? []).map(Number).sort();

        return (
            data.day_of_week === session.day_of_week &&
            normalizeTime(data.start_time) === normalizeTime(session.start_time) &&
            normalizeTime(data.end_time) === normalizeTime(session.end_time) &&
            data.slot_duration === session.slot_duration &&
            data.is_active === session.is_active &&
            JSON.stringify(currentDoctors) === JSON.stringify(initialDoctors)
        );
    }, [data, session]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (session && validateSchedule(data, setError as (key: keyof SchedulesFormData, message: string) => void, clearErrors as (key?: keyof SchedulesFormData) => void)) {
            put(route('admin.schedules.update', session.id), {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };


    return (
        <SchedulesFormSheet
            open={open}
            onOpenChange={onOpenChange}
            doctors={doctors}
            title="Edit Jadwal Praktik"
            description="Perbarui informasi rotasi tenaga medis untuk sesi ini."
            submitLabel="Simpan Perubahan"
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={handleSubmit}
            submitDisabled={isUnchanged}
        />
    );
}

