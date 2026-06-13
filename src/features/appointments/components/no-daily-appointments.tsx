import { CalendarDays } from "lucide-react";

export default function NoDailyAppointments() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
            <CalendarDays className="w-8 h-8 opacity-40" />
            <p className="text-sm">Sin citas para hoy</p>
        </div>
    )
}