import { RecordCard } from "@/features/appointments/admin/components/record-card"
import { CustomerStatsGrid } from "@/features/customers/components/customer-stats-grid"
import { customersService } from "@/features/customers/services/customers-service"
import { Container } from "@/shared/components/ui/container"
import { formatPhone } from "@/shared/utils/phone"
import { notFound } from "next/navigation"

export default async function CustomerPage({
    params
}: {
    params: Promise<{ customerId: string }>
}) {
    const { customerId } = await params
    const customer = await customersService.getClientById(customerId, true)

    if (!customer || !("appointments" in customer)) return notFound()
    
    const customerAppointments = await customersService.getCustomerAppointments(customerId, 1, 5);

    return (
        <section className="h-full w-full flex flex-col items-center py-8 md:p-12 space-y-8">
            <Container className="flex flex-col gap-6">
                
                <header className="border-b pb-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {customer.name} {customer.lastName}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {formatPhone(customer.phone)}
                    </p>
                </header>

                <CustomerStatsGrid customerAppointments={customer.appointments} />

                <RecordCard 
                    appointments={customerAppointments}
                    currentPage={1}
                    totalPages={Math.ceil(customerAppointments.length / 5)}
                />
            </Container>
        </section>
    )
}