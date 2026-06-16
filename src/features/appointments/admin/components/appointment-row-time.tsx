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
        <div className="flex flex-col gap-1 items-center min-w-16 text-center">

            {showDate && (
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-sm mb-1 w-full tracking-wider">
                    Starts
                </span>
            )}

            <div className="flex flex-col gap-0.5 items-center">
                <span className="text-sm font-semibold tabular-nums leading-tight text-foreground">
                    {formatTime(new Date(startTime))}
                </span>
                <span className="text-[9px] text-muted-foreground/60 leading-none my-0.5">▼</span>
                <span className="text-sm text-muted-foreground tabular-nums leading-tight">
                    {formatTime(new Date(endTime))}
                </span>
            </div>

        </div>
    )
}