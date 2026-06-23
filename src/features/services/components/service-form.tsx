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
import { Button } from "@/shared/components/ui/button";
import { ServiceInput, serviceSchema } from "../schemas/service-schema";
import { ExtraSwitchController } from "./extra-switch-controller";
import { FormSubmit } from "@/shared/components/form/form-submit";



export function ServiceForm({
    service,
    extras
}: {
    service?: Service
    extras: Extra[]
}) {

    const {
        control,
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<ServiceInput>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            includedExtras: [],
            availableExtras: []
        }
    })

    const createService = async (data: ServiceInput) => {
        console.log(data);
    }

    return (
        <form onSubmit={handleSubmit(createService)}>
            <Tabs>
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="includedExtras">Included Extras</TabsTrigger>
                    <TabsTrigger value="availableExtras">Extras</TabsTrigger>
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
                        </FieldGroup>
                    </FieldSet>
                </TabsContent>
                <TabsContent value="availableExtras">
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
                <TabsContent value="includedExtras">
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
            </Tabs>
            <FormSubmit 
                className="mt-4"
                isSubmitting={isSubmitting}
                label="Create service"
                submittingLabel="Creating service..."
            />
        </form>
    )
}