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
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { FieldSwitch } from "@/shared/components/form/field-switch";

export function ServiceForm({
    service,
    extras
}: {
    service?: Service
    extras: Extra[]
}) {

    const {
        control,
        handleSubmit
    } = useForm()

    return (
        <form>
            <Tabs>
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="includedExtras">Included Extras</TabsTrigger>
                    <TabsTrigger value="extras">Extras</TabsTrigger>
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
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="description">
                                    Service description
                                </FieldLabel>
                                <Textarea
                                    id="description"
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="price">
                                    Service price
                                </FieldLabel>
                                <Input
                                    type="number"
                                    id="price"
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </TabsContent>
                <TabsContent value="extras">
                    <FieldSet>
                        {extras.map(extra => (
                            <FieldSwitch 
                                key={extra.id}
                                control={control}
                                name={extra.name}
                                label={extra.name}
                            />
                        ))}
                    </FieldSet>
                </TabsContent>
                <TabsContent value="includedExtras">
                    <FieldSet>
                        {extras.map(extra => (
                            <FieldSwitch 
                                key={extra.id}
                                control={control}
                                name={extra.name}
                                label={extra.name}
                            />
                        ))}
                    </FieldSet>
                </TabsContent>
            </Tabs>
            <Button
                type="submit"
                className="mt-4"
            >
                Save
            </Button>
        </form>
    )
}