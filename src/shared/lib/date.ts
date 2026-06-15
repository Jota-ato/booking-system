import { AppointmentStatus } from "@/db/schema";
import { format, isValid } from "date-fns"

export const translatedStatusMap: Record<AppointmentStatus, string> = {
    PENDING: 'pendiente',
    CONFIRMED: 'confirmado',
    COMPLETED: 'completado',
    PAID: 'pagado',
    CANCELLED: 'cancelado'
}

export const TIMEZONE = "America/Mexico_City";
export const formateDailyDate = (date: Date) => format(date, 'EEEE dd MMMM yyyy')

export const formatTime = (time: Date | string) => {
    const date = typeof time === "string"
        ? new Date(time)
        : time;

    if (!isValid(date)) {
        console.error("Invalid date:", time);
        return "";
    }

    return format(date, "HH:mm");
};