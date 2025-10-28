import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
  disabledDates?: Date[];
  minDate?: Date;
}

export const DatePicker = ({ 
  selectedDate, 
  onDateChange, 
  disabledDates = [],
  minDate = new Date()
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          disabled={(date) => {
            // Disable past dates
            if (date < minDate) return true;
            // Disable specific dates
            return disabledDates.some(disabledDate => 
              date.toDateString() === disabledDate.toDateString()
            );
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

