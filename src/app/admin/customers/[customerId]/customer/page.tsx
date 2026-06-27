import { EditAppointmentDialog } from "@/features/appointments/admin/components/edit-appointment-dialog"
import { RecordCard } from "@/features/appointments/admin/components/record-card"
import { CustomerHeader } from "@/features/customers/components/customer-header"
import { CustomerStatsGrid } from "@/features/customers/components/customer-stats-grid"
import { customersService } from "@/features/customers/services/customers-service"
import { servicesService } from "@/features/services/services/services-service"
import { Container } from "@/shared/components/ui/container"
import { formatPhone } from "@/shared/utils/phone"
import { notFound } from "next/navigation"

export default async function CustomerPage({
    params,
    searchParams
}: {
    params: Promise<{ customerId: string }>
    searchParams: Promise<{ page?: string, limit?: string, date?: string }>
}) {
    const { customerId } = await params
    const customer = await customersService.getClientById(customerId, true)
    if (!customer || !("appointments" in customer)) return notFound()

    const { page, limit, date } = await searchParams

    const { data: customerAppointments, totalPages } = await customersService.getCustomerAppointments(customerId, page ? parseInt(page) : 1, limit ? parseInt(limit) : 5, date)
    const services = await servicesService.getActiveServices()

    return (
        <section className="h-full w-full flex flex-col items-center py-8 md:p-12 space-y-8">
            <Container className="flex flex-col gap-6">
                <CustomerHeader customer={customer} />

                <CustomerStatsGrid customerAppointments={customer.appointments} />

                <RecordCard
                    appointments={customerAppointments}
                    currentPage={page ? parseInt(page) : 1}
                    totalPages={totalPages}
                />
            </Container>
            <EditAppointmentDialog 
                services={services}
            />
        </section>
    )
}