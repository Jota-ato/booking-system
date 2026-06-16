import { Sparkles, User, CalendarDays, Ban } from "lucide-react";
import { format } from "date-fns";
import { FullAppointment } from "../../core/types/appointments.types";

interface AppointmentRowDetailsProps {
    appointment: FullAppointment;
    isBlock?: boolean;
    isMultiDay?: boolean;
}

export function AppointmentRowDetails({
    appointment,
    isBlock = false,
    isMultiDay = false
}: AppointmentRowDetailsProps) {
    const { customer: { name: clientName }, startTime, endTime } = appointment

    const startFormatted = format(new Date(startTime), "MMM dd");
    const endFormatted = format(new Date(endTime), "MMM dd");

    return (
        <li className="px-2 list-none">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
                <h3 className="flex items-center gap-1.5">
                    {isBlock ? (
                        <>
                            <Ban className="size-3.5 text-amber-600 shrink-0" />
                            <span className="text-sm font-semibold tracking-tight text-amber-700 dark:text-amber-500">
                                Schedule Blocked
                            </span>
                        </>
                    ) : (
                        <>
                            <User className="size-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm font-medium capitalize text-accent-foreground">{clientName}</span>
                        </>
                    )}
                </h3>

                <div className="flex items-center gap-1">
                    {isBlock ? (
                        isMultiDay ? (
                            <>
                                <CalendarDays className="size-3.5 text-muted-foreground shrink-0" />
                                <p className="text-xs text-muted-foreground font-medium">
                                    Period: <span className="text-foreground font-semibold">{startFormatted}</span> to <span className="text-foreground font-semibold">{endFormatted}</span>
                                </p>
                            </>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                Single-day availability restriction.
                            </p>
                        )
                    ) : (
                        <>
                            <Sparkles className="size-3.5 text-muted-foreground shrink-0" />
                            <p className="text-xs text-muted-foreground">
                                Service <span className="text-accent-foreground">{appointment.service.name}</span>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </li>
    )
}