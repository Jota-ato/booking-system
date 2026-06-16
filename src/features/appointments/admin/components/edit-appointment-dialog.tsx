"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { UpdateAppointmentForm } from "./update-appointment-form"
import { Separator } from "@/shared/components/ui/separator"
import { Service } from "@/db/schema"
import { useAppointmentStore } from "../stores/appointment-store"

export function EditAppointmentDialog({
    services
}: {
    services: Service[]
}) {

    const { open, toggleOpen, activeAppointment, setActiveAppointment } = useAppointmentStore()

    if (!activeAppointment) return <></>

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
                        Editing appointment of {activeAppointment.customer.name}
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <UpdateAppointmentForm
                    appointment={activeAppointment}
                    services={services}
                />
            </DialogContent>
        </Dialog>
    )
}