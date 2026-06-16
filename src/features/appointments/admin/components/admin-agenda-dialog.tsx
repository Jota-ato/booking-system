"use client"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/ui/dialog"
import { useAppointmentStore } from "../stores/appointment-store"
import { formatTime } from "@/shared/lib/date"
import { format } from "date-fns"
import { Separator } from "@/shared/components/ui/separator"

export function AdminAgendaDialog() {

    const { 
        createDialogOpen, 
        toggleCreateDialogOpen, 
        activeCreateAppointmentTime
    } = useAppointmentStore()

    if (!activeCreateAppointmentTime) {
        return <></>
    }

    const { startTime, endTime } = activeCreateAppointmentTime

    return (
        <Dialog open={createDialogOpen} onOpenChange={toggleCreateDialogOpen}>
            <DialogContent>
                <DialogTitle>Create appointment</DialogTitle>
                <DialogDescription className="flex flex-col">
                    <span>Day: {format(startTime, 'MM/dd/yyyy')}</span>
                    Select time {formatTime(startTime)} - {formatTime(endTime)}
                </DialogDescription>
                <Separator />
                {/** TODO: Create appointment */}
            </DialogContent>
        </Dialog>
    )
}