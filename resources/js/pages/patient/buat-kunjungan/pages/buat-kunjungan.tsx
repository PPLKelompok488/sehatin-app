import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Schedules() {
    return (
        <AppLayout>
            <Head title="Buat Kunjungan" />
            
            <PageHeader 
                title="Buat Kunjunganaaaaa"
                subtitle="Buat kunjungan. Atur ketersediaan dan jam layanan untuk memastikan pasien mendapatkan perawatan tepat waktu."
            />

            <div className="py-12 text-center text-on-surface-variant font-medium border-2 border-dashed border-outline-variant/30 rounded-3xl">
                Content Placeholder
            </div>
        </AppLayout>
    )
}



