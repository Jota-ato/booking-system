import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function CustomersTable() {
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
                    <p>Activity</p>
                </div>
                <div className="p-4 rounded-md grid grid-cols-4 gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <a className="bg-purple-400/10 p-2 rounded-full">
                            JC
                        </a>
                        <p>Julio César</p>
                    </div>
                    <p>+52 56 2761 1099</p>
                    <p>3</p>
                    <p>
                        <Badge
                            variant="success"
                        >Frecuent</Badge>
                    </p>
                </div>

            </CardContent>
        </Card>
    )
}