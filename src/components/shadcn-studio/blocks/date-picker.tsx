"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for tailwind classes

import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerInputProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  className?: string;
}

function formatDate(date: Date | undefined) {
  if (!date || isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function DatePickerInput({
  value,
  onChange,
  label,
  placeholder = "Select date...",
  id = "date-picker",
  className,
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);

  // Internal state for the text input and the calendar's visible month
  const [inputValue, setInputValue] = React.useState(formatDate(value));
  const [month, setMonth] = React.useState<Date | undefined>(
    value ?? new Date(),
  );

  // Sync internal text when the external value changes (e.g., form resets)
  React.useEffect(() => {
    setInputValue(formatDate(value));
    if (value) setMonth(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const textValue = e.target.value;
    setInputValue(textValue);

    const parsedDate = new Date(textValue);
    if (!isNaN(parsedDate.getTime())) {
      onChange?.(parsedDate);
      setMonth(parsedDate);
    } else if (textValue === "") {
      onChange?.(undefined);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onChange?.(selectedDate);
    setInputValue(formatDate(selectedDate));
    setOpen(false);
  };

  return (
    <Field className={cn("w-full", className)}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <InputGroup>
        <InputGroupInput
          id={id}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                aria-label="Open calendar"
              >
                <CalendarIcon className="h-4 w-4" />
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end" sideOffset={10}>
              <Calendar
                mode="single"
                selected={value}
                month={month}
                onMonthChange={setMonth}
                onSelect={handleDateSelect}
                className="w-60"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
