import { formatTime } from "@/shared/lib/date";
import { addHours } from "date-fns";

interface HoursColumnProps {
    hours: Date[]
}

export function HoursColumn({ hours }: HoursColumnProps) {
    return (
        <div className="col-span-1 border-r bg-secondary">
            {hours.map(hour => (
                <div
                    key={hour.toISOString()}
                    className="w-full flex flex-col items-center justify-evenly h-20 border-b border-foreground text-sm md:text-md text-muted-foreground"
                >
                    <span className="text-sm font-semibold tabular-nums leading-tight text-foreground">
                        {formatTime(hour)}
                    </span>
                    <span className="text-[9px] text-muted-foreground/60 leading-none my-0.5">▼</span>
                    <span className="text-sm text-muted-foreground tabular-nums leading-tight">
                        {formatTime(addHours(hour, 2.5))}
                    </span>
                </div>
            ))}
        </div>
    )
}