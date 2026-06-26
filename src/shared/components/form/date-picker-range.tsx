"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Control, Path, UseFormSetValue, useWatch, FieldValues } from "react-hook-form"

interface DatePickerRangeProps<T extends FieldValues> {
  control: Control<T>
  setValue: UseFormSetValue<T>
  startTimeName: Path<T>
  endTimeName: Path<T>
  label?: string
}

export function DatePickerRange<T extends FieldValues>({
  control,
  setValue,
  startTimeName,
  endTimeName,
  label = "Select Blocking Period",
}: DatePickerRangeProps<T>) {
  const [open, setOpen] = React.useState(false)

  const startTime = useWatch({ control, name: startTimeName }) as Date | undefined;
  const endTime = useWatch({ control, name: endTimeName }) as Date | undefined;

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      setValue(startTimeName, undefined as any, { shouldValidate: true, shouldDirty: true });
      setValue(endTimeName, undefined as any, { shouldValidate: true, shouldDirty: true });
      return;
    }

    if (range.from) {
      const newStart = startTime ? new Date(startTime) : new Date();
      newStart.setFullYear(range.from.getFullYear(), range.from.getMonth(), range.from.getDate());
      setValue(startTimeName, newStart as any, { shouldValidate: true, shouldDirty: true });
    }

    if (range.to) {
      const newEnd = endTime ? new Date(endTime) : new Date();
      newEnd.setFullYear(range.to.getFullYear(), range.to.getMonth(), range.to.getDate());
      setValue(endTimeName, newEnd as any, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue(endTimeName, undefined as any, { shouldValidate: true, shouldDirty: true });
    }
  }

  const handleTimeChange = (name: Path<T>, currentVal: Date | undefined, timeString: string) => {
    if (!timeString) return;
    const [hours, minutes] = timeString.split(":");
    const newDate = currentVal ? new Date(currentVal) : new Date();
    newDate.setHours(Number(hours), Number(minutes), 0, 0);
    setValue(name, newDate as any, { shouldValidate: true, shouldDirty: true });
  }

  let displayValue = "Select calendar dates";
  if (startTime) {
    const isSameDay = endTime && startTime.toDateString() === endTime.toDateString();

    if (endTime && !isSameDay) {
      displayValue = `${format(startTime, "LLL dd, yyyy")} - ${format(endTime, "LLL dd, yyyy")}`;
    } else {
      displayValue = format(startTime, "LLL dd, yyyy");
    }
  }

  return (
    <FieldGroup className="w-full flex-col gap-4">
      <Field className="w-full">
        <FieldLabel htmlFor="dateRange">{label}</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="dateRange"
              className="w-full justify-between font-normal text-left"
            >
              <span>{displayValue}</span>
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={startTime}
              selected={{ from: startTime, to: endTime }}
              onSelect={handleRangeSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <div className="grid grid-cols-2 gap-4 w-full">
        <Field>
          <FieldLabel htmlFor="startTime">Starts at</FieldLabel>
          <Input
            type="time"
            id="startTime"
            step="60"
            className="w-full text-sm"
            value={startTime ? format(startTime, "HH:mm") : ""}
            onChange={(e) => handleTimeChange(startTimeName, startTime, e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="endTime">Ends at</FieldLabel>
          <Input
            type="time"
            id="endTime"
            step="60"
            className="w-full text-sm"
            value={endTime ? format(endTime, "HH:mm") : ""}
            onChange={(e) => handleTimeChange(endTimeName, endTime, e.target.value)}
          />
        </Field>
      </div>
    </FieldGroup>
  )
}