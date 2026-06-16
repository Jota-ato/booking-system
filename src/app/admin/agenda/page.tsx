import { Agenda } from "@/features/appointments/core/components/agenda";
import { appointmentsService } from "@/features/appointments/core/services/appointments-service";
import { Container } from "@/shared/components/ui/container";
import { TIMEZONE } from "@/shared/lib/date";
import { TZDate } from "@date-fns/tz";

export default async function AgendaPage() {

    const today = new TZDate(new Date(), TIMEZONE);
    const appointments = await appointmentsService.getDayAppointments(new Date());

    return (
        <section className="h-full w-full flex flex-col items-center justify-center py-8 md:p-12">
            <Container>
                <Agenda
                    events={appointments}
                    today={today}
                />
            </Container>
        </section>
    )
}