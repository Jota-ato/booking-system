"use client"

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldSet
} from "@/shared/components/ui/field"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/components/ui/button"
import { Spinner } from "@/shared/components/ui/spinner"
import { DatePickerTime } from "@/shared/components/form/date-picker"
import { showResponse } from "@/shared/lib/client-actions"
import { BlockTimeInput, blockTimeSchema } from "../schemas/appointment-schema"
import { createBlockAction, deleteAppointmentAction, updateBlockAction } from "../actions/admin-appointment-actions"

export function BlockTimeForm({
    initialData,
    blockId
}: {
    initialData?: BlockTimeInput;
    blockId?: string;
}) {
    const isEditing = !!initialData;

    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<BlockTimeInput>({
        resolver: zodResolver(blockTimeSchema),
        defaultValues: initialData ?? {
            appointmentDate: new Date(),
            startTime: "10:00",
            endTime: "12:30",
        }
    })

    const onSubmit = async (data: BlockTimeInput) => {
        const [startHour, startMinutes] = data.startTime.split(':')
        const [endHour, endMinutes] = data.endTime.split(':')

        const startTime = new Date(data.appointmentDate)
        startTime.setHours(+startHour, +startMinutes, 0, 0)
        const endTime = new Date(data.appointmentDate)
        endTime.setHours(+endHour, +endMinutes, 0, 0)

        showResponse(isEditing ?
            await updateBlockAction({
                ...data,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString()
            }, blockId!) :
            await createBlockAction({
                ...data,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString()
            })
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet disabled={isSubmitting}>

                <FieldGroup>
                    <DatePickerTime
                        control={control}
                        appointmentDateName="appointmentDate"
                        startTimeName="startTime"
                        endTimeName="endTime"
                    />
                </FieldGroup>
                <FieldSeparator />
                {errors.appointmentDate && (
                    <FieldError>{errors.appointmentDate.message}</FieldError>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner />
                            {isEditing ? 'Guardando cambios...' : 'Bloqueando...'}
                        </>
                    ) : (
                        isEditing ? 'Guardar Cambios' : 'Bloquear Horario'
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