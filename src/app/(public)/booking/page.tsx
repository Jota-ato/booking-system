import { appointmentsService } from "@/features/appointments/core/services/appointments-service"
import { Booking } from "@/features/appointments/public/components/booking"
import { Heading } from "@/shared/components/typography/heading"
import { Progress } from "@/shared/components/ui/progress"
import { Separator } from "@/shared/components/ui/separator"
import { getSharedPublicServices } from "@/shared/lib/cache"
import { TIMEZONE } from "@/shared/lib/date"
import { TZDate } from "@date-fns/tz"
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

    const today = new TZDate(new Date(), TIMEZONE)
    const services = await getSharedPublicServices()
    const appointments = await appointmentsService.getFromDay(today)

    return (
        <section
            className="space-y-8 my-8"
        >
            <Heading>{title}</Heading>
            <AnimatePresence>
                <Booking
                    today={today}
                    services={services}
                    appointments={appointments}
                />
            </AnimatePresence>
        </section>
    )
}