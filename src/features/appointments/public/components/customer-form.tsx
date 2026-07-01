"use client"

import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { useForm } from "react-hook-form"
import { UserInput, userSchema } from "../schemas/booking-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldSwitch } from "@/shared/components/form/field-switch"
import { FormSubmit } from "@/shared/components/form/form-submit"

export function CustomerForm() {

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
        console.log(data)
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
                                <Input
                                    id="phone"
                                    {...register("phone")}
                                    type="text"
                                    placeholder="Enter your phone number"
                                />
                                {errors.phone && (
                                    <FieldError>
                                        {errors.phone.message}
                                    </FieldError>
                                )}
                            </Field>
                        </>
                    ) : (
                        <Field>
                            <FieldLabel htmlFor="phone">Phone</FieldLabel>
                            <Input
                                id="phone"
                                {...register("phone")}
                                type="text"
                                placeholder="Enter your phone number"
                            />
                            {errors.phone && (
                                <FieldError>
                                    {errors.phone.message}
                                </FieldError>
                            )}
                        </Field>
                    )}
                </FieldGroup>
                <FormSubmit
                    isSubmitting={isSubmitting}
                    label="Submit"
                    submittingLabel="Submitting..."
                />
            </FieldSet>
        </form>
    )
}