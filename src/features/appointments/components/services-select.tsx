import { Service } from "@/db/schema"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { formatMXN } from "@/shared/lib/currency"
import { Control, Controller, FieldValues, Path } from "react-hook-form"
interface SelectOption {
  value: string
  label: string
}

interface GenericSelectProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  options: SelectOption[]
  placeholder?: string
  groupLabel?: string
}

export function CustomSelect<T extends FieldValues>({
  control,
  name,
  options,
  placeholder = "Select an option",
  groupLabel,
}: GenericSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  )
}