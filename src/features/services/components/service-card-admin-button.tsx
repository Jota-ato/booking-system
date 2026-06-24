"use client"
import { Button } from "@/shared/components/ui/button";
import { ServiceWithExtras } from "../types/service.types";
import { useServiceStore } from "../stores/service-store";

export function ServiceCardAdminButton({
    service
}: {
    service: ServiceWithExtras
}) {


    const { setActiveService, toggleOpen } = useServiceStore()

    return (
        <Button
            onClick={() => {
                setActiveService(service)
                toggleOpen()
            }}
        >
            Edit
        </Button>
    )
}