import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { FullAppointment } from "../../core/types/appointments.types";
import { DateFilter } from "./record-date-filter";
import { AppointmentRow } from "./appointment-row";
import { NoDailyAppointments } from "./no-daily-appointments";
import { PaginationControls } from "./record-pagination-control";

interface HistoryCardProps {
    currentPage: number;
    totalPages: number;
    appointments: FullAppointment[];
}

export function RecordCard({
    currentPage,
    totalPages,
    appointments,
}: HistoryCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle>Appointment History</CardTitle>
                    <CardDescription>
                        Showing page {currentPage} of {totalPages || 1}
                    </CardDescription>
                </div>
                <DateFilter />
            </CardHeader>

            <CardContent>
                {appointments.length ? (
                    appointments.map(appointment => (
                        <AppointmentRow
                            showDate
                            key={appointment.id}
                            appointment={appointment}
                        />
                    ))
                ) : <NoDailyAppointments />}
            </CardContent>

            <CardFooter className="flex justify-end">
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </CardFooter>
        </Card>
    );
}