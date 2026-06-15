import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { formateDailyDate } from "@/shared/lib/date"
import { FullAppointment } from "../types/appointments.types"
import { AppointmentRow } from "./appointment-row"
import { NoDailyAppointments } from "./no-daily-appointments"

export function DailyAppointmentsSection({
    appointments
}: {
    appointments: FullAppointment[]
}) {
    return (
        <Card className="md:col-span-3">
            <CardHeader>
                <CardTitle>
                    Daily Appointments
                </CardTitle>
                <CardDescription>
                    {formateDailyDate(new Date())}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {appointments.length ? (
                    appointments.map(appointment => (
                        <AppointmentRow key={appointment.id} appointment={appointment} />
                    ))
                ) : <NoDailyAppointments />}
            </CardContent>
        </Card>
    )
}