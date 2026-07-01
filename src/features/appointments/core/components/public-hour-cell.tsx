"use client"
import { addHours } from "date-fns";
import { useBookingStore } from "../../public/store/booking-store";
import { HourCell } from "./hour-cell";

export function PublicHourCell({
    hour,
    dayDifference
}: {
    hour: Date
    dayDifference: number
}) {

    const { setTime, setStep } = useBookingStore()

    return (
        <div
            onClick={() => {
                const startTime = new Date(hour)
                const endTime = new Date(addHours(hour, 2.5))
                setTime({ startTime, endTime })
                setStep(3)
            }}
        >
            <HourCell />
        </div>
    )
}