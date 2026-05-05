import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Jadwal() {
    return (
        <AppLayout>
            <Head title="Jadwal Saya" />
            
            <PageHeader 
                title="Jadwal Saya"
                subtitle="Lihat daftar pasien yang akan Anda tangani hari ini dan kelola waktu praktek Anda."
                button={{
                    label: "Kelola Jadwal",
                    show: false
                }}
            />

            <div className="py-12 text-center text-on-surface-variant font-medium border-2 border-dashed border-outline-variant/30 rounded-3xl">
                Content Placeholder
            </div>
        </AppLayout>
    );
}
