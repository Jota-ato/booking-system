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
import { translatedStatusMap } from "@/shared/lib/date"
import { showResponse } from "@/shared/lib/actions"
import { updateAppointmentAction } from "../actions/appointment-actions"

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
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<UpdateApointmentInput>({
        resolver: zodResolver(updateAppointmentSchema),
        defaultValues: {
            status: appointment.status,
            appointmentDate: appointment.appointmentDate,
            startTime: new Date(appointment.startTime),
            endTime: new Date(appointment.endTime),
            serviceId: appointment.serviceId,
        }
    })

    const update = async (data: UpdateApointmentInput) => {
        const success = showResponse(await updateAppointmentAction(data, appointment.id))
    }

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
                    options={appointmentStatusEnum.enumValues.map(s => ({value: s, label: translatedStatusMap[s]}))}
                />
                {errors.status && (
                    <FieldError>{errors.status.message}</FieldError>
                )}

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