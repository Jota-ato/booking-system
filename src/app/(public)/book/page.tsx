import { Booking } from "@/features/appointments/public/components/booking"
import { servicesService } from "@/features/services/services/services-service"
import { Heading } from "@/shared/components/typography/heading"
import { Container } from "@/shared/components/ui/container"
import { Separator } from "@/shared/components/ui/separator"
import {
    AnimatePresence
} from "motion/react"
import { Metadata } from "next"

const title = "Book online"

export const metadata: Metadata = {
    title,
    description: "Book online for beauty salon, clinics and other service-based businesses.",
}

export default async function PublicAgendaPage() {

    const services = await servicesService.getActiveServices()

    return (
        <section
            className="h-full w-full flex flex-col items-center justify-center py-8 md:p-12"
        >
            <Container className="space-y-8">
                <Heading>{title}</Heading>
                <Separator />
                <AnimatePresence>
                    <Booking 
                        services={services}
                    />
                </AnimatePresence>
            </Container>
        </section>
    )
}