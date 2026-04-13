import * as React from 'react';
import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
    icon?: LucideIcon;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, icon: Icon, ...props }, ref) => {
    return (
        <div className="relative group flex w-full items-center">
            {Icon && (
                <div className="absolute left-4 flex items-center pointer-events-none text-on-surface-variant/60 group-focus-within:text-primary transition-colors z-10">
                    <Icon className="h-5 w-5" />
                </div>
            )}
            <input
                type={type}
                className={cn(
                    'flex h-12 w-full rounded-lg border-none bg-surface-container py-3 text-base text-on-surface placeholder:text-on-surface-variant/50 transition-all duration-200 focus-visible:bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    Icon ? 'pl-[2.75rem] pr-4' : 'px-4',
                    className,
                )}
                ref={ref}
                {...props}
            />
        </div>
    );
});

Input.displayName = 'Input';

export { Input };
