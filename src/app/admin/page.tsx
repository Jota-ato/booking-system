import { DailyAppointmentsSection } from "@/features/appointments/components/daily-appointments-section";
import { EditAppointmentDialog } from "@/features/appointments/components/edit-appointment-dialog";
import { QuickActions } from "@/features/appointments/components/quick-actions";
import { appointmentsService } from "@/features/appointments/services/appointments-service";
import { DailyIncome } from "@/features/finance/components/daily-income";
import { servicesService } from "@/features/services/services/services-service";
import { Container } from "@/shared/components/ui/container";

export default async function AdminPage() {

  const today = new Date()

  const appointments = await appointmentsService.getDayAppointments(today)
  const services = await servicesService.getServices()

  return (
    <section className="h-full w-full flex flex-col items-center justify-center py-8 md:p-12">
      <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <DailyAppointmentsSection
          appointments={appointments}
        />
        <QuickActions />
        <DailyIncome />
      </Container>
      <EditAppointmentDialog
        services={services}
      />
    </section>
  )
}