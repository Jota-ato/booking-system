"use client"

import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { useForm } from "react-hook-form"
import { UserInput, userSchema } from "../schemas/booking-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldSwitch } from "@/shared/components/form/field-switch"
import { FormSubmit } from "@/shared/components/form/form-submit"
import { showResponse } from "@/shared/lib/client-actions"
import { getUserAction, registerUserAction } from "../actions/booking-actions"
import { cn } from "@/shared/lib/utils"
import { isCustomer } from "../helpers/customer"
import { useBookingStore } from "../store/booking-store"

export function CustomerForm() {

    const { setCustomerId, setStep } = useBookingStore()
    const {
        handleSubmit,
        control,
        register,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<UserInput>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            isFirstTime: true,
            phone: ""
        }
    })

    const isFirstTime = watch("isFirstTime")
    const submit = async (data: UserInput) => {
        const phone = `+${data.countryCode}${data.phone}`
        if (!isFirstTime) {
            const response = showResponse(await getUserAction(phone))
            if (!response) return
            setCustomerId(response.data.id)
            setStep(4)
        }
        if (isFirstTime) {
            const response = showResponse(await registerUserAction(data))
            if (!response) return
            setCustomerId(response.data.id)
            setStep(4)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="mx-auto max-w-xl">
            <FieldSet>
                <FieldSwitch
                    label="Is your first time booking with us?"
                    name="isFirstTime"
                    control={control}
                />
                <FieldGroup>
                    {isFirstTime ? (
                        <>
                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    type="text"
                                    placeholder="Enter your name"
                                />
                                {("name" in errors && errors.name) && (
                                    <FieldError>
                                        {errors.name.message}
                                    </FieldError>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                                <Input
                                    id="lastName"
                                    {...register("lastName")}
                                    type="text"
                                    placeholder="Enter your last name"
                                />
                                {("lastName" in errors && errors.lastName) && (
                                    <FieldError>
                                        {errors.lastName.message}
                                    </FieldError>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                <div className="flex gap-2">
                                    <Input
                                        id="countryCode"
                                        {...register("countryCode")}
                                        type="text"
                                        placeholder="+52"
                                        maxLength={5}
                                        className={cn("w-20",
                                            errors.countryCode ? "border-2 animate-pulse border-red-500" : ""
                                        )}
                                    />
                                    <Input
                                        id="phone"
                                        {...register("phone")}
                                        type="text"
                                        placeholder="1234567890"
                                        className={cn(
                                            errors.phone ? "border-2 animate-pulse border-red-500" : ""
                                        )}
                                    />
                                </div>
                            </Field>
                        </>
                    ) : (
                        <Field>
                            <FieldLabel htmlFor="phone">Phone</FieldLabel>
                            <div className="flex gap-2">
                                <Input
                                    id="countryCode"
                                    {...register("countryCode")}
                                    type="text"
                                    placeholder="+52"
                                    maxLength={5}
                                    className={cn("w-20",
                                        errors.countryCode ? "border-2 animate-pulse border-red-500" : ""
                                    )}
                                />
                                <Input
                                    id="phone"
                                    {...register("phone")}
                                    type="text"
                                    placeholder="1234567890"
                                    className={cn(
                                        errors.phone ? "border-2 animate-pulse border-red-500" : ""
                                    )}
                                />
                            </div>
                        </Field>
                    )}
                </FieldGroup>
                <FormSubmit
                    isSubmitting={isSubmitting}
                    label="Check"
                    submittingLabel="Checking..."
                />
            </FieldSet>
        </form>
    )
}