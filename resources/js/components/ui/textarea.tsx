import { LucideIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  icon?: LucideIcon
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, icon: Icon, ...props }, ref) => {
    return (
      <div className="relative group w-full">
        {Icon && (
          <div className="absolute left-4 top-3 flex items-start pointer-events-none text-on-surface-variant/60 group-focus-within:text-primary transition-colors z-10">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-lg border-none bg-surface-container py-3 text-base text-on-surface placeholder:text-on-surface-variant/40 transition-all duration-200 focus-visible:bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            Icon ? "pl-[2.75rem] pr-4" : "px-4",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
