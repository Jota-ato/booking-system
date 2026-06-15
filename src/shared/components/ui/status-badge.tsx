import { AppointmentStatus } from "@/db/schema";
import { translatedStatusMap } from "@/shared/lib/date";
import { cn } from "@/shared/lib/utils";

interface DurationBadgeProps {
    status: AppointmentStatus
}

export const statusColorsMap: Record<AppointmentStatus, string> = {
    'PENDING': "bg-warning border-warning-foreground text-warning-foreground",
    'CONFIRMED': "bg-success border-success-foreground text-success-foreground",
    'PAID': "bg-info border-info-foreground text-info-foreground",
    'CANCELLED': "bg-destructive border-destructive-foreground text-destructive-foreground",
    "COMPLETED": "bg-primary border-primary-foreground text-primary-foreground"
};

export function StatusBadge({ status }: DurationBadgeProps) {

    return (
        <span className={cn("shrink-0 text-xs font-medium px-2 py-0.5 rounded-full tabular-nums", statusColorsMap[status])}>
            {translatedStatusMap[status]}
        </span>
    )
}