"use client"

import {
    FieldGroup,
    FieldError,
    FieldSeparator,
    FieldSet
} from "@/shared/components/ui/field"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/components/ui/button"
import { Spinner } from "@/shared/components/ui/spinner"
import { showResponse } from "@/shared/lib/client-actions"
import { createTimeBlockAction } from "../actions/appointment-actions"
import { BlockPeriodInput, blockPeriodSchema } from "../schemas/appointment-schema"
import { DatePickerRange } from "@/shared/components/form/date-picker-range"

export function BlockPeriodForm() {
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<BlockPeriodInput>({
        resolver: zodResolver(blockPeriodSchema),
        defaultValues: {
            dateRange: { from: new Date(), to: undefined },
            startTime: "10:00",
            endTime: "20:00"
        }
    })

    const onSubmit = async (data: BlockPeriodInput) => {
        const [startHour, startMinutes] = data.startTime.split(':');
        const startDateTime = new Date(data.dateRange.from);
        startDateTime.setHours(Number(startHour), Number(startMinutes), 0, 0);

        const [endHour, endMinutes] = data.endTime.split(':');
        const endDateTime = new Date(data.dateRange.to);
        endDateTime.setHours(Number(endHour), Number(endMinutes), 0, 0);

        const response = await createTimeBlockAction({
            appointmentDate: startDateTime,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString()
        });

        showResponse(response);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet disabled={isSubmitting}>
                <FieldGroup>
                    <DatePickerRange
                        control={control}
                        dateRangeName="dateRange"
                        startTimeName="startTime"
                        endTimeName="endTime"
                        label="Custom Blocking Period"
                    />
                </FieldGroup>
                
                <FieldSeparator />
                
                {errors.endTime && (
                    <FieldError>{errors.endTime.message}</FieldError>
                )}
                {errors.dateRange && (
                    <FieldError>{errors.dateRange.message}</FieldError>
                )}

                <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner />
                            <span>Applying Custom Block...</span>
                        </>
                    ) : (
                        "Create Range Time Block"
                    )}
                </Button>
            </FieldSet>
        </form>
    )
}