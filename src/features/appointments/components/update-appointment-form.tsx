"use client"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/shared/components/ui/field"
import { FullAppointment } from "../types/appointments.types"
import { Input } from "@/shared/components/ui/input"
import { useForm } from "react-hook-form"
import { appointmentStatusSchema, UpdateApointmentInput, updateAppointmentSchema } from "../schemas/appointment-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/components/ui/button"
import { Spinner } from "@/shared/components/ui/spinner"
import { appointmentStatusEnum, Service } from "@/db/schema"
import { CustomSelect } from "./services-select"
import { DatePickerTime } from "@/shared/components/form/date-picker"
import { formatTime, translatedStatusMap } from "@/shared/lib/date"
import { showResponse } from "@/shared/lib/actions"
import { updateAppointmentAction } from "../actions/appointment-actions"
import { redirect } from "next/navigation"
import { useMemo } from "react"
import { formatMXN } from "@/shared/lib/currency"

const statusMap = [
    {

    }
]

export function UpdateAppointmentForm({
    appointment,
    services
}: {
    appointment: FullAppointment
    services: Service[]
}) {

    const {
        handleSubmit,
        register,
        watch,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<UpdateApointmentInput>({
        resolver: zodResolver(updateAppointmentSchema),
        defaultValues: {
            status: appointment.status,
            appointmentDate: appointment.appointmentDate,
            startTime: formatTime(appointment.startTime),
            endTime: formatTime(appointment.endTime),
            serviceId: appointment.serviceId,
            extraPrice: +appointment.extrasPrice
        }
    })

    const update = async (data: UpdateApointmentInput) => {
        const [startHour, startMinutes] = data.startTime.split(':')
        const [endHour, endMinutes] = data.endTime.split(':')

        const startTime = new Date(data.appointmentDate)
        startTime.setHours(+startHour, +startMinutes, 0, 0)
        const endTime = new Date(data.appointmentDate)
        endTime.setHours(+endHour, +endMinutes, 0, 0)

        const success = showResponse(await updateAppointmentAction(
            {
                ...data,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString()
            }
            , appointment.id
        )
        )
        if (success) {
            reset(data)
            redirect('/admin')
        }
    }

    const serviceId = watch('serviceId')

    const servicePrice = useMemo(
        () => services.filter(service => service.id === serviceId)[0].price
    , [serviceId])

    return (
        <form onSubmit={handleSubmit(update)}>
            <FieldSet>
                <FieldGroup>
                    <DatePickerTime
                        control={control}
                        appointmentDateName="appointmentDate"
                        startTimeName="startTime"
                        endTimeName="endTime"
                    />
                    <FieldSeparator />

                </FieldGroup>

                <CustomSelect
                    control={control}
                    name="serviceId"
                    options={services.map((s) => ({ value: s.id, label: s.name }))}
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
                        Precio del servicio
                        <span>{formatMXN(+servicePrice)}</span>
                    </p>
                    <Field>
                        <FieldLabel>Precio extra</FieldLabel>
                        <Input 
                            id="extraPrice"
                            type="number"
                            {...register('extraPrice', {setValueAs(value) {
                                return +value
                            },})}
                        />
                        {errors.extraPrice && (
                            <FieldError>
                                {errors.extraPrice.message}
                            </FieldError>
                        )}
                    </Field>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <><Spinner />Actualizando...</> : 'Actualizar'}
                </Button>
            </FieldSet>
        </form>
    )
}