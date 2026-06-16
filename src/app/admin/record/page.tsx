import { EditAppointmentDialog } from "@/features/appointments/admin/components/edit-appointment-dialog";
import { RecordCard } from "@/features/appointments/admin/components/record-card";
import { appointmentsService } from "@/features/appointments/core/services/appointments-service";
import { servicesService } from "@/features/services/services/services-service";

interface RecordPageProps {
  searchParams: Promise<{ page?: string; date?: string }>;
}

export default async function RecordPage({ searchParams }: RecordPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const searchDate = resolvedParams?.date;

  const { data, totalPages } = await appointmentsService.getAppointmentsHistory(currentPage, searchDate);
  const services = await servicesService.getServices()

  return (
    <section className="min-h-screen p-8 md:p-12 flex items-center justify-center">
      <RecordCard
        currentPage={currentPage}
        totalPages={totalPages}
        appointments={data}
      />
      <EditAppointmentDialog
        services={services}
      />
    </section>
  );
}