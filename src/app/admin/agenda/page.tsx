import { AdminAgendaDialog } from "@/features/appointments/admin/components/admin-agenda-dialog";
import { EditAppointmentDialog } from "@/features/appointments/admin/components/edit-appointment-dialog";
import { Agenda } from "@/features/appointments/core/components/agenda";
import { appointmentsService } from "@/features/appointments/core/services/appointments-service";
import { servicesService } from "@/features/services/services/services-service";
import { Container } from "@/shared/components/ui/container";
import { TIMEZONE } from "@/shared/lib/date";
import { TZDate } from "@date-fns/tz";

export default async function AgendaPage() {

    const today = new TZDate(new Date(), TIMEZONE)
    const appointments = await appointmentsService.getFromDay(today, true)
    const services = await servicesService.getServices()

    return (
        <section className="h-full w-full flex flex-col items-center justify-center py-8 md:p-12">
            <Container>
                <Agenda
                    isAdmin={true}
                    events={appointments}
                    today={today}
                />
            </Container>
            <AdminAgendaDialog 
                services={services}
            />
            <EditAppointmentDialog 
                services={services}
            />
        </section>
    )
}