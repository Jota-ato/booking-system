import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Switch } from "@/shared/components/ui/switch";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/shared/components/ui/field";

interface FieldSwitchProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    name: FieldPath<TFieldValues>;
    label: string;
    description?: string;
}

export function FieldSwitch<TFieldValues extends FieldValues>({
    control,
    name,
    label,
    description
}: FieldSwitchProps<TFieldValues>) {
    return (
        <Field orientation="horizontal">
            <FieldContent>
                <FieldLabel>{label}</FieldLabel>
                {description && <FieldDescription>{description}</FieldDescription>}
            </FieldContent>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                )}
            />
        </Field>
    );
}