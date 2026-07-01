"use client"
import { ServiceWithExtras } from "@/features/services/types/service.types"
import { ScrollAnimateItem } from "@/shared/components/animate/scroll-animate-item"
import { ServiceImage } from "./service-image"
import { Button } from "@/shared/components/ui/button"
import { useBookingStore } from "../store/booking-store"

export function ServiceSelection({
  services
}: {
  services: ServiceWithExtras[]
}) {

  const { setSelectedService, setStep } = useBookingStore()

  const handleServiceSelect = (service : ServiceWithExtras) => {
    setSelectedService(service)
    setStep(2)
  }

  return (
    <ul className="space-y-6 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:grid-cols-3">
      {services.length ?
        services.map((service, idx) => (
          <ScrollAnimateItem key={service.data.id} delay={Math.min(idx * 0.1, 0.4)}>
            <li key={service.data.id}>
              <ServiceImage
                trigger={<Button
                  onClick={e => {
                    handleServiceSelect(service)
                  }}
                  className="w-full"
                  variant={'outline'}
                >
                  Select
                </Button>}
                service={service}
              />
            </li>
          </ScrollAnimateItem>
        ))
        : (
          <p className="text-center text-muted-foreground">
            No services available.
          </p>
        )
      }
    </ul>
  )
}