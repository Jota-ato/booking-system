import { adminAppointmentsService } from "@/features/appointments/admin/services/admin-appointments-service";
import { customersService } from "@/features/customers/services/customers-service";
import { Heading } from "@/shared/components/typography/heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Container } from "@/shared/components/ui/container";
import { Separator } from "@/shared/components/ui/separator";
import { TIMEZONE } from "@/shared/lib/date";
import { TZDate } from "@date-fns/tz";
import { endOfMonth, startOfMonth } from "date-fns";

export default async function CustomersPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; }>;
}) {
    const resolvedParams = await searchParams;
    const currentPage = resolvedParams?.page ? +resolvedParams?.page : 1;
    const today = new Date()
    const startRange = new TZDate(startOfMonth(today), TIMEZONE)
    const endRange = new TZDate(endOfMonth(today), TIMEZONE)

    const [
        customers,
        customerAmount,
        newCustomersThisMonth,
        noShowRate
    ] = await Promise.all([
        customersService.getCustomers(currentPage, 10),
        customersService.getCustomerAmount(),
        customersService.getCustomersByTimeRange(startRange, endRange),
        adminAppointmentsService.getNoShowRate(startRange, endRange)
    ])

    return (
        <section className="min-h-screen py-8 md:py-12 flex items-center justify-center">
            <Container className="space-y-8">
                <Heading>Clients</Heading>
                <Separator />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customers amount</CardTitle>
                            <CardDescription>Total amount of customers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {customerAmount}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>New customers this month</CardTitle>
                            <CardDescription>Total amount of customers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {newCustomersThisMonth}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>No show rate</CardTitle>
                            <CardDescription>Total amount of customers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {noShowRate}%
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Customers</CardTitle>
                        <CardDescription>List of customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {customers.length ? (
                            customers.map(customer => (
                                <div key={customer.id}>
                                    <p>{customer.name} {customer.lastName}</p>
                                    <p>Appointments: {customer.appointmentCount}</p>
                                </div>
                            ))
                        ) : <p>No customers yet</p>}
                    </CardContent>
                </Card>
            </Container>
        </section>
    )
}