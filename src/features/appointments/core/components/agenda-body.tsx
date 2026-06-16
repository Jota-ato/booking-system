'use client';
import { Appointment } from "@/db/schema";
import { endOfDay, isSameDay, startOfDay } from "date-fns";
import { FullAppointment } from "../types/appointments.types";
import { HoursColumn } from "./hours-column";
import { HourCell } from "./hour-cell";
import { EventPublic } from "./event-public";


export function AgendaBody({
    weekDays,
    hours,
    events
}: {
    weekDays: Date[];
    hours: Date[];
    events: (Appointment | FullAppointment)[];
    isAdmin?: boolean
}) {
    const ROW_HEIGHT_REM = 5;
    const START_HOUR = 10;

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
            {weekDays.map((day, dayDifference) => (
                <div key={day.toISOString()} className="relative border-r border-muted-foreground last:border-r-0">
                    {hours.map(hour => (
                        <HourCell key={hour.getTime()} hour={hour} dayDifference={dayDifference} />
                    ))}

                    {events
                        .filter(event => isSameDay(day, event.startTime))
                        .map(event => (
                            <EventPublic
                                key={event.id}
                                event={event}
                                START_HOUR={START_HOUR}
                                ROW_HEIGHT_REM={ROW_HEIGHT_REM}
                            />
                        ))
                    }
                </div>
            ))}
        </main>
    );
}