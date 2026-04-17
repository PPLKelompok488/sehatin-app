import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface BuatKunjunganFooterProps {
    step: number;
    onNext: () => void;
    onPrevious: () => void;
    canNext: boolean;
}

export function BuatKunjunganFooter({ step, onNext, onPrevious, canNext }: BuatKunjunganFooterProps) {
    const stepConfigs = [
        { title: 'Pilih poliklinik tujuan', nextLabel: 'Pilih Dokter' },
        { title: 'Pilih dokter & jam praktek', nextLabel: 'Lanjut Konfirmasi' },
        { title: 'Konfirmasi pesanan kunjungan', nextLabel: 'Buat Kunjungan' },
    ];

    const currentConfig = stepConfigs[step - 1] || stepConfigs[0];

    return (
        <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-outline-variant/30 z-40">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="hidden md:block">
                    <p className="text-xs text-on-surface-variant font-bold opacity-60">Langkah {step} dari 3</p>
                    <p className="font-headline font-extrabold text-on-surface text-xl">
                        {currentConfig.title}
                    </p>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto">
                    <Link 
                        href="/patient/kunjungan"
                        className="flex-1 md:flex-none text-center text-on-surface-variant font-bold text-sm hover:text-red-500 transition-colors"
                    >
                        Batal
                    </Link>
                    
                    <div className="flex gap-4 flex-1 md:flex-none">
                        {step > 1 && (
                            <Button 
                                variant="ghost"
                                onClick={onPrevious}
                                className="px-8 py-7 rounded-2xl font-bold bg-surface-container/50 hover:bg-surface-container"
                            >
                                Kembali
                            </Button>
                        )}
                        <Button 
                            onClick={onNext}
                            disabled={!canNext}
                            className="flex-1 md:flex-none px-12 py-7 rounded-2xl bg-primary text-on-primary font-bold text-lg shadow-lg shadow-primary/20 hover:translate-y-[-2px] active:translate-y-0 transition-all duration-300"
                        >
                            {currentConfig.nextLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
