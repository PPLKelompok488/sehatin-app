import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

export interface DatePickerProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    error?: boolean;
}

export function DatePicker({ value, onChange, placeholder = "Pilih tanggal", className, error }: DatePickerProps) {
    const dateValue = value ? new Date(value) : undefined;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="relative group cursor-pointer">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <span className="material-symbols-outlined text-outline-variant text-xl group-focus-within:text-primary transition-colors">calendar_month</span>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className={cn(
                            "w-full pl-11 pr-10 justify-start text-left font-medium h-12 bg-surface-container border-none transition-all duration-200 hover:scale-[1] hover:bg-white focus:ring-2 focus:ring-primary",
                            value ? "text-on-surface" : "text-on-surface-variant/40",
                            error && "ring-2 ring-red-500",
                            className
                        )}
                    >
                        {value && !isNaN(dateValue?.getTime() || 0) ? format(dateValue!, "dd MMMM yyyy") : <span>{placeholder}</span>}
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-outline-variant opacity-50" />
                        </div>
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" data-slot="popover-content">
                <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={dateValue}
                    onSelect={(date) => {
                        if (date && onChange) {
                            onChange(format(date, 'yyyy-MM-dd'));
                        }
                    }}
                    initialFocus
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                />
            </PopoverContent>
        </Popover>
    );
}