import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { SchedulesFormSheet } from './schedules-form-sheet';
import { SchedulesFormData, validateSchedule } from '../schema/schedules.schema';

interface Doctor {
    id: number;
    name: string;
    avatar_url?: string;
    specialization: string;
}

interface SchedulesFormSheetAddProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    doctors: Doctor[];
}

export function SchedulesFormSheetAdd({ open, onOpenChange, doctors }: SchedulesFormSheetAddProps) {
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

    return (
        <SchedulesFormSheet
            open={open}
            onOpenChange={onOpenChange}
            doctors={doctors}
            title="Tambah Jadwal Praktik"
            description="Sesuai hari operasional dan rotasi tenaga medis."
            submitLabel="Simpan Perubahan"
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={handleSubmit}
        />
    );
}
