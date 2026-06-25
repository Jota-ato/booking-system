"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useExtraStore } from "../stores/extra-store";
import { ExtraForm } from "./extra-form";

export function ExtraDialog() {

    const { open, toggleOpen, activeExtra, setActiveExtra } = useExtraStore()

    if (!activeExtra) return null

    return (
        <Dialog open={open} onOpenChange={() => {
            setActiveExtra(null)
            toggleOpen()
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editing {activeExtra.name}</DialogTitle>
                </DialogHeader>
                <ExtraForm
                    extra={activeExtra}
                />
            </DialogContent>
        </Dialog>
    )
}