import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Kunjungan() {
    return (
        <AppLayout>
            <Head title="Kunjungan Anda" />
            
            <PageHeader 
                title="Kunjungan Anda"
                subtitle="Pantau jadwal konsultasi aktif dan tinjau kembali catatan medis dari kunjungan sebelumnya."
                button={{
                    label: "Tambah Kunjungan",
                    show: true,
                    href: route('patient.buat-kunjungan')
                }}
            />

            <div className="py-12 text-center text-on-surface-variant font-medium border-2 border-dashed border-outline-variant/30 rounded-3xl">
                Content Placeholder
            </div>
        </AppLayout>
    );
}
