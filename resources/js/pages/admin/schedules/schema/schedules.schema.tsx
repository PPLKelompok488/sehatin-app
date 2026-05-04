export interface SchedulesFormData {
    [key: string]: string | number | boolean | number[] | undefined;
    day_of_week: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
    is_active: boolean;
    doctor_ids: number[];
    old_day_of_week?: string;
    old_start_time?: string;
    old_end_time?: string;
    old_slot_duration?: number;
}

export type SchedulesFieldName = keyof SchedulesFormData;

export const validateSchedule = (
    data: SchedulesFormData,
    setError: (key: keyof SchedulesFormData, message: string) => void,
    clearErrors: (key?: keyof SchedulesFormData) => void
): boolean => {
    clearErrors();
    let isValid = true;

    if (!data.day_of_week) {
        setError('day_of_week', 'Hari praktik wajib dipilih');
        isValid = false;
    }
    if (!data.start_time) {
        setError('start_time', 'Waktu mulai wajib diisi');
        isValid = false;
    }
    if (!data.end_time) {
        setError('end_time', 'Waktu selesai wajib diisi');
        isValid = false;
    }
    if (!data.slot_duration || data.slot_duration <= 0) {
        setError('slot_duration', 'Durasi konsultasi harus lebih dari 0');
        isValid = false;
    }
    if (!data.doctor_ids || data.doctor_ids.length === 0) {
        setError('doctor_ids', 'Minimal satu dokter harus dipilih');
        isValid = false;
    }

    return isValid;
};
