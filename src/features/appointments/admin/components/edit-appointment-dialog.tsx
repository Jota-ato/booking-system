"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { UpdateAppointmentForm } from "./update-appointment-form"
import { Separator } from "@/shared/components/ui/separator"
import { Service } from "@/db/schema"
import { useAppointmentStore } from "../stores/appointment-store"
import { format, isSameDay } from "date-fns"
import { BlockPeriodForm } from "./block-period-form"
import { BlockTimeForm } from "./block-time-form"
import { formatTime } from "@/shared/lib/date"
import { ServiceWithExtras } from "@/features/services/types/service.types"

export function EditAppointmentDialog({
    services
}: {
    services: ServiceWithExtras[]
}) {

    const { editDialogOpen: open, toggleEditDialogOpen: toggleOpen, activeEditingAppointment: activeAppointment, setActiveEditingAppointment: setActiveAppointment } = useAppointmentStore()

    if (!activeAppointment) return <></>

    const description = activeAppointment.status === "NO_SHOW" ?
        "Editing block" :
        `Editing ${activeAppointment.customer.name}'s appointment`

    const isPeriod = !isSameDay(activeAppointment.startTime, activeAppointment.endTime)

    return (
        <Dialog open={open} onOpenChange={() => {
            toggleOpen()
            setActiveAppointment(undefined)
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Editing
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                {activeAppointment.status === "NO_SHOW" ? (
                    isPeriod ? (
                        <BlockPeriodForm
                            blockPeriod={{
                                startTime: new Date(activeAppointment.startTime),
                                endTime: new Date(activeAppointment.endTime)
                            }}
                            blockId={activeAppointment.id}
                        />
                    ) :
                        (
                            <BlockTimeForm
                                initialData={{
                                    startTime: new Date(activeAppointment.startTime),
                                    endTime: new Date(activeAppointment.endTime)
                                }}
                                blockId={activeAppointment.id}
                            />
                        )
                ) : (
                    <UpdateAppointmentForm
                        appointment={activeAppointment}
                        services={services}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}