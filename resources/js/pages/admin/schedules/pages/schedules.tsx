import { PageHeader } from '@/components/page-header';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { CalendarOff } from 'lucide-react';
import {
    Empty,
    EmptyDescription,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    ScheduleSessionCard,
    type ScheduleSession,
} from '../components/schedule-session-card';

import { ScheduleFormDrawer } from '../components/schedule-form-drawer';
import * as React from 'react';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'] as const;

interface Doctor {
    id: number;
    name: string;
    avatar_url?: string;
    specialization: string;
}

interface Props {
    schedules: ScheduleSession[];
    doctors: Doctor[];
}

function groupByDay(schedules: ScheduleSession[]) {
    const grouped: Record<string, ScheduleSession[]> = {};
    for (const day of DAYS) {
        grouped[day] = schedules.filter((s) => s.day_of_week === day);
    }
    return grouped;
}

export default function Schedules({ schedules, doctors }: Props) {
    const grouped = groupByDay(schedules);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    return (
        <AppLayout>
            <Head title="Manajemen Jadwal Dr." />

            <PageHeader
                title="Manajemen Jadwal Dr."
                subtitle="Kelola jadwal praktik dokter. Atur ketersediaan dan jam layanan untuk memastikan pasien mendapatkan perawatan tepat waktu."
                button={{
                    label: 'Tambah Jadwal',
                    onClick: () => setDrawerOpen(true),
                    show: true,
                }}
            />

            {schedules.length === 0 ? (
                <Empty>
                    <EmptyMedia variant="icon">
                        <CalendarOff />
                    </EmptyMedia>
                    <EmptyTitle>Belum Ada Jadwal</EmptyTitle>
                    <EmptyDescription>
                        Saat ini belum ada jadwal praktik dokter yang terdaftar.
                        Atur ketersediaan dan jam layanan untuk memulai.
                    </EmptyDescription>
                </Empty>
            ) : (
                <Accordion
                    type="multiple"
                    defaultValue={['Senin']}
                    className="space-y-4"
                >
                    {DAYS.map((day) => {
                        const sessions = grouped[day];
                        if (sessions.length === 0) return null;

                        const activeCount = sessions.filter((s) => s.is_active).length;

                        return (
                            <AccordionItem key={day} value={day} className="rounded-none">
                                <AccordionTrigger>
                                    <div className="flex items-center gap-3">
                                        <span>{day}</span>
                                        {activeCount > 0 && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                                                <span className="size-1.5 rounded-full bg-primary" />
                                                {activeCount} Sesi Aktif
                                            </span>
                                        )}
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent>
                                    <div className="space-y-3">
                                        {sessions.map((session) => (
                                            <ScheduleSessionCard
                                                key={session.id}
                                                session={session}
                                            />
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            )}

            <ScheduleFormDrawer 
                open={drawerOpen} 
                onOpenChange={setDrawerOpen} 
                doctors={doctors} 
            />
        </AppLayout>
    );
}
