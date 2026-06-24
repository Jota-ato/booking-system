"use client"
import { Extra } from "@/db/schema"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { useServiceStore } from "../stores/service-store"
import { ServiceForm } from "./service-form"

export function ServiceDialog({
    extras
}: {
    extras: Extra[]
}) {

    const { open, toggleOpen, activeService } = useServiceStore()

    if (!activeService) return null

    return (
        <Dialog open={open} onOpenChange={toggleOpen}>
            <DialogContent className="max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Editing {activeService.data.name}</DialogTitle>
                    <DialogDescription>Edit details of the service</DialogDescription>
                </DialogHeader>
                <ServiceForm
                    extras={extras}
                    service={activeService}
                />
            </DialogContent>
        </Dialog>
    )
}