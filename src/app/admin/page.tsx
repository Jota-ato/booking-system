import { QuickActions } from "@/shared/components/dashboard/quick-actions";
import { DailyIncome } from "@/features/finance/components/daily-income";
import { servicesService } from "@/features/services/services/services-service";
import { Container } from "@/shared/components/ui/container";
import { DailyAppointmentsSection } from "@/features/appointments/admin/components/daily-appointments-section";
import { EditAppointmentDialog } from "@/features/appointments/admin/components/edit-appointment-dialog";
import { appointmentsService } from "@/features/appointments/core/services/appointments-service";
import { financeService } from "@/features/finance/services/finance-service";
import { endOfDay, startOfDay } from "date-fns";

export default async function AdminPage() {

  const today = new Date()

  const todayAppointments = await appointmentsService.getDayAppointments(today)
  const expectedData = await financeService.getExpectedData(startOfDay(today), endOfDay(today))
  const services = await servicesService.getActiveServices()

  return (
    <section className="h-full w-full flex flex-col items-center justify-center py-8 md:p-12">
      <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <DailyAppointmentsSection
          appointments={todayAppointments}
        />
        <QuickActions
          today={today}
          services={services}
        />
        <DailyIncome
          day={today}
          expected={expectedData.expected}
          paid={expectedData.paid}
        />
      </Container>
      <EditAppointmentDialog
        services={services}
      />
    </section>
  )
}