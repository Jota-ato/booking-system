import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { formateDailyDate, formatTime } from "@/shared/lib/date"
import { FullAppointment } from "../types/appointments.types"
import { AppointmentRow } from "./appointment-row"

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
                {/**TODO daily appointments table */}
                {appointments.map(appointment => (
                    <AppointmentRow key={appointment.id} appointment={appointment} />
                ))}
            </CardContent>
        </Card>
    )
}