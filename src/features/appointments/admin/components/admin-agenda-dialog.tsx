"use client"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/ui/dialog"
import { useAppointmentStore } from "../stores/appointment-store"
import { formatTime } from "@/shared/lib/date"
import { format } from "date-fns"
import { Separator } from "@/shared/components/ui/separator"
import { Service } from "@/db/schema"
import { NewAgendaAppointmentForm } from "./new-agenda-appointment-form"
import { ServiceWithExtras } from "@/features/services/types/service.types"

export function AdminAgendaDialog({
    services
}: {
    services: ServiceWithExtras[]
}) {

    const { 
        createDialogOpen, 
        toggleCreateDialogOpen, 
        activeCreateAppointmentTime,
        setActiveCreateAppointmentTime
    } = useAppointmentStore()

    if (!activeCreateAppointmentTime) {
        return <></>
    }
    const { startTime, endTime } = activeCreateAppointmentTime

    return (
        <Dialog open={createDialogOpen} onOpenChange={() => {
            toggleCreateDialogOpen()
            setActiveCreateAppointmentTime(undefined)
        }}>
            <DialogContent className="overflow-auto max-h-9/10">
                <DialogTitle>Create appointment</DialogTitle>
                <DialogDescription className="flex flex-col">
                    <span>Day: {format(startTime, 'MM/dd/yyyy')}</span>
                    Select time {formatTime(startTime)} - {formatTime(endTime)}
                </DialogDescription>
                <Separator />
                {/** TODO: Create appointment */}
                <NewAgendaAppointmentForm 
                    services={services}
                    timeRange={{ startTime, endTime }}
                />
            </DialogContent>
        </Dialog>
    )
}