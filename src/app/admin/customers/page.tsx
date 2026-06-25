import { customersService } from "@/features/customers/services/customers-service";
import { Heading } from "@/shared/components/typography/heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Container } from "@/shared/components/ui/container";
import { Separator } from "@/shared/components/ui/separator";

export default async function CustomersPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; }>;
}) {

    const resolvedParams = await searchParams;
    const currentPage = resolvedParams?.page ? +resolvedParams?.page : 1;
    const customers = await customersService.getCustomers(currentPage, 10)

    return (
        <section className="min-h-screen py-8 md:py-12 flex items-center justify-center">
            <Container>
                <Heading>Clients</Heading>
                <Separator className="my-8" />
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
                        ): <p>No customers yet</p>}
                    </CardContent>
                </Card>
            </Container>
        </section>
    )
}