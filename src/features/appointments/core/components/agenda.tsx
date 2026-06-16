'use client'
import { useState, useEffect, useMemo } from "react";
import { startOfWeek, addDays, addHours, startOfDay, subDays, endOfDay } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { Appointment } from "@/db/schema";
import { FullAppointment } from "../types/appointments.types";
import { TIMEZONE } from "@/shared/lib/date";
import { AgendaHeader } from "./agenda-header";
import { AgendaBody } from "./agenda-body";

export function Agenda({
    events,
    today,
    isAdmin = false
}: {
    events: (Appointment | FullAppointment)[]
    today: TZDate
    isAdmin?: boolean
}) {
    const [daysToShow, setDaysToShow] = useState(3);
    const [viewDate, setViewDate] = useState<TZDate>(today);

    // Responsive Logic
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setDaysToShow(3);
            else if (window.innerWidth < 1024) setDaysToShow(5);
            else setDaysToShow(7);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const startOfView = daysToShow === 7
        ? startOfWeek(viewDate, { weekStartsOn: 1 })
        : startOfDay(viewDate);

    const endOfView = endOfDay(addDays(startOfView, daysToShow - 1));

    const visibleEvents = useMemo(() => events
        .filter(event => 
            event.startTime <= endOfView.toISOString() &&
            event.endTime >= startOfView.toISOString()
        )
    ,[events, startOfView, endOfView]);

    const weekDays = Array.from({ length: daysToShow }).map((_, i) => addDays(startOfView, i));

    const nextPeriod = () => setViewDate(prev => addDays(prev, daysToShow));
    const prevPeriod = () => setViewDate(prev => subDays(prev, daysToShow));

    const hours = Array.from({ length: 5 }).map((_, i) =>
        addHours(startOfDay(startOfView), 10 + (2.5 * i))
    );

    console.log(visibleEvents)

    return (
        <div className="w-full rounded-2xl border shadow-sm overflow-hidden relative">
            <AgendaHeader
                weekDays={weekDays}
                today={today}
                onNext={nextPeriod}
                onPrev={prevPeriod}
            />
            <AgendaBody
                isAdmin={isAdmin}
                weekDays={weekDays}
                hours={hours}
                events={visibleEvents}
            />

        </div>
    );
}