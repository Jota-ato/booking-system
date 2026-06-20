"use client"
import { cn } from "@/shared/lib/utils";
import { format, differenceInMinutes, max, min } from "date-fns";
import { FullAppointment } from "../../core/types/appointments.types";
import { useAppointmentStore } from "../stores/appointment-store";

interface BlockPeriodProps {
    event: FullAppointment;
    START_HOUR: number;
    ROW_HEIGHT_REM: number;
    currentColumnDate: Date;
}

export function AdminBlockPeriod({ event, START_HOUR, ROW_HEIGHT_REM, currentColumnDate }: BlockPeriodProps) {

    const { toggleEditDialogOpen, setActiveEditingAppointment } = useAppointmentStore()

    const startBase = new Date(currentColumnDate);
    startBase.setHours(START_HOUR, 0, 0, 0);
    
    const endBase = new Date(currentColumnDate);
    endBase.setHours(20, 0, 0, 0); 

    const absoluteStart = new Date(event.startTime);
    const absoluteEnd = new Date(event.endTime);

    const effectiveStart = max([absoluteStart, startBase]);
    const effectiveEnd = min([absoluteEnd, endBase]);

    const minutesFromStart = differenceInMinutes(effectiveStart, startBase);
    const durationMinutes = differenceInMinutes(effectiveEnd, effectiveStart);

    const topOffset = (minutesFromStart * ROW_HEIGHT_REM) / 150;
    const height = (durationMinutes * ROW_HEIGHT_REM) / 150;

    const clampedTop = Math.max(0, topOffset);
    const clampedHeight = topOffset < 0 ? height + topOffset : height;

    if (clampedHeight < 0.5) return null;

    return (
        <div
            onClick={() => {
                toggleEditDialogOpen()
                setActiveEditingAppointment(event)
            }}
            key={event.id}
            className={cn(
                "absolute inset-x-1 z-10 rounded-lg p-2 shadow-md overflow-hidden text-muted-foreground bg-muted border border-muted-foreground/20 cursor-pointer"
            )}
            style={{
                top: `${clampedTop}rem`,
                height: `${clampedHeight - 0.2}rem`,
            }}
        >
            <p className="text-xs font-medium opacity-90 uppercase truncate">
                {format(effectiveStart, 'HH:mm')} - {format(effectiveEnd, 'HH:mm')}
            </p>
            <p className="text-sm font-bold text-foreground truncate">
                {"Block"}
            </p>
            <p className="text-xs">{event.service.name}</p>
        </div>
    );
}