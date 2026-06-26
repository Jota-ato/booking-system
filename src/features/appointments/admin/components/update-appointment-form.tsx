"use client"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/components/ui/button"
import { Spinner } from "@/shared/components/ui/spinner"
import { appointmentStatusEnum, Service } from "@/db/schema"
import { CustomSelect } from "../../core/components/services-select"
import { DatePickerTime } from "@/shared/components/form/date-picker"
import { formatTime, translatedStatusMap } from "@/shared/lib/date"
import { showResponse } from "@/shared/lib/client-actions"
import { redirect } from "next/navigation"
import { useMemo } from "react"
import { formatMXN } from "@/shared/lib/currency"
import { AlertDialogCustom } from "@/shared/components/ui/alert-dialog-custom"
import { FullAppointment } from "../../core/types/appointments.types"
import { useAppointmentStore } from "../stores/appointment-store"
import { UpdateApointmentInput, updateAppointmentSchema } from "../schemas/appointment-schema"
import { deleteAppointmentAction, updateAppointmentAction } from "../actions/admin-appointment-actions"
import { ServiceWithExtras } from "@/features/services/types/service.types"

export function UpdateAppointmentForm({
    appointment,
    services
}: {
    appointment: FullAppointment
    services: ServiceWithExtras[]
}) {

    const { toggleEditDialogOpen: toggleOpen, setActiveEditingAppointment: setActiveAppointment } = useAppointmentStore()


    const {
        handleSubmit,
        register,
        watch,
        control,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<UpdateApointmentInput>({
        resolver: zodResolver(updateAppointmentSchema),
        defaultValues: {
            status: appointment.status,
            startTime: new Date(appointment.startTime),
            endTime: new Date(appointment.endTime),
            serviceId: appointment.serviceId,
            adittionalPrice: +appointment.adittionalPrice
        }
    })

    const update = async (data: UpdateApointmentInput) => {
        const success = showResponse(await updateAppointmentAction(
            {
                ...data,
            },
            appointment.id
        ));

        if (success) {
            reset(data)
            setActiveAppointment(undefined)
        }
    }

    const deleteAppointment = async () => {
        const success = showResponse(await deleteAppointmentAction(appointment.id))

        if (success) {
            toggleOpen()
            setActiveAppointment(undefined)
            reset()
        }
    }

    const serviceId = watch('serviceId')

    const servicePrice = useMemo(
        () => services.filter(service => service.data.id === serviceId)[0].data.price
        , [serviceId])

    return (
        <form onSubmit={handleSubmit(update)}>
            <FieldSet>
                <FieldGroup>
                    <DatePickerTime
                        control={control}
                        setValue={setValue}
                        startTimeName="startTime"
                        endTimeName="endTime"
                    />
                    {errors.startTime && <FieldError>{errors.startTime.message}</FieldError>}
                    {errors.endTime && <FieldError>{errors.endTime.message}</FieldError>}
                </FieldGroup>
                <FieldSeparator />


                <CustomSelect
                    control={control}
                    name="serviceId"
                    options={services.map((s) => ({ value: s.data.id, label: s.data.name }))}
                    groupLabel="Services"
                    placeholder="Select service"
                />
                {errors.serviceId && (
                    <FieldError>{errors.serviceId.message}</FieldError>
                )}

                <CustomSelect
                    control={control}
                    name="status"
                    groupLabel="Status"
                    placeholder="Select status"
                    options={appointmentStatusEnum.enumValues.map(s => ({ value: s, label: translatedStatusMap[s] }))}
                />
                {errors.status && (
                    <FieldError>{errors.status.message}</FieldError>
                )}

                <div className="flex gap-2">
                    <p className="flex flex-col justify-center">
                        Service Price
                        <span>{formatMXN(+servicePrice)}</span>
                    </p>
                    <Field>
                        <FieldLabel>Extra price</FieldLabel>
                        <Input
                            id="extraPrice"
                            type="number"
                            step={0.01}
                            {...register('adittionalPrice', {
                                setValueAs(value) {
                                    return +value
                                },
                            })}
                        />
                        {errors.adittionalPrice && (
                            <FieldError>
                                {errors.adittionalPrice.message}
                            </FieldError>
                        )}
                    </Field>
                </div>

                <div className="flex items-center gap-4 justify-end">
                    <AlertDialogCustom
                        actionLabel="Delete"
                        triggerLabel="Delete Appointment"
                        dialogDescription="This action cannot be undone"
                        dialogTitle={`Delete ${appointment.customer.name}'s appointment?`}
                        action={deleteAppointment}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <><Spinner />Updating...</> : 'Update'}
                    </Button>
                </div>
            </FieldSet>
        </form>
    )
}