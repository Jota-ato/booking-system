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
import { Controller, useForm, FieldErrors } from "react-hook-form"
import { NewAppointmentManuallyInput, newAppointmentManuallySchema } from "../schemas/appointment-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { CustomSelect } from "./services-select"
import { Service } from "@/db/schema"
import { useMemo } from "react"
import { formatMXN } from "@/shared/lib/currency"
import { Button } from "@/shared/components/ui/button"
import { Spinner } from "@/shared/components/ui/spinner"
import { DatePickerTime } from "@/shared/components/form/date-picker"

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
            extraPrice: 0
        }
    })

    const isRegisterCLient = watch('isRegisterClient')
    const serviceId = watch('serviceId')
    const clientErrors = errors as FieldErrors<Extract<NewAppointmentManuallyInput, { isRegisterClient: false }>>;

    const servicePrice = useMemo(
        () => {
            if (!serviceId)
                return 0
            return services.filter(service => service.id === serviceId)[0].price
        }
        , [serviceId])

    const create = async (data: NewAppointmentManuallyInput) => {
        console.log('creating...')
    }

    return (
        <form
            onSubmit={handleSubmit(create)}
        >
            <FieldSet>
                <FieldGroup>
                    <Field orientation={'horizontal'}>
                        <FieldContent>
                            <FieldLabel>
                                Is the client register?
                            </FieldLabel>
                            <FieldDescription>
                                If the client had make and appointment or you manually create and appointment for him this is true
                            </FieldDescription>
                        </FieldContent>
                        <Controller
                            control={control}
                            name="isRegisterClient"
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>
                            Client phone
                        </FieldLabel>
                        <FieldDescription>
                            With national number (exp. +52 for Mexico)
                        </FieldDescription>
                        <Input
                            type="number"
                        />
                        {errors.clientPhone && (
                            <FieldError>
                                {errors.clientPhone.message}
                            </FieldError>
                        )}
                    </Field>
                    {/**TODO 
                     * If not register add name and lastname fields
                    */}
                    {!isRegisterCLient && (
                        <>
                            <Field>
                                <FieldLabel htmlFor="clientName">Client Name</FieldLabel>
                                <Input
                                    id="clientName"
                                    {...register('clientName')}
                                />
                                {errors['clientName' as keyof typeof errors] && (
                                    <FieldError>
                                        {(errors['clientName' as keyof typeof errors] as any).message}
                                    </FieldError>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="clientLastName">Client Last Name</FieldLabel>
                                <Input
                                    id="clientLastName"
                                    {...register('clientLastName')}
                                />
                                {errors['clientLastName' as keyof typeof errors] && (
                                    <FieldError>
                                        {(errors['clientLastName' as keyof typeof errors] as any).message}
                                    </FieldError>
                                )}
                            </Field>
                        </>
                    )}
                </FieldGroup>
                <FieldSeparator />

                <FieldGroup>
                    <DatePickerTime
                        control={control}
                        appointmentDateName="appointmentDate"
                        startTimeName="startTime"
                        endTimeName="endTime"
                    />
                    {errors.appointmentDate && (
                        <FieldError>
                            {errors.appointmentDate.message}
                        </FieldError>
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
                    <p className="flex flex-col justify-center">
                        Service Price
                        <span>{formatMXN(+servicePrice)}</span>
                    </p>
                    <Field>
                        <FieldLabel>Extra price</FieldLabel>
                        <Input
                            id="extraPrice"
                            type="number"
                            {...register('extraPrice', {
                                setValueAs(value) {
                                    return +value
                                },
                            })}
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
                    {isSubmitting ? <><Spinner />Creating...</> : 'Create'}
                </Button>
            </FieldSet>
        </form>
    )
}