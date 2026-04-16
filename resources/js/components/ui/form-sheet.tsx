import * as React from "react"
import { LucideIcon} from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface FormSheetProps extends React.ComponentProps<typeof Sheet> {
    title: string
    description?: string
    icon?: LucideIcon
    children: React.ReactNode
    footer?: React.ReactNode
    side?: "top" | "bottom" | "left" | "right"
    className?: string
    contentClassName?: string
}

export function FormSheet({
    title,
    description,
    icon: Icon,
    children,
    footer,
    side = "right",
    className,
    contentClassName,
    ...props
}: FormSheetProps) {
    return (
        <Sheet {...props}>
            <SheetContent 
                side={side} 
                className={cn("p-0 sm:max-w-[540px] border-none overflow-hidden flex flex-col", className)}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="flex h-full flex-col">
                    <SheetHeader className="p-8 pb-4 space-y-4">
                        <div className="flex items-center justify-between">
                            {Icon && (
                                <div className="text-primary">
                                    <Icon className="size-6" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <SheetTitle className="font-headline text-2xl font-bold text-on-surface">{title}</SheetTitle>
                            {description && (
                                <SheetDescription className="text-on-surface-variant font-medium">
                                    {description}
                                </SheetDescription>
                            )}
                        </div>
                    </SheetHeader>

                    <div className={cn("flex-1 overflow-y-auto p-8 pt-4", contentClassName)}>
                        {children}
                    </div>

                    {footer && (
                        <div className="p-8 pt-4 bg-white mt-auto">
                            {footer}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
