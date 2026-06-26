// date-picker.tsx
"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"

// Importamos lo necesario de react-hook-form
import { Control, Path, UseFormSetValue, useWatch, FieldValues } from "react-hook-form"

interface DatePickerTimeProps<T extends FieldValues> {
  control: Control<T>
  setValue: UseFormSetValue<T>
  startTimeName: Path<T>
  endTimeName: Path<T>
}

export function DatePickerTime<T extends FieldValues>({
  control,
  setValue,
  startTimeName,
  endTimeName,
}: DatePickerTimeProps<T>) {
  const [open, setOpen] = React.useState(false)

  const startTime = useWatch({ control, name: startTimeName }) as Date | undefined;
  const endTime = useWatch({ control, name: endTimeName }) as Date | undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const newStart = startTime ? new Date(startTime) : new Date();
    newStart.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    setValue(startTimeName, newStart as any, { shouldValidate: true, shouldDirty: true });

    const newEnd = endTime ? new Date(endTime) : new Date();
    newEnd.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    setValue(endTimeName, newEnd as any, { shouldValidate: true, shouldDirty: true });

    setOpen(false);
  }

  const handleTimeChange = (name: Path<T>, currentVal: Date | undefined, timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const newDate = currentVal ? new Date(currentVal) : new Date();
    newDate.setHours(Number(hours), Number(minutes), 0, 0);
    setValue(name, newDate as any, { shouldValidate: true, shouldDirty: true });
  }

  return (
    <FieldGroup className="mx-auto flex-col">
      <Field>
        <FieldLabel htmlFor="appointmentDate">Date</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-32 justify-between font-normal">
              {startTime ? format(startTime, "PPP") : "Select date"}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={startTime}
              defaultMonth={startTime}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <div className="flex items-center gap-4">
        <Field>
          <FieldLabel htmlFor="startTime">Start time</FieldLabel>
          <Input
            type="time"
            step="60"
            className="text-sm md:text-md"
            value={startTime ? format(startTime, "HH:mm") : ""}
            onChange={(e) => handleTimeChange(startTimeName, startTime, e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="endTime">End time</FieldLabel>
          <Input
            type="time"
            step="60"
            className="text-sm md:text-md"
            value={endTime ? format(endTime, "HH:mm") : ""}
            onChange={(e) => handleTimeChange(endTimeName, endTime, e.target.value)}
          />
        </Field>
      </div>
    </FieldGroup>
  )
}