import { Appointment } from "@/db/schema";
import { cn } from "@/shared/lib/utils";
import { format, differenceInMinutes } from "date-fns";
import { Event } from "../../core/components/event";
import { FullAppointment } from "../../core/types/appointments.types";
import { useAppointmentStore } from "../stores/appointment-store";

interface EventProps {
    event: FullAppointment
    START_HOUR: number
    ROW_HEIGHT_REM: number
}

export function AdminEvent({ event, START_HOUR, ROW_HEIGHT_REM }: EventProps) {

    const { toggleEditDialogOpen, setActiveEditingAppointment } = useAppointmentStore()

    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    const startDate = start.toISOString();
    const endDate = end.toISOString();

    const startBase = new Date(startDate);
    startBase.setHours(START_HOUR, 0, 0, 0);

    const minutesFromStart = differenceInMinutes(startDate, startBase);
    const durationMinutes = differenceInMinutes(endDate, startDate);

    const topOffset = (minutesFromStart * ROW_HEIGHT_REM) / 150;
    const height = (durationMinutes * ROW_HEIGHT_REM) / 150;

    return (
        <div
            onClick={() => {
                toggleEditDialogOpen()
                setActiveEditingAppointment(event)
            }}
        >
            <Event
                topOffset={topOffset}
                height={height}
                startTime={format(startDate, 'HH:mm')}
                endTime={format(endDate, 'HH:mm')}
                label={event.customer.name}
                description={event.service.name}
            />
        </div>
    )
}