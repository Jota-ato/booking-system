import { CalendarCheck, Clock, Sparkles, User } from "lucide-react";
import { FullAppointment } from "../types/appointments.types";
import { Separator } from "@/shared/components/ui/separator"
import { AppointmentRowDetails } from "./appointment-row-details";
import { AppointmentRowTime } from "./appointment-row-time";
import { StatusBadge } from "@/shared/components/ui/status-badge";

export function AppointmentRow({
    appointment
}: {
    appointment: FullAppointment
}) {

    const { startTime, endTime, status } = appointment

    return (
        <ul
            className="flex justify-between items-center md:gap-4 gap-2 p-4 hover:bg-muted/50 transition-colors cursor-pointer border-y-border border-b first-of-type:border-t"
        >
            <div className="flex gap-4">
                <AppointmentRowTime startTime={startTime} endTime={endTime} />
                <Separator orientation="vertical" />
                <AppointmentRowDetails appointment={appointment} />
            </div>
            <StatusBadge status={status}/>
        </ul>
    )
}