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
import { Control, Controller, FieldValues, Path } from "react-hook-form"

interface DatePickerRangeProps<T extends FieldValues> {
  control: Control<T>
  dateRangeName: Path<T>
  startTimeName: Path<T>
  endTimeName: Path<T>
  label?: string
}

export function DatePickerRange<T extends FieldValues>({
  control,
  dateRangeName,
  startTimeName,
  endTimeName,
  label = "Select Blocking Period",
}: DatePickerRangeProps<T>) {
  const [open, setOpen] = React.useState(false)

  return (
    <FieldGroup className="w-full flex-col gap-4">
      {/* 1. Selector de Rango de Calendario */}
      <Controller
        control={control}
        name={dateRangeName}
        render={({ field }) => {
          const range = field.value as DateRange | undefined;
          
          let displayValue = "Select calendar dates";
          if (range?.from) {
            if (range.to) {
              displayValue = `${format(range.from, "LLL dd, yyyy")} - ${format(range.to, "LLL dd, yyyy")}`;
            } else {
              displayValue = format(range.from, "LLL dd, yyyy");
            }
          }

          return (
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
                    defaultMonth={range?.from}
                    selected={range}
                    onSelect={(selectedRange) => {
                      field.onChange(selectedRange);
                      if (selectedRange?.from && selectedRange?.to) {
                        setOpen(false);
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </Field>
          );
        }}
      />

      <div className="grid grid-cols-2 gap-4 w-full">
        <Controller
          control={control}
          name={startTimeName}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="startTime">Starts at</FieldLabel>
              <Input
                type="time"
                id="startTime"
                className="w-full text-sm"
                value={field.value || ""}
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
              <FieldLabel htmlFor="endTime">Ends at</FieldLabel>
              <Input
                type="time"
                id="endTime"
                className="w-full text-sm"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </Field>
          )}
        />
      </div>
    </FieldGroup>
  )
}