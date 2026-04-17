import { PageHeader } from '@/components/page-header';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { CalendarOff} from 'lucide-react';
import {
    Empty,
    EmptyDescription,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { SchedulesFormSheetAdd } from '../components/schedules-form-sheet-add';
import { SchedulesFormSheetEdit } from '../components/schedules-form-sheet-edit';
import { SchedulesSessionCard, type SchedulesSession } from '../components/schedules-session-card';
import * as React from 'react';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'] as const;

interface Doctor {
    id: number; 
    name: string;
    avatar_url?: string;
    specialization: string;
}

interface Props {
    schedules: SchedulesSession[];
    doctors: Doctor[];
}

function groupByDay(schedules: SchedulesSession[]) {
    const grouped: Record<string, SchedulesSession[]> = {};
    for (const day of DAYS) {
        grouped[day] = schedules.filter((s) => s.day_of_week === day);
    }
    return grouped;
}

export default function Schedules({ schedules, doctors }: Props) {
    const grouped = groupByDay(schedules);
    const [addOpen, setAddOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [selectedSession, setSelectedSession] = React.useState<SchedulesSession | null>(null);

    const handleEdit = (session: SchedulesSession) => {
        setSelectedSession(session);
        setEditOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Jadwal Dokter" />

            <PageHeader
                title="Manajemen Jadwal Dokter"
                subtitle="Kelola jadwal praktik dokter. Atur jam operasional klinik dan rotasi praktek dokter."
                button={{
                    label: 'Tambah Jadwal',
                    onClick: () => setAddOpen(true),
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
                            <AccordionItem key={day} value={day}>
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
                                            <SchedulesSessionCard
                                                key={session.id}
                                                session={session}
                                                onClick={() => handleEdit(session)}
                                            />
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            )}

            <SchedulesFormSheetAdd 
                open={addOpen} 
                onOpenChange={setAddOpen} 
                doctors={doctors}
            />

            <SchedulesFormSheetEdit
                key={selectedSession ? `${selectedSession.id}-${selectedSession.doctors?.length ?? 0}` : 'none'}
                open={editOpen}
                onOpenChange={setEditOpen}
                doctors={doctors}
                session={selectedSession}
            />
        </AppLayout>
    );
}
