import { AppointmentStatus } from "@/db/schema";
import { format } from "date-fns"

export const translatedStatusMap: Record<AppointmentStatus, string> = {
    PENDING: 'pendiente',
    CONFIRMED: 'confirmado',
    COMPLETED: 'completado',
    PAID: 'pagado',
    CANCELLED: 'cancelado'
}

export const TIMEZONE = "America/Mexico_City";
export const formateDailyDate = (date: Date) => format(date, 'EEEE dd MMMM yyyy') 
export const formatTime = (time: Date) => format(time, 'HH:mm')