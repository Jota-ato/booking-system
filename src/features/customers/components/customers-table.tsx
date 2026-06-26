import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { CustomerRow } from "./customer-row"
import { CustomerTableHeader } from "./customers-table-header"
import { CustomerWithAppointmentCount } from "../types/customer.types"

export function CustomersTable({ customers }: { customers: CustomerWithAppointmentCount[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>List of all customers</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <CustomerTableHeader />
                {customers.length ? (
                    customers.map(customer => (
                        <CustomerRow key={customer.id} customer={customer} />
                    ))
                ) : (
                    <p className="p-4 text-muted-foreground text-sm">No customers yet.</p>
                )}
            </CardContent>
        </Card>
    )
}