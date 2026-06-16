import { format } from "date-fns";

interface HoursColumnProps { 
    hours: Date[]
}

export function HoursColumn({ hours } : HoursColumnProps) {
    return (
        <div className="col-span-1 border-r bg-secondary">
            {hours.map(hour => (
                <div
                    key={hour.toISOString()}
                    className="w-full flex items-start justify-center h-20 pt-3 border-b border-foreground text-sm md:text-md font-bold uppercase tracking-tighter"
                >
                    {format(hour, 'HH:mm')}
                </div>
            ))}
        </div>
    )
}