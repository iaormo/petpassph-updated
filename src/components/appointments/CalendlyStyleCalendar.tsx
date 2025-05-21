
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameDay, isSameMonth, addDays, addMonths, isAfter, startOfToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface CalendlyStyleCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  availableDates: Date[];
  timeSlots: TimeSlot[];
  onTimeSlotSelect: (time: string) => void;
  selectedTime: string | null;
  hideTimeSlots?: boolean;
}

const CalendlyStyleCalendar: React.FC<CalendlyStyleCalendarProps> = ({
  selectedDate,
  onDateChange,
  availableDates,
  timeSlots,
  onTimeSlotSelect,
  selectedTime,
  hideTimeSlots = false
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const handleMonthChange = (increment: boolean) => {
    setCurrentMonth(prev => increment ? addMonths(prev, 1) : addMonths(prev, -1));
  };

  const today = startOfToday();
  
  // Check if a day is disabled
  const isDayDisabled = (day: Date) => {
    // Past dates are disabled
    if (!isAfter(day, today)) return true;
    
    // Only enable days that have available slots (if availableDates is provided)
    if (availableDates.length > 0) {
      return !availableDates.some(availableDate => isSameDay(availableDate, day));
    }
    
    return false;
  };

  // Format the day for display
  const dayClassName = (date: Date) => {
    const isAvailable = availableDates.some(d => isSameDay(d, date));
    const isSelected = isSameDay(date, selectedDate);
    
    return cn(
      "relative flex h-10 w-10 items-center justify-center rounded-full p-0",
      isSelected && "bg-primary text-primary-foreground",
      !isSelected && isAvailable && "hover:bg-primary/10",
      !isSelected && !isAvailable && "text-muted-foreground opacity-50"
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="md:w-96 flex-shrink-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMonthChange(false)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMonthChange(true)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className={cn("p-3 pointer-events-auto")}
            disabled={isDayDisabled}
            modifiers={{
              available: availableDates
            }}
            modifiersStyles={{
              available: { fontWeight: 'bold' }
            }}
          />
        </CardContent>
      </Card>

      {!hideTimeSlots && (
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            {timeSlots.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No available time slots for this day.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {timeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    className={cn(
                      "flex items-center justify-center",
                      !slot.available && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={!slot.available}
                    onClick={() => slot.available && onTimeSlotSelect(slot.time)}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {slot.time}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendlyStyleCalendar;
