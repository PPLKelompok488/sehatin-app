import { cn } from '@/lib/utils';
import { CheckCircle2, Info, Baby, Stethoscope, BriefcaseMedical } from 'lucide-react';
import * as React from 'react';

const POLIS = [
    {
        id: 'umum',
        name: 'Poli Umum',
        description: 'Layanan pemeriksaan kesehatan menyeluruh dan konsultasi awal medis.',
        icon: Stethoscope,
    },
    {
        id: 'gigi',
        name: 'Poli Gigi',
        description: 'Perawatan kesehatan mulut, pembersihan karang gigi, dan penambalan.',
        icon: BriefcaseMedical,
    },
    {
        id: 'anak',
        name: 'Poli Anak',
        description: 'Layanan kesehatan pediatrik untuk tumbuh kembang optimal sang buah hati.',
        icon: Baby,
    },
];

interface BuatKunjunganStep1Props {
    onSelect: (poliId: string) => void;
    selectedPoliId: string | null;
}

export default function BuatKunjunganStep1({ onSelect, selectedPoliId }: BuatKunjunganStep1Props) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Pilih Layanan Poliklinik</h2>
                <p className="text-on-surface-variant max-w-xl">
                    Silakan pilih spesialisasi atau poli yang sesuai dengan keluhan kesehatan Anda saat ini.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {POLIS.map((poli) => {
                    const isSelected = selectedPoliId === poli.id;
                    const Icon = poli.icon;

                    return (
                        <button
                            key={poli.id}
                            onClick={() => onSelect(poli.id)}
                            className={cn(
                                "group relative p-8 rounded-lg text-left overflow-hidden transition-all duration-300 cursor-pointer",
                                "border border-outline-variant/10",
                                isSelected && "ring-2 ring-primary bg-primary/5 border-primary/20 shadow-xl shadow-primary/5"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110",
                                isSelected ? "bg-primary/20" : "bg-primary/5"
                            )} />

                            <div className="w-14 h-14 rounded-xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                                <Icon className="size-8" />
                            </div>

                            <h3 className={cn(
                                "text-xl font-bold mb-2 transition-colors",
                                isSelected ? "text-primary" : "text-on-surface"
                            )}>
                                {poli.name}
                            </h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                {poli.description}
                            </p>

                            <div className={cn(
                                "mt-6 flex items-center gap-2 text-primary font-bold text-xs tracking-wider transition-opacity duration-300",
                                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}>
                                {isSelected ? (
                                    <>Terpilih <CheckCircle2 className="size-4" /></>
                                ) : (
                                    <>Pilih</>
                                )}
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
