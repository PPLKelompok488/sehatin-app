import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

interface CalendarPickerProps {
    selectedDate: Date | null;
    onDateSelect: (date: Date | null) => void;
    onResetSelection: () => void;
    availableDays: string[];
}

export default function CalendarPicker({
    selectedDate,
    onDateSelect,
    onResetSelection,
    availableDays,
}: CalendarPickerProps) {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeft, setScrollLeft] = React.useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2;
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollTo({
                left: scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
                behavior: 'smooth'
            });
        }
    };

    const dates = React.useMemo(() => {
        const result = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            result.push(date);
        }
        return result;
    }, []);

    const indonesianDay = (date: Date) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[date.getDay()];
    };

    const shortDay = (date: Date) => {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        return days[date.getDay()];
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h3 className="text-sm font-semibold text-on-surface-variant">Pilih Tanggal</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => { e.preventDefault(); scroll('left'); }}
                            className="w-8 h-8 cursor-pointer rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); scroll('right'); }}
                            className="w-8 h-8 cursor-pointer rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
                {selectedDate && (
                    <span className="text-xs font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                        {selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                )}
            </div>

            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={cn(
                    "flex gap-4 overflow-x-auto pb-6 hide-scrollbar -mx-6 px-6 cursor-grab active:cursor-grabbing select-none scroll-smooth",
                    isDragging && "scroll-auto"
                )}
            >
                {dates.map((date, idx) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const isToday = new Date().toDateString() === date.toDateString();
                    const isTomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() === date.toDateString();
                    const isAvailable = availableDays.includes(indonesianDay(date));

                    return (
                        <button
                            key={idx}
                            disabled={!isAvailable}
                            onClick={() => {
                                if (isSelected) {
                                    onDateSelect(null);
                                } else {
                                    onDateSelect(date);
                                    onResetSelection();
                                }
                                }}  
                            className={cn(
                                "flex-shrink-0 w-20 h-24 cursor-pointer rounded-lg rounded-r-2xl flex flex-col items-center justify-center transition-all duration-100 border",
                                isSelected
                                    ? "bg-primary border-primary text-on-primary"
                                    : "bg-white border-border hover:border-primary/60 text-on-surface",
                                !isAvailable && "bg-muted opacity-50 border-muted/50 hover:border-muted cursor-not-allowed grayscale-[1]"
                            )}
                        >
                            <span className={cn(
                                "text-xs font-bold mb-1",
                                isSelected ? "text-on-primary/80" : "text-on-surface-variant"
                            )}>
                                {shortDay(date)}
                            </span>
                            <span className="text-3xl font-black">{date.getDate()}</span>
                            {(isToday || isTomorrow) && (
                                <span className={cn(
                                    "text-[10px] font-medium mt-1 text-primary",
                                    isSelected && "text-on-primary/80"
                                )}>
                                    {isToday ? 'Hari ini' : 'Besok'}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
