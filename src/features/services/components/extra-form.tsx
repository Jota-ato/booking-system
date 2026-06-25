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
import { createExtraAction, deleteExtraAction, editExtraAction, reactivateExtraAction } from "../actions/extras-actions"
import { Extra } from "@/db/schema"
import { useExtraStore } from "../stores/extra-store"
import { AlertDialogCustom } from "@/shared/components/ui/alert-dialog-custom"


export function ExtraForm({
    extra
}: {
    extra?: Extra
}) {

    const isEditing = !!extra

    const defaultValues = extra ? {
        name: extra.name,
        description: extra.description,
        price: +extra.price
    } : {
        name: "",
        description: "",
        price: 0
    }

    const { toggleOpen, setActiveExtra } = useExtraStore()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ExtraInput>({
        resolver: zodResolver(extraSchema),
        defaultValues
    })

    const onSubmit = async (data: ExtraInput) => {
        if (isEditing) {
            showResponse(await editExtraAction(data, extra.id, extra.isActive))
            setActiveExtra(null)
            toggleOpen()
        } else {
            showResponse(await createExtraAction(data))
        }
    }

    const deleteExtra = async () => {
        if (!extra) return
        showResponse(await deleteExtraAction(extra.id))
        setActiveExtra(null)
        toggleOpen()
    }

    const reactivateExtra = async () => {
        if (!extra) return
        showResponse(await reactivateExtraAction(extra.id))
        setActiveExtra(null)
        toggleOpen()
    }

    const label = isEditing ? "Edit extra" : "Create extra"
    const submittingLabel = isEditing ? "Editing..." : "Creating..."

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
                            step={0.01}
                            {...register("price", { valueAsNumber: true })}
                        />
                        {errors.price && <FieldError>{errors.price.message}</FieldError>}
                    </Field>
                </FieldGroup>
                <FormSubmit
                    isSubmitting={isSubmitting}
                    label={label}
                    submittingLabel={submittingLabel}
                />
                {(isEditing && extra.isActive) &&
                    <AlertDialogCustom
                        actionLabel="Delete"
                        triggerLabel="Delete Extra"
                        dialogDescription="This action cannot be undone"
                        dialogTitle={`Delete ${extra.name}'s extra?`}
                        action={deleteExtra}
                    />
                }

                {(isEditing && !extra.isActive) &&
                    <AlertDialogCustom
                        actionLabel="Reactivate"
                        triggerLabel="Reactivate Extra"
                        dialogDescription="This action cannot be undone"
                        dialogTitle={`Reactivate ${extra.name}'s extra?`}
                        buttonVariant="outline"
                        action={reactivateExtra}
                    />
                }
            </FieldSet>
        </form>
    )
}