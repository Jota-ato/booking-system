import { AppointmentStatus } from "@/db/schema";
import { Separator } from "@/shared/components/ui/separator";
import { statusColorsMap } from "@/shared/components/ui/status-badge";
import { cn } from "@/shared/lib/utils";


export function Event({
    topOffset,
    height,
    startTime,
    endTime,
    label,
    description,
    eventStatus
}: {
    topOffset: number
    height: number
    startTime: string
    endTime: string
    label: string
    description?: string
    eventStatus: AppointmentStatus
}) {

    return (
        <div
            className={cn(
                "absolute inset-x-1 z-10 rounded-lg p-2 shadow-md overflow-hidden cursor-pointer flex gap-2 items-center",
                statusColorsMap[eventStatus]
            )}
            style={{
                top: `${topOffset}rem`,
                height: `${height - 0.2}rem`,
            }}
        >
            <Separator className="bg-border" orientation="vertical" />
            <div>
                <p className="text-xs uppercase truncate">
                    {startTime} - {endTime}
                </p>
                <p className="text-sm font-bold leading-tight wrap-break-word">
                    {label}
                </p>
                <span className="text-xs leading-tight wrap-break-word">{description}</span>
            </div>
        </div>
    )
}