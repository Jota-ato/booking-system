"use client"
import { FormSubmit } from "@/shared/components/form/form-submit"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { useForm } from "react-hook-form"
import { ContactInput, contactSchema } from "../schemas/contact-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { showResponse } from "@/shared/lib/client-actions"
import { sendContactFormAction } from "../actions/contact-actions"

export function ContactForm() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ContactInput>({
        resolver: zodResolver(contactSchema),
    })

    const sendForm = async (data: ContactInput) => {
        showResponse(await sendContactFormAction(data))
    }

    return (
        <form onSubmit={handleSubmit(sendForm)}>
            <FieldSet>
                <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field>
                        <FieldLabel
                            htmlFor="name"
                        >
                            Name
                        </FieldLabel>
                        <Input
                            type="text"
                            id="name"
                            {...register("name")}
                        />
                        {errors.name && (
                            <FieldError>
                                {errors.name.message}
                            </FieldError>
                        )}
                    </Field>
                    <Field>
                        <FieldLabel
                            htmlFor="lastName"
                        >
                            Last Name
                        </FieldLabel>
                        <Input
                            type="text"
                            id="lastName"
                            {...register("lastName")}
                        />
                        {errors.lastName && (
                            <FieldError>
                                {errors.lastName.message}
                            </FieldError>
                        )}
                    </Field>
                    <Field className="sm:col-span-2">
                        <FieldLabel
                            htmlFor="email"
                        >
                            Email
                        </FieldLabel>
                        <Input
                            type="email"
                            id="email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <FieldError>
                                {errors.email.message}
                            </FieldError>
                        )}
                    </Field>
                    <Field className="sm:col-span-2">
                        <FieldLabel
                            htmlFor="message"
                        >
                            How can we help you?
                        </FieldLabel>
                        <Textarea
                            id="message"
                            {...register("message")}
                        />
                        {errors.message && (
                            <FieldError>
                                {errors.message.message}
                            </FieldError>
                        )}
                    </Field>
                </FieldGroup>
                <FormSubmit
                    isSubmitting={isSubmitting}
                    label="Send"
                    submittingLabel="Sending..."
                />
            </FieldSet>
        </form>
    )
}