import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FieldSwitch } from "@/shared/components/form/field-switch";

interface ArraySwitchControllerProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    value: string | number;
    label: string;
}

export function ArraySwitchController<T extends FieldValues>({
    control,
    name,
    value,
    label
}: ArraySwitchControllerProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const isChecked = field.value?.includes(value) || false;

                return (
                    <FieldSwitch
                        label={label}
                        checked={isChecked} 
                        onCheckedChange={(checked) => {
                            if (checked) {
                                // Agrega el valor al array
                                field.onChange([...(field.value || []), value]);
                            } else {
                                // Remueve el valor del array
                                field.onChange(
                                    (field.value || []).filter((item: string | number) => item !== value)
                                );
                            }
                        }}
                    />
                );
            }}
        />
    );
}