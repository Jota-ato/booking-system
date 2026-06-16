import { AppointmentStatus } from "@/db/schema";
import { format, isValid } from "date-fns"

export const translatedStatusMap: Record<AppointmentStatus, string> = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    PAID: 'paid',
    CANCELLED: 'cancelled',
    "NO_SHOW": "no show"
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