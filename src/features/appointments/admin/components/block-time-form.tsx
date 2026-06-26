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
        setValue,
        control,
        formState: { errors, isSubmitting }
    } = useForm<BlockTimeInput>({
        resolver: zodResolver(blockTimeSchema),
        defaultValues: initialData ?? {
            startTime: new Date(),
            endTime: new Date(),
        }
    })

    const onSubmit = async (data: BlockTimeInput) => {
        

        showResponse(isEditing ?
            await updateBlockAction({
                ...data,
            }, blockId!) :
            await createBlockAction({
                ...data,
            })
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet disabled={isSubmitting}>

                <FieldGroup>
                    <DatePickerTime
                        setValue={setValue}
                        control={control}
                        startTimeName="startTime"
                        endTimeName="endTime"
                    />
                </FieldGroup>
                <FieldSeparator />
                {errors.endTime && (
                    <FieldError>{errors.endTime.message}</FieldError>
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