import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card"
import { CustomerRow } from "./customer-row"
import { CustomerTableHeader } from "./customers-table-header"
import { CustomerWithAppointmentCount } from "../types/customer.types"
import { CustomersTablePagination } from "./customers-table-pagination"

export function CustomersTable({
    customers,
    currentPage,
}: {
    customers: {
        data: CustomerWithAppointmentCount[];
        totalPages: number;
    }
    currentPage: number;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>List of all customers</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
                <div className="min-w-2xl">
                    <CustomerTableHeader />
                    {customers.data.length ? (
                        customers.data.map(customer => (
                            <CustomerRow key={customer.id} customer={customer} />
                        ))
                    ) : (
                        <p className="p-4 text-muted-foreground text-sm">No customers yet.</p>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <CustomersTablePagination 
                    currentPage={currentPage}
                    totalPages={customers.totalPages}
                />
            </CardFooter>
        </Card>
    )
}