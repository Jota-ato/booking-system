import { DailyIncomeChart } from "@/features/appointments/admin/components/daily-income-chart";
import { FullAppointment } from "@/features/appointments/core/types/appointments.types";
import { getExpectedPaidAppointments } from "@/features/appointments/admin/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatMXN } from "@/shared/lib/currency";

export function DailyIncome({
    day,
    expected,
    paid
}: {
    expected: number
    paid: number
    day: Date
}) {

    return (
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>
                    Daily incomes
                </CardTitle>
                <CardDescription>
                    <p className="text-muted-foreground">{formatMXN(paid)}/<span className="text-accent-foreground">{formatMXN(expected)}</span></p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DailyIncomeChart
                    day={day}
                    expected={expected}
                    paid={paid}
                />
            </CardContent>
        </Card>
    )
}