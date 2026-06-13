import { formateDailyDate, formatTime } from "@/shared/lib/date";

export function AppointmentRowTime({
    startTime,
    endTime,
    showDate = false
}: {
    startTime: string,
    endTime: string,
    showDate?: boolean
}) {
    return (
        <div className="flex flex-col gap-1 items-center min-w-15 text-center">

            {/* Renderizado condicional de la fecha */}
            {showDate && (
                <span className="text-xs font-medium text-primary mb-1 capitalize border-b border-border/50 pb-1 w-full">
                    {formateDailyDate(new Date(startTime))}
                </span>
            )}

            <div className="flex flex-col gap-0.5 items-center">
                <span className="text-sm font-semibold tabular-nums leading-tight">
                    {formatTime(new Date(startTime))}
                </span>
                <span className="text-[10px] text-muted-foreground leading-none md:my-0.5">▼</span>
                <span className="text-sm text-muted-foreground tabular-nums leading-tight">
                    {formatTime(new Date(endTime))}
                </span>
            </div>

        </div>
    )
}