'use client';
import { Appointment } from "@/db/schema";
import { isSameDay } from "date-fns";
import { FullAppointment } from "../types/appointments.types";
import { HoursColumn } from "./hours-column";
import { HourCell } from "./hour-cell";
import { AdminAgendaDialog } from "../../admin/components/admin-agenda-dialog";
import { AdminHourCell } from "../../admin/components/admin-hour-cell";
import { AdminEvent } from "../../admin/components/admin-event";
import { AdminBlockPeriod } from "../../admin/components/admin-block-period";


export function AgendaBody({
    weekDays,
    hours,
    events,
    isAdmin = false
}: {
    weekDays: Date[];
    hours: Date[];
    events: (Appointment | FullAppointment)[];
    isAdmin?: boolean
}) {
    const ROW_HEIGHT_REM = 5;
    const START_HOUR = hours[0].getHours();

    return (
        <main
            className="grid relative"
            style={{ gridTemplateColumns: `5rem repeat(${weekDays.length}, 1fr)` }}
        >
            {/* Hours column */}
            <HoursColumn
                hours={hours}
            />

            {/* Days columns */}
            {/* Reemplaza esta sección dentro del mapa de weekDays en agenda-body.tsx */}
            {weekDays.map((day, dayDifference) => (
                <div key={day.toISOString()} className="relative border-r border-muted-foreground last:border-r-0">
                    {hours.map(hour => (
                        isAdmin ? (
                            <AdminHourCell dayDifference={dayDifference} hour={hour} key={hour.getTime()} />
                        ) : (
                            <HourCell key={hour.getTime()} />
                        )
                    ))}

                    {events
                        .filter(event => {
                            const eventStart = new Date(event.startTime);
                            const eventEnd = new Date(event.endTime);

                            // Un evento pertenece a este día si su inicio es antes del fin del día
                            // Y su fin es después del inicio del día actual de la columna
                            const columnStart = new Date(day)
                            columnStart.setHours(START_HOUR, 0, 0, 0)
                            const columnEnd = new Date(day)
                            columnEnd.setHours(23, 59, 59, 999)

                            return eventStart <= columnEnd && eventEnd >= columnStart;
                        })
                        .map(event => {
                            const isMultiDay = !isSameDay(event.startTime, event.endTime);

                            if (isAdmin) {
                                if (isMultiDay) {
                                    return (
                                        <AdminBlockPeriod
                                            key={event.id}
                                            event={event as FullAppointment}
                                            START_HOUR={START_HOUR}
                                            ROW_HEIGHT_REM={ROW_HEIGHT_REM}
                                            currentColumnDate={day}
                                        />
                                    );
                                }

                                return (
                                    <AdminEvent
                                        key={event.id}
                                        event={event as FullAppointment}
                                        START_HOUR={START_HOUR}
                                        ROW_HEIGHT_REM={ROW_HEIGHT_REM}
                                    />
                                );
                            }

                            return null;
                        })
                    }
                </div>
            ))}
        </main>
    );
}