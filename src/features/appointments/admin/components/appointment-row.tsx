"use client"
import { Separator } from "@/shared/components/ui/separator"
import { AppointmentRowDetails } from "./appointment-row-details";
import { AppointmentRowTime } from "./appointment-row-time";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { ShieldAlert } from "lucide-react"; 
import { useAppointmentStore } from "../stores/appointment-store";
import { FullAppointment } from "../../core/types/appointments.types";

export function AppointmentRow({
    appointment
}: {
    appointment: FullAppointment
}) {
    const { startTime, endTime, status, service } = appointment
    const { toggleOpen, setActiveAppointment } = useAppointmentStore()

    const isBlock = service.name === "BLOCK" || service.id === "388308b9-56aa-4bf9-b86b-b6be42222660";

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const isMultiDay = startDate.toDateString() !== endDate.toDateString();

    return (
        <ul
            onClick={() => {
                setActiveAppointment(appointment)
                toggleOpen()
            }}
            className={`flex justify-between items-center md:gap-4 gap-2 p-4 hover:bg-muted/50 transition-colors cursor-pointer border-y-border border-b first-of-type:border-t ${
                isBlock ? "bg-amber-50/40 dark:bg-amber-950/10 hover:bg-amber-50/60" : ""
            }`}
        >
            <div className="flex gap-4 items-center">
                <AppointmentRowTime 
                    startTime={startTime} 
                    endTime={endTime} 
                    showDate={isMultiDay && isBlock}
                />
                <Separator orientation="vertical" className="h-10" />
                <AppointmentRowDetails appointment={appointment} isBlock={isBlock} isMultiDay={isMultiDay} />
            </div>

            {isBlock ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    <ShieldAlert className="size-3.5" />
                    <span>Blocked</span>
                </div>
            ) : (
                <StatusBadge status={status} />
            )}
        </ul>
    )
}