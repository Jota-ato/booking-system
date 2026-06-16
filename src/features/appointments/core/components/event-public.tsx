import { Appointment } from "@/db/schema";
import { cn } from "@/shared/lib/utils";
import { format, differenceInMinutes } from "date-fns";

interface EventProps {
    event: Appointment
    START_HOUR: number
    ROW_HEIGHT_REM: number
}

export function EventPublic({ event, START_HOUR, ROW_HEIGHT_REM }: EventProps) {


    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    const startDate = start.toISOString();
    const endDate = end.toISOString();

    // Calculate minutes from start (08:00)
    const startBase = new Date(startDate);
    startBase.setHours(START_HOUR, 0, 0, 0);

    const minutesFromStart = differenceInMinutes(startDate, startBase);
    const durationMinutes = differenceInMinutes(endDate, startDate);

    // Convert minuts to rem (5rem = 60min)
    const topOffset = (minutesFromStart * ROW_HEIGHT_REM) / 120;
    const height = (durationMinutes * ROW_HEIGHT_REM) / 120;
    if (height < 5) return // not show events with less than 2 hours of duration

    return (
        <div
            key={event.id}
            className={cn(
                "absolute inset-x-1 z-10 rounded-lg p-2 shadow-md  overflow-hidden cursor-pointer text-warning-foreground bg-warning"
            )}
            style={{
                top: `${topOffset}rem`,
                height: `${height - 0.2}rem`,
            }}
        >
            <p className="text-xs font-light opacity-90 uppercase truncate">
                {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
            </p>
            <p className="text-sm font-bold leading-tight wrap-break-word">
                Ocupado
            </p>
        </div>
    )
}