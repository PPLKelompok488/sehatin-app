import { cn } from '@/lib/utils';
import { 
    CheckCircle2, 
    Info, 
    Baby, 
    Stethoscope, 
    BriefcaseMedical, 
    Activity, 
    Heart, 
    Brain, 
    HeartPulse,
    LucideIcon
} from 'lucide-react';

const IconMap: Record<string, LucideIcon> = {
    Stethoscope,
    Baby,
    BriefcaseMedical,
    Activity,
    Heart,
    Brain,
    HeartPulse,
};

interface Poli {
    id: number;
    name: string;
    description: string;
    icon: string;
}

interface BuatKunjunganStep1Props {
    onSelect: (poliId: string) => void;
    selectedPoliId: string | null;
    polis: Poli[];
}

export default function BuatKunjunganStep1({ onSelect, selectedPoliId, polis }: BuatKunjunganStep1Props) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Pilih Layanan Poliklinik</h2>
                <p className="text-on-surface-variant max-w-xl">
                    Silakan pilih spesialisasi atau poli yang sesuai dengan keluhan kesehatan Anda saat ini.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {polis.map((poli) => {
                    const isSelected = selectedPoliId === poli.id.toString();
                    const Icon = IconMap[poli.icon] || Stethoscope;

                    return (
                        <button
                            key={poli.id}
                            onClick={() => onSelect(poli.id.toString())}
                            className={cn(
                                "group relative p-8 rounded-lg text-left overflow-hidden transition-all duration-100 cursor-pointer",
                                "border border-outline-variant/10",
                                isSelected && "ring-2 ring-primary border-primary/20 shadow-xl shadow-primary/5"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-transform",
                                isSelected ? "bg-primary/20" : "bg-primary/5"
                            )} />

                            <div className="w-14 h-14 rounded-xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                                <Icon className="size-8" />
                            </div>

                            <h3 className={cn(
                                "text-xl font-bold mb-2 transition-colors",
                                isSelected ? "text-primary" : "text-on-surface"
                            )}>
                                <div className="flex items-center gap-2">
                                    {poli.name}
                                    {isSelected && (
                                        <CheckCircle2 className="size-4" />
                                    )}
                                </div>
                            </h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                {poli.description}
                            </p>

                            <div className={cn(
                                "mt-6 flex items-center gap-2 text-primary font-bold text-xs tracking-wider transition-opacity duration-300",
                                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}>

                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="p-6 rounded-lg flex items-start gap-4 border border-outline-variant/10">
                <Info className="size-6 text-primary shrink-0" />
                <div>
                    <h4 className="font-bold text-on-surface-variant text-sm">Informasi Penting</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Pastikan Anda membawa kartu identitas (KTP/KIA) saat kunjungan. Untuk pasien asuransi, harap siapkan dokumen pendukung sebelum jadwal pemeriksaan.
                    </p>
                </div>
            </div>
        </div>
    );
}
