import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import React from 'react';
import AppLogoIcon from '../app-logo-icon';

interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number;
    showText?: boolean;
    textClassName?: string;
    iconClassName?: string;
}

const BrandLogo = React.forwardRef<HTMLDivElement, BrandLogoProps>(
    ({ size = 8, showText = false, textClassName, iconClassName, className, ...props }, ref) => {
        const { themes } = usePage<SharedData>().props;

        return (
            <div ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
                <div 
                    className={cn(
                        'bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-md overflow-hidden',
                        `size-${size}`
                    )}
                >
                    {themes?.brand_logo ? (
                        <img src={themes.brand_logo} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                        <AppLogoIcon className={cn('fill-current text-white', iconClassName || `size-${Math.max(1, Math.floor(size * 0.6))}`)} />
                    )}
                </div>
                {showText && (
                    <div className="grid flex-1 text-left text-sm">
                        <span className={cn('mb-0.5 truncate leading-none font-semibold', textClassName)}>Sehatin</span>
                    </div>
                )}
            </div>
        );
    }
);

BrandLogo.displayName = 'BrandLogo';

export { BrandLogo };
