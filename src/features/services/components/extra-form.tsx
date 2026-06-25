"use client"

import {
    FieldSet,
    FieldGroup,
    Field,
    FieldLabel,
    FieldError
} from "@/shared/components/ui/field"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExtraInput, extraSchema } from "../schemas/service-schema"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { FormSubmit } from "@/shared/components/form/form-submit"
import { showResponse } from "@/shared/lib/client-actions"
import { createExtraAction } from "../actions/extras-actions"


export function ExtraForm() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ExtraInput>({
        resolver: zodResolver(extraSchema),
    })

    const onSubmit = async (data: ExtraInput) => {
        showResponse(await createExtraAction(data))
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="name">Extra Name</FieldLabel>
                        <Input
                            type="text"
                            id="name"
                            {...register("name")}
                        />
                        {errors.name && <FieldError>{errors.name.message}</FieldError>}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="description">Extra description</FieldLabel>
                        <Textarea
                            id="description"
                            {...register("description")}
                        />
                        {errors.description && <FieldError>{errors.description.message}</FieldError>}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="price">Extra price</FieldLabel>
                        <Input
                            type="number"
                            id="price"
                            {...register("price", { valueAsNumber: true })}
                        />
                        {errors.price && <FieldError>{errors.price.message}</FieldError>}
                    </Field>
                </FieldGroup>
                <FormSubmit
                    isSubmitting={isSubmitting}
                    label="Create extra"
                    submittingLabel="Creating..."
                />
            </FieldSet>
        </form>
    )
}