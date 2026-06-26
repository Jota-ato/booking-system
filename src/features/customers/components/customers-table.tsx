import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CustomerWithAppointmentCount } from "../types/customer.types";

export function CustomersTable({
    customers,
}: {
    customers: CustomerWithAppointmentCount[];
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>List of all customers</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-background p-4 rounded-md grid grid-cols-4 gap-4 text-muted-foreground uppercase">
                    <p>Name</p>
                    <p>Phone</p>
                    <p>Appointments</p>
                    <p>Recent activity</p>
                </div>
                <>
                    {customers.map(customer => (
                        <div className="p-4 rounded-md grid grid-cols-4 gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <a className="bg-purple-400/10 p-2 rounded-full">
                                    {`${customer.name[0]}${customer.lastName[0]}`}
                                </a>
                                <p>{`${customer.name} ${customer.lastName}`}</p>
                            </div>
                            <p>{customer.phone}</p>
                            <p>{customer.appointmentCount}</p>
                            <Badge
                                variant="outline"
                            >{`Frecuent`}</Badge>
                        </div>
                    ))}
                </>

            </CardContent>
        </Card>
    )
}