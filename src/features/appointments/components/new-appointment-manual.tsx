"use client"

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldSet
} from "@/shared/components/ui/field"
import { useForm, FieldErrors } from "react-hook-form"
import { NewAppointmentManuallyInput, newAppointmentManuallySchema } from "../schemas/appointment-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/shared/components/ui/input"
import { CustomSelect } from "./services-select"
import { Service } from "@/db/schema"
import { useMemo } from "react"
import { formatMXN } from "@/shared/lib/currency"
import { Button } from "@/shared/components/ui/button"
import { Spinner } from "@/shared/components/ui/spinner"
import { DatePickerTime } from "@/shared/components/form/date-picker"
import { FieldSwitch } from "@/shared/components/form/field-switch"
import { showResponse } from "@/shared/lib/client-actions"
import { createManualAppointmentAction } from "../actions/appointment-actions"

export function NewAppointmentManuallyForm({
    services
}: {
    services: Service[]
}) {

    const {
        handleSubmit,
        watch,
        register,
        control,
        formState: { errors, isSubmitting }
    } = useForm<NewAppointmentManuallyInput>({
        resolver: zodResolver(newAppointmentManuallySchema),
        defaultValues: {
            isRegisterClient: true,
            extrasPrice: 0,
            clientPhone: "",
            appointmentDate: new Date(),
            startTime: '10:00',
            endTime: "12:30",
        }
    })

    const isRegisterCLient = watch('isRegisterClient')
    const serviceId = watch('serviceId')

    const clientErrors = errors as FieldErrors<Extract<NewAppointmentManuallyInput, { isRegisterClient: false }>>;

    const servicePrice = useMemo(() => {
        if (!serviceId) return 0
        const selected = services.find(service => service.id === serviceId)
        return selected ? selected.price : 0
    }, [serviceId, services])

    const create = async (data: NewAppointmentManuallyInput) => {
        const [startHour, startMinutes] = data.startTime.split(':')
        const [endHour, endMinutes] = data.endTime.split(':')

        const startTime = new Date(data.appointmentDate)
        startTime.setHours(+startHour, +startMinutes, 0, 0)
        const endTime = new Date(data.appointmentDate)
        endTime.setHours(+endHour, +endMinutes, 0, 0)
        const success = showResponse(await createManualAppointmentAction({
            ...data,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString()
        }))
    }

    return (
        <form onSubmit={handleSubmit(create)}>
            <FieldSet>
                <FieldGroup>
                    <FieldSwitch
                        control={control}
                        name="isRegisterClient"
                        label="Is the client registered?"
                        description="If the client has made an appointment or you manually created one for them, this is true."
                    />

                    <FieldGroup>
                        <DatePickerTime
                            control={control}
                            appointmentDateName="appointmentDate"
                            startTimeName="startTime"
                            endTimeName="endTime"
                        />
                    </FieldGroup>
                    <FieldSeparator />


                    <Field>
                        <FieldLabel htmlFor="clientPhone">Client phone</FieldLabel>
                        <FieldDescription>With national number (e.g., +52 for Mexico)</FieldDescription>
                        <Input
                            id="clientPhone"
                            type="tel"
                            {...register('clientPhone')}
                        />
                        {errors.clientPhone && (
                            <FieldError>{errors.clientPhone.message}</FieldError>
                        )}
                    </Field>

                    {!isRegisterCLient && (
                        <>
                            <Field>
                                <FieldLabel htmlFor="clientName">Client Name</FieldLabel>
                                <Input
                                    id="clientName"
                                    {...register('clientName')}
                                />
                                {clientErrors.clientName && (
                                    <FieldError>{clientErrors.clientName.message}</FieldError>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="clientLastName">Client Last Name</FieldLabel>
                                <Input
                                    id="clientLastName"
                                    {...register('clientLastName')}
                                />
                                {clientErrors.clientLastName && (
                                    <FieldError>{clientErrors.clientLastName.message}</FieldError>
                                )}
                            </Field>
                        </>
                    )}
                </FieldGroup>

                <FieldSeparator />

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

                <div className="flex gap-2">
                    <p className="flex flex-col justify-center text-sm">
                        Service Price
                        <span className="font-bold text-base">{formatMXN(+servicePrice)}</span>
                    </p>
                    <Field className="flex-1">
                        <FieldLabel htmlFor="extraPrice">Extra price</FieldLabel>
                        <Input
                            id="extraPrice"
                            type="number"
                            {...register('extrasPrice', {
                                setValueAs: (value) => value === "" ? 0 : +value,
                            })}
                        />
                        {errors.extrasPrice && (
                            <FieldError>{errors.extrasPrice.message}</FieldError>
                        )}
                    </Field>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <><Spinner />Creating...</> : 'Create'}
                </Button>
            </FieldSet>
        </form>
    )
}