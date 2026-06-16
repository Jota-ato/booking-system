import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { formatDailyDate } from "@/shared/lib/date"
import { AppointmentRow } from "./appointment-row"
import { NoDailyAppointments } from "./no-daily-appointments"
import { FullAppointment } from "../../core/types/appointments.types"

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
                    {formatDailyDate(new Date())}
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