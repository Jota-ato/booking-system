"use client"
import { addDays, addHours } from "date-fns";
import { HourCell } from "../../core/components/hour-cell";
import { useAppointmentStore } from "../stores/appointment-store";

export function AdminHourCell({
    hour,
    dayDifference
}: {
    hour: Date
    dayDifference: number
}) {

    const startTime = addDays(hour, dayDifference);
    const endTime = addHours(startTime, 2.5);
    const activeCreateAppointmentTime = { startTime, endTime}
    const { toggleCreateDialogOpen, setActiveCreateAppointmentTime } = useAppointmentStore()

    return (
        <div onClick={() => {
            toggleCreateDialogOpen()
            setActiveCreateAppointmentTime(activeCreateAppointmentTime)
        }}>
            <HourCell />
        </div>
    )
}