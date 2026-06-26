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
import { DatePickerRange } from "@/shared/components/form/date-picker-range"
import { BlockPeriodInput, blockPeriodSchema } from "../schemas/appointment-schema"
import { createBlockAction, deleteAppointmentAction, updateBlockAction } from "../actions/admin-appointment-actions"

export function BlockPeriodForm({
    blockPeriod,
    blockId
}: {
    blockPeriod?: BlockPeriodInput;
    blockId?: string;
}) {

    const isEditing = !!blockPeriod;
    const {
        handleSubmit,
        setValue,
        control,
        formState: { errors, isSubmitting }
    } = useForm<BlockPeriodInput>({
        resolver: zodResolver(blockPeriodSchema),
        defaultValues: blockPeriod ?? {
            startTime: new Date(),
            endTime: new Date()
        }
    })

    const onSubmit = async (data: BlockPeriodInput) => {
        
        const response = isEditing ?
            await updateBlockAction({
                startTime: data.startTime,
                endTime: data.endTime
            }, blockId!) :
            await createBlockAction({
                startTime: data.startTime,
                endTime: data.endTime
            });

        showResponse(response);
    }

    const submitLabel = isEditing ? 'Update Block' : 'Create Block'
    const submitLoadingLabel = isEditing ? 'Updating...' : 'Creating...'

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet disabled={isSubmitting}>
                <FieldGroup>
                    <DatePickerRange
                        control={control}
                        startTimeName="startTime"
                        endTimeName="endTime"
                        label="Custom Blocking Period"
                        setValue={setValue}
                    />
                </FieldGroup>

                <FieldSeparator />

                {errors.endTime && (
                    <FieldError>{errors.endTime.message}</FieldError>
                )}
                {errors.endTime && (
                    <FieldError>{errors.endTime.message}</FieldError>
                )}

                <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner />
                            <span>{submitLoadingLabel}</span>
                        </>
                    ) : (
                        <p>{submitLabel}</p>
                    )}


                </Button>
                {isEditing && (
                    <Button
                        onClick={async () => {
                            showResponse(await deleteAppointmentAction(blockId!, true))
                        }}
                        variant="destructive"
                        type="button"
                    >
                        Delete
                    </Button>
                )}
            </FieldSet>
        </form>
    )
}