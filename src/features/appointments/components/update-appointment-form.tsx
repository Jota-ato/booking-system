"use client"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field"
import { FullAppointment } from "../types/appointments.types"
import { Input } from "@/shared/components/ui/input"
import { useForm } from "react-hook-form"
import { UpdateApointmentInput, updateAppointmentSchema } from "../schemas/appointment-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/components/ui/button"
import { Spinner } from "@/shared/components/ui/spinner"
import { Service } from "@/db/schema"
import { ServicesSelect } from "./services-select"



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
            serviceId: appointment.serviceId
        }
    })

    const update = async (data: UpdateApointmentInput) => {

    }

    return (
        <form onSubmit={handleSubmit(update)}>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel>
                            Date
                        </FieldLabel>
                        {/**TODO add datepicker */}
                    </Field>
                    <Field>
                        <FieldLabel>Start time</FieldLabel>
                        <Input type="time" />
                    </Field>
                    <Field>
                        <FieldLabel>End time</FieldLabel>
                        <Input type="time" />
                    </Field>
                </FieldGroup>

                <ServicesSelect 
                    services={services}
                />

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