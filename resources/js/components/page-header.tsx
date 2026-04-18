import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    button?: {
        label: string;
        onClick?: () => void;
        href?: string;
        show?: boolean;
    };
}

export function PageHeader({ title, subtitle, button }: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">{title}</h1>
                {subtitle && (
                    <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
            {button && button.show !== false && button.label && (
                <Button 
                    className="h-14 px-8 rounded-lg gap-3 text-base font-bold transition-all hover:scale-105 active:scale-95"
                    onClick={button.onClick}
                    asChild={!!button.href}
                >
                    {button.href ? (
                        <Link href={button.href}>
                            <PlusCircle className="size-6" />
                            {button.label}
                        </Link>
                    ) : (
                        <>
                            <PlusCircle className="size-6" />
                            {button.label}
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}
