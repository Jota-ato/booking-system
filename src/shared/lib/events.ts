import { Appointment } from "@/db/schema";
import { FullAppointment } from "@/features/appointments/core/types/appointments.types";
import { max, min, differenceInMinutes } from "date-fns";

export const calculateRelativePoints = (
	relativeBase: string,
	START_HOUR: number,
	END_HOUR: number
): {
	relativeStart: Date
	relativeEnd: Date
} => {
	const relativeStart = new Date(relativeBase)
	relativeStart.setHours(START_HOUR, 0, 0, 0)
	const relativeEnd = new Date(relativeBase)
	relativeEnd.setHours(END_HOUR, 0, 0, 0)
	
	return {
		relativeStart,
		relativeEnd
	}
}

export const calculateRelativeTime = (
	event: Appointment | FullAppointment,
	relativeStart: Date,
	relativeEnd: Date
): {
	effectiveStart: Date,
	effectiveEnd: Date
} => {
	const absoluteStart = new Date(event.startTime)
	const absoluteEnd = new Date(event.endTime)
	
	const effectiveStart = max([
		relativeStart,
		absoluteStart
	])
	
	const effectiveEnd = min([
		relativeEnd,
		absoluteEnd
	])
	
	return {
		effectiveStart,
		effectiveEnd
	}
}
	
export const calculateEventDuration = (
	effectiveStart: Date,
	effectiveEnd: Date,
	startBase: Date
): {
	minutesFromStart: number,
	durationMinutes: number
} => ({
	minutesFromStart: differenceInMinutes(effectiveStart, startBase),
	durationMinutes: differenceInMinutes(effectiveEnd, effectiveStart)
})
	
export const calculateEventDimensions = (
	minutesFromStart: number,
	durationMinutes: number,
	ROW_HEIGHT_REM: number,
	ROW_DURATION_MINUTES: number
): {
	topOffset: number,
	height: number
} => {
	const topOffset = (minutesFromStart * ROW_HEIGHT_REM) / ROW_DURATION_MINUTES;
    const height = (durationMinutes * ROW_HEIGHT_REM) / ROW_DURATION_MINUTES;
    
    return {
	    topOffset,
	    height
    }
}