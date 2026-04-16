import { ChevronRight, User } from 'lucide-react';

export interface ScheduleSession {
    id: number;
    doctor_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
    is_active: boolean;
    doctors?: {
        id: number;
        name: string;
        avatar_url?: string;
    }[];
}

interface ScheduleSessionCardProps {
    session: ScheduleSession;
    onClick?: () => void;
}

function formatTime(time: string): string {
    return time.slice(0, 5);
}

export function ScheduleSessionCard({ session, onClick }: ScheduleSessionCardProps) {
    const doctorCount = session.doctors?.length ?? 1;

    return (
        <button
            type="button"
            onClick={onClick}
            className="group w-full flex items-center justify-between gap-4 rounded-lg bg-primary/[0.06] px-6 py-5 text-left transition-all active:scale-[0.995] cursor-pointer"
        >
            <div className="flex flex-1 items-center min-w-0 flex-wrap sm:flex-nowrap">
                <div className="flex-1 min-w-[150px] pr-6">
                    <div className="text-xs font-semibold text-on-surface-variant/60 mb-1.5 capitalize">
                        Waktu Praktek
                    </div>
                    <p className="text-lg font-bold text-on-surface tracking-tight">
                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                    </p>
                </div>

                <div className="hidden sm:block h-10 w-px bg-on-surface-variant/10 mr-8" />

                <div className="flex-1 min-w-[150px] pr-6">
                    <div className="text-xs font-semibold text-on-surface-variant/60 mb-1.5 capitalize">
                        Durasi Konsultasi
                    </div>
                    <p className="text-lg font-bold text-on-surface tracking-tight">
                        {session.slot_duration} Menit
                    </p>
                </div>

                <div className="hidden sm:block h-10 w-px bg-on-surface-variant/10 mr-8" />

                <div className="flex-1 min-w-[150px]">
                    <div className="text-xs font-semibold text-on-surface-variant/60 mb-1.5 capitalize">
                        Dokter
                    </div>
                    <div className="flex items-center gap-2">
                        {session.doctors && session.doctors.length > 0 ? (
                            <div className="flex items-center">
                                <div className="flex -space-x-2.5">
                                    {session.doctors.slice(0, 3).map((doctor) => (
                                        <div
                                            key={doctor.id}
                                            className="size-9 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center overflow-hidden"
                                            title={doctor.name}
                                        >
                                            {doctor.avatar_url ? (
                                                <img
                                                    src={doctor.avatar_url}
                                                    alt={doctor.name}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <div className="size-full bg-primary/20 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-primary">
                                                        {doctor.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {doctorCount > 3 && (
                                        <div className="size-9 rounded-full border-2 border-white bg-muted flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-muted-foreground">
                                                +{doctorCount - 3}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="size-5 text-primary" />
                                </div>
                                <span className="text-base font-bold text-on-surface">
                                    {doctorCount} Dokter
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="ml-4 shrink-0">
                <ChevronRight className="size-6 text-on-surface-variant/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
        </button>
    );
}
