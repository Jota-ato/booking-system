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
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/shared/components/ui/input"
import { CustomSelect } from "../../core/components/services-select"
import { Service } from "@/db/schema"
import { useMemo } from "react"
import { formatMXN } from "@/shared/lib/currency"
import { Button } from "@/shared/components/ui/button"
import { Spinner } from "@/shared/components/ui/spinner"
import { DatePickerTime } from "@/shared/components/form/date-picker"
import { FieldSwitch } from "@/shared/components/form/field-switch"
import { showResponse } from "@/shared/lib/client-actions"
import { NewAppointmentManuallyInput, newAppointmentManuallySchema } from "../schemas/appointment-schema"
import { createManualAppointmentAction } from "../actions/admin-appointment-actions"
import { redirect } from "next/navigation"
import { ServiceWithExtras } from "@/features/services/types/service.types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { ArraySwitchController } from "@/features/services/components/extra-switch-controller"

export function NewAppointmentManuallyForm({
    services
}: {
    services: ServiceWithExtras[]
}) {

    const {
        handleSubmit,
        watch,
        register,
        reset,
        control,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<NewAppointmentManuallyInput>({
        resolver: zodResolver(newAppointmentManuallySchema),
        defaultValues: {
            isRegisterClient: true,
            adittionalPrice: 0,
            clientPhone: "",
            startTime: new Date(),
            endTime: new Date(),
            extrasId: []
        }
    })

    const isRegisterCLient = watch('isRegisterClient')
    const serviceId = watch('serviceId')
    const extrasId = watch('extrasId')

    const clientErrors = errors as FieldErrors<Extract<NewAppointmentManuallyInput, { isRegisterClient: false }>>;

    const servicePrice = useMemo(() => {
        if (!serviceId) return 0
        const selected = services.find(service => service.data.id === serviceId)
        return selected ? +selected.data.price : 0
    }, [serviceId, services])

    const availableExtras = useMemo(() => {
        const availableExtras = serviceId ? services.find(service => service.data.id === serviceId)?.extras : []
        if (!availableExtras) return []
        return availableExtras
    }, [serviceId])

    const extrasPrice = useMemo(() => {
        if (!availableExtras.length) return 0
        const activeExtras = availableExtras.filter(extra => extrasId.includes(extra.id))
        return activeExtras.reduce((acc, extra) => acc + +extra.price, 0)
    }, [availableExtras, extrasId])

    const create = async (data: NewAppointmentManuallyInput) => {
        const success = showResponse(await createManualAppointmentAction({
            ...data,
        }))

        if (success) {
            reset()
            redirect('/admin/agenda')
        }
    }

    return (
        <form onSubmit={handleSubmit(create)}>
            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="service">Service</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <FieldSet>
                        <FieldGroup>
                            <FieldSwitch
                                control={control}
                                name="isRegisterClient"
                                label="Is the client registered?"
                                description="If the client has made an appointment or you manually created one for them, this is true."
                            />

                            <FieldGroup>
                                <DatePickerTime control={control} setValue={setValue} startTimeName="startTime" endTimeName="endTime" />
                                {errors.endTime && <FieldError>{errors.endTime.message}</FieldError>}
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

                    </FieldSet>
                </TabsContent>
                <TabsContent value="service">
                    <FieldSet>
                        <FieldGroup>
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
                            <FieldSeparator />
                            <Field>
                                <FieldLabel htmlFor="extrasId">Extras</FieldLabel>
                                <FieldDescription>Select the extras you want to include in this appointment</FieldDescription>
                                {
                                    availableExtras.length ?
                                        availableExtras.map(extra => (
                                            <ArraySwitchController
                                                key={extra.id}
                                                control={control}
                                                name="extrasId"
                                                value={extra.id}
                                                label={extra.name}
                                            />
                                        ))
                                        : <p className="p-4 text-muted-foreground text-sm">No extras available</p>
                                }
                            </Field>
                            <FieldSeparator />
                            <div className="flex items-center justify-between gap-2">
                                <p className="flex flex-col justify-center text-sm">
                                    Service Price
                                    <span className="font-bold text-base">{formatMXN(+servicePrice)}</span>
                                </p>
                                <p className="flex flex-col justify-center text-sm">
                                    Extras Price
                                    <span className="font-bold text-base">{formatMXN(+extrasPrice)}</span>
                                </p>
                            </div>
                            <Field className="flex-1">
                                <FieldLabel htmlFor="adittionalPrice">Adittional price</FieldLabel>
                                <Input
                                    id="adittionalPrice"
                                    type="number"
                                    {...register('adittionalPrice', {
                                        setValueAs: (value) => value === "" ? 0 : +value,
                                    })}
                                />
                                {errors.adittionalPrice && (
                                    <FieldError>{errors.adittionalPrice.message}</FieldError>
                                )}
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </TabsContent>
            </Tabs>
            <Button
                type="submit"
                className="w-full mt-4"
                disabled={isSubmitting}
            >
                {isSubmitting ? <><Spinner />Creating...</> : 'Create'}
            </Button>
        </form>
    )
}