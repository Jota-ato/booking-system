import { cn } from "@/shared/lib/utils"
import { ReactNode } from "react"

export function Container({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div className={cn("max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8", className)}>
            {children}
        </div>
    )
}