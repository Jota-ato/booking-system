"use client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Extra, Service } from "@/db/schema";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/shared/components/ui/tabs"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { ServiceInput, serviceSchema } from "../schemas/service-schema";
import { ExtraSwitchController } from "./extra-switch-controller";
import { FormSubmit } from "@/shared/components/form/form-submit";
import ImageUploader from "@/shared/components/upload/image-uploader";
import { showResponse } from "@/shared/lib/client-actions";
import { createServiceAction, updateServiceAction } from "../actions/service-actions";
import { ServiceWithExtras } from "../types/service.types";

export function ServiceForm({
    service,
    extras
}: {
    service?: ServiceWithExtras
    extras: Extra[]
}) {

    const isEditing = !!service

    const serviceExtras = service ? service.extras : []

    const includedExtras = serviceExtras.map(extra => extra.included ? extra.extraId : null).filter(id => id !== null)
    const availableExtras = serviceExtras.map(extra => !extra.included ? extra.extraId : null).filter(id => id !== null)

    const defaultValues = service ? {
        name: service.data.name,
        description: service.data.description ? service.data.description : "",
        price: +service.data.price,
        image: service.data.image ? service.data.image : "",
        includedExtras,
        availableExtras
    } : {
        name: "",
        description: "",
        price: 0,
        image: "",
        includedExtras: [],
        availableExtras: []
    }

    const {
        control,
        handleSubmit,
        register,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ServiceInput>({
        resolver: zodResolver(serviceSchema),
        defaultValues
    })

    const image = watch("image")

    const createService = async (data: ServiceInput) => {
        console.log(data)
        showResponse(isEditing ?
            await updateServiceAction(data)
            : await createServiceAction(data)
        );
    }

    const buttonLabel = isEditing ? "Update service" : "Create service"
    const submittingLabel = isEditing ? "Updating service..." : "Creating service..."

    return (
        <form onSubmit={handleSubmit(createService)}>
            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="includedExtras">Included Extras</TabsTrigger>
                    <TabsTrigger value="availableExtras">Available Extras</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">
                                    Service name
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
                                <FieldLabel htmlFor="description">
                                    Service description
                                </FieldLabel>
                                <Textarea
                                    id="description"
                                    {...register("description")}
                                />
                                {errors.description && (
                                    <FieldError>
                                        {errors.description.message}
                                    </FieldError>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="price">
                                    Service price
                                </FieldLabel>
                                <Input
                                    type="number"
                                    id="price"
                                    {...register("price", { valueAsNumber: true })}
                                />
                                {errors.price && (
                                    <FieldError>
                                        {errors.price.message}
                                    </FieldError>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="image">Service image</FieldLabel>
                                <ImageUploader
                                    label="Image service"
                                    image={image}
                                    onChange={(url) => setValue("image", url ? url : "", { shouldValidate: true })}
                                />
                                {errors.image && (
                                    <FieldError>
                                        {errors.image.message}
                                    </FieldError>
                                )}
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </TabsContent>
                <TabsContent value="availableExtras">
                    <FieldSet>
                        {extras.map(extra => (
                            <ExtraSwitchController
                                key={extra.id}
                                control={control}
                                name="availableExtras"
                                extra={extra}
                            />
                        ))}
                    </FieldSet>
                </TabsContent>
                <TabsContent value="includedExtras">
                    <FieldSet>
                        {extras.map(extra => (
                            <ExtraSwitchController
                                key={extra.id}
                                control={control}
                                name="includedExtras"
                                extra={extra}
                            />
                        ))}
                    </FieldSet>
                </TabsContent>
            </Tabs>
            <FormSubmit
                className="mt-4"
                isSubmitting={isSubmitting}
                label={buttonLabel}
                submittingLabel={submittingLabel}
            />
        </form>
    )
}