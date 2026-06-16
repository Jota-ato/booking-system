import { Appointment } from "@/db/schema";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import { format, differenceInMinutes } from "date-fns";

interface EventProps {
    event: Appointment
    START_HOUR: number
    ROW_HEIGHT_REM: number
}

export function Event({
    topOffset,
    height,
    startTime,
    endTime,
    label,
    description
}: {
    topOffset: number
    height: number
    startTime: string
    endTime: string
    label: string
    description?: string
}) {

    return (
        <div
            className={cn(
                "absolute inset-x-1 z-10 rounded-lg p-2 shadow-md overflow-hidden cursor-pointer bg-card flex gap-2 items-center"
            )}
            style={{
                top: `${topOffset}rem`,
                height: `${height - 0.2}rem`,
            }}
        >
            <Separator orientation="vertical" />
            <div>
                <p className="text-xs text-muted-foreground uppercase truncate">
                    {startTime} - {endTime}
                </p>
                <p className="text-sm font-bold leading-tight wrap-break-word">
                    {label}
                </p>
                <span className="text-xs text-muted-foreground leading-tight wrap-break-word">{description}</span>
            </div>
        </div>
    )
}