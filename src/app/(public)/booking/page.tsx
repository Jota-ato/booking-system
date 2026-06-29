import { Booking } from "@/features/appointments/public/components/booking"
import { servicesService } from "@/features/services/services/services-service"
import { Heading } from "@/shared/components/typography/heading"
import { Separator } from "@/shared/components/ui/separator"
import { getSharedPublicServices } from "@/shared/lib/cache"
import {
    AnimatePresence
} from "motion/react"
import { Metadata } from "next"
import { cache } from "react"

const title = "Book online"

export const metadata: Metadata = {
    title,
    description: "Book online for beauty salon, clinics and other service-based businesses.",
}

export default async function PublicAgendaPage() {

    const services = await getSharedPublicServices()

    return (
        <section
            className="space-y-8 my-8"
        >
            <Heading>{title}</Heading>
            <Separator />
            <AnimatePresence>
                <Booking
                    services={services}
                />
            </AnimatePresence>
        </section>
    )
}