import { cn } from "@/shared/lib/utils"
import { PawPrint } from "lucide-react"

export function Logo({
    className,
}: {
    className?: string
}) {
    return (
        <PawPrint
            className={cn("fill-primary text-primary size-6", className)}
        />
    )
}