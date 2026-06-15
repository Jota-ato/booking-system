"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { formatTime } from "@/shared/lib/date"

interface DatePickerTimeProps<T extends FieldValues> {
  control: Control<T>
  appointmentDateName: Path<T>
  startTimeName: Path<T>
  endTimeName: Path<T>
}

export function DatePickerTime<T extends FieldValues>({
  control,
  appointmentDateName,
  startTimeName,
  endTimeName,
}: DatePickerTimeProps<T>) {
  const [open, setOpen] = React.useState(false)

  return (
    <FieldGroup className="mx-auto flex-col">
      <Controller
        control={control}
        name={appointmentDateName}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="appointmentDate">Date</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="appointmentDate"
                  className="w-32 justify-between font-normal"
                >
                  {field.value ? format(field.value, "PPP") : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  captionLayout="dropdown"
                  defaultMonth={field.value}
                  onSelect={(date) => {
                    field.onChange(date)
                    setOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>
        )}
      />

      <div className="flex items-center gap-4">
        <Controller
          control={control}
          name={startTimeName}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="startTime">Start time</FieldLabel>
              <Input
                type="time"
                id="startTime"
                step="1"
                className="text-sm md:text-md"
                value={field.value }
                onChange={(e) => field.onChange(e.target.value)}
              />
            </Field>
          )}
        />

        <Controller
          control={control}
          name={endTimeName}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="endTime">End time</FieldLabel>
              <Input
                type="time"
                id="endTime"
                step="1"
                className="text-sm md:text-md"
                value={field.value }
                onChange={(e) => field.onChange(e.target.value)}
              />
            </Field>
          )}
        />
      </div>
    </FieldGroup>
  )
}