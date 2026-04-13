export interface RegisterFormData {
    [key: string]: string | undefined;
    nik: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    date_of_birth: string;
    gender: string;
    address: string;
    blood_type: string;
}

export type RegisterFieldName = keyof RegisterFormData;

export const validateStep1 = (
    data: RegisterFormData,
    setError: (key: RegisterFieldName, message: string) => void,
    clearErrors: (key?: RegisterFieldName) => void
): boolean => {
    clearErrors();
    let isValid = true;

    if (!data.name) {
        setError('name', 'Nama lengkap wajib diisi');
        isValid = false;
    }
    if (!data.email) {
        setError('email', 'Email wajib diisi');
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email || '')) {
        setError('email', 'Format email tidak valid');
        isValid = false;
    }
    if (!data.phone) {
        setError('phone', 'Nomor ponsel wajib diisi');
        isValid = false;
    }
    if (!data.password) {
        setError('password', 'Kata sandi wajib diisi');
        isValid = false;
    } else if ((data.password || '').length < 8) {
        setError('password', 'Kata sandi minimal 8 karakter');
        isValid = false;
    }
    if (!data.password_confirmation) {
        setError('password_confirmation', 'Konfirmasi sandi wajib diisi');
        isValid = false;
    } else if ((data.password_confirmation || '').length < 8) {
        setError('password_confirmation', 'Konfirmasi sandi minimal 8 karakter');
        isValid = false;
    }
    if (data.password !== data.password_confirmation) {
        setError('password_confirmation', 'Konfirmasi sandi tidak cocok');
        isValid = false;
    }

    return isValid;
};

export const validateStep2 = (
    data: RegisterFormData,
    setError: (key: RegisterFieldName, message: string) => void
): boolean => {
    let isValid = true;

    if (!data.nik) {
        setError('nik', 'NIK wajib diisi');
        isValid = false;
    } else if ((data.nik || '').length !== 16) {
        setError('nik', 'NIK harus 16 digit');
        isValid = false;
    }
    if (!data.date_of_birth) {
        setError('date_of_birth', 'Tanggal lahir wajib diisi');
        isValid = false;
    }
    if (!data.blood_type) {
        setError('blood_type', 'Golongan darah wajib diisi');
        isValid = false;
    }
    if (!data.gender) {
        setError('gender', 'Jenis kelamin wajib dipilih');
        isValid = false;
    }
    if (!data.address) {
        setError('address', 'Alamat wajib diisi');
        isValid = false;
    }

    return isValid;
};
