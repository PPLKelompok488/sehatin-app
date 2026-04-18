import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, CheckCircle2, Clock, CreditCard, Info, MapPin } from 'lucide-react';

interface Doctor {
    id: number;
    user: {
        name: string;
    };
    avatar_url?: string;
    specialization: string;
}

interface Poli {
    id: number;
    name: string;
}

interface BuatKunjunganStep3Props {
    patientName: string;
    selectedPoli: Poli | null;
    selectedDoctor: Doctor | null;
    selectedDate: Date | null;
    selectedTime: string | null;
}

export default function BuatKunjunganStep3({
    patientName,
    selectedPoli,
    selectedDoctor,
    selectedDate,
    selectedTime,
}: BuatKunjunganStep3Props) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const dayName = days[date.getDay()];
        return `${dayName}, ${date.getDate()} ${date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
                    Konfirmasi Kunjungan
                </h2>
                <p className="text-on-surface-variant max-w-xl">
                    Periksa kembali detail pemesanan Anda sebelum melakukan konfirmasi akhir.
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Summary Column */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-lg p-8 md:p-10 border border-border">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <CheckCircle2 className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-on-surface">
                                    Konfirmasi kunjungan
                                </h2>
                                <p className="text-sm text-on-surface-variant font-medium">
                                    Periksa kembali detail pemesanan Anda
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                            {/* Patient Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-on-surface-variant">
                                    Nama pasien
                                </label>
                                <p className="text-xl font-bold text-on-surface">{patientName}</p>
                            </div>

                            {/* Poli */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-on-surface-variant">
                                    Poliklinik
                                </label>
                                <p className="text-xl font-bold text-on-surface">
                                    {selectedPoli?.name || '-'}
                                </p>
                            </div>

                            {/* Doctor */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-on-surface-variant">
                                    Dokter pilihan
                                </label>
                                <div className="flex items-center gap-4 mt-1">
                                    {selectedDoctor ? (
                                        <>
                                            <Avatar className="size-12 rounded-full">
                                                <AvatarImage
                                                    src={selectedDoctor.avatar_url || ''}
                                                    alt={selectedDoctor.user.name}
                                                />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold rounded-full">
                                                    {getInitials(selectedDoctor.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-lg font-bold text-on-surface">
                                                    Dr. {selectedDoctor.user.name}
                                                </p>
                                                <p className="text-xs text-on-surface-variant">
                                                    {selectedDoctor.specialization}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-lg font-bold text-on-surface">-</p>
                                    )}
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-on-surface-variant">
                                    Jadwal konsultasi
                                </label>
                                <div className="bg-white rounded-lg p-0">
                                    <div className="flex items-center gap-3 text-primary mb-1">
                                        <CalendarDays className="size-4" />
                                        <p className="text-base font-bold">
                                            {formatDate(selectedDate)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 text-on-surface-variant pl-7">
                                        <span className="text-xs font-semibold">
                                            {selectedTime || '-'} WIB
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Warning Box */}
                        <div className="mt-12 p-6 rounded-lg border border-primary/10 flex items-start gap-4 bg-primary/5">
                            <Info className="size-5 text-orange-500 shrink-0" />
                            <div className="text-sm text-on-surface-variant leading-relaxed">
                                <p className="font-bold text-on-surface mb-1">Penting:</p>
                                Harap datang 15 menit sebelum jadwal pemeriksaan untuk proses
                                administrasi ulang di meja pendaftaran dengan membawa kartu
                                identitas.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info Column */}
                <aside className="lg:col-span-4 space-y-6">
                    {/* Payment Info */}
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-primary bg-white">
                            <CreditCard className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant">Pembayaran</p>
                            <p className="text-sm font-bold text-on-surface">
                                Kasir Klinik (Offline)
                            </p>
                        </div>
                    </div>

                    {/* Location Map */}
                    <div className="bg-white rounded-lg overflow-hidden border border-border">
                        <div className="h-36 relative">
                            <iframe
                                src="https://www.google.com/maps?q=Jl+Sudirman+Kav+21,Jakarta+Pusat&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Sehatin Clinic Center"
                                className="grayscale-[20%] hover:grayscale-0 transition-all duration-300"
                            />
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-bold text-on-surface">
                                Sehatin Clinic Center
                            </p>
                            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                                Jl. Sudirman Kav. 21, Jakarta Pusat, DKI Jakarta
                            </p>
                            <a
                                href="https://www.google.com/maps?q=Jl+Sudirman+Kav+21,Jakarta+Pusat"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-3 hover:underline"
                            >
                                <MapPin className="size-3" />
                                Buka di Google Maps
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
