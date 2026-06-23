import { Control, Controller } from "react-hook-form";
import { ServiceInput } from "../schemas/service-schema";
import { Extra } from "@/db/schema";
import { FieldSwitch } from "@/shared/components/form/field-switch";

export function ExtraSwitchController({
    control,
    name,
    extra
}: {
    control: Control<ServiceInput>;
    name: "includedExtras" | "availableExtras";
    extra: Extra;
}) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const isChecked = field.value?.includes(extra.id) || false;

                return (
                    <FieldSwitch
                        label={extra.name}
                        checked={isChecked} 
                        onCheckedChange={(checked) => {
                            if (checked) {
                                field.onChange([...(field.value || []), extra.id]);
                            } else {
                                field.onChange((field.value || []).filter((id) => id !== extra.id));
                            }
                        }}
                    />
                );
            }}
        />
    );
}