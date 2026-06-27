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
    
    const appointments = customer.appointments;
    const totalAppointments = appointments.length;

    const completedVisits = appointments.filter(
        (app: any) => app.status === 'COMPLETED' || app.status === 'PAID' 
    ).length;

    const noShows = appointments.filter(
        (app: any) => app.status === 'NO_SHOW'
    ).length;

    const noShowRate = totalAppointments > 0 
        ? ((noShows / totalAppointments) * 100).toFixed(1) 
        : "0.0";

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="p-6 border rounded-lg shadow-sm bg-card flex flex-col justify-center">
                        <span className="text-sm font-medium text-muted-foreground">Total appoinments</span>
                        <span className="text-4xl font-bold mt-2 text-primary">{totalAppointments}</span>
                    </div>

                    <div className="p-6 border rounded-lg shadow-sm bg-card flex flex-col justify-center">
                        <span className="text-sm font-medium text-muted-foreground">Appointments completed</span>
                        <span className="text-4xl font-bold mt-2 text-success">{completedVisits}</span>
                    </div>

                    <div className="p-6 border rounded-lg shadow-sm bg-card flex flex-col justify-center">
                        <span className="text-sm font-medium text-muted-foreground">No show rate</span>
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-4xl font-bold text-destructive">{noShowRate}</span>
                            <span className="text-xl text-muted-foreground">%</span>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                            <strong className="text-accent-foreground">{noShows}</strong> no show in <strong className="text-accent-foreground">{totalAppointments}</strong>
                        </span>
                    </div>
                    
                </div>


            </Container>
        </section>
    )
}