// components/calendar/FullSpaceCalendar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface BookingCalendarProps {
  onDayClick?: (date: Date) => void;
  className?: string;
}

export function BookingCalendar({
  onDayClick,
  className,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  // Navigation functions
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Get days for current month view with Monday start
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Calculate days to show (Monday as first day of week)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Monday-first day names
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-lg font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-rows-[auto_1fr] border rounded-lg overflow-hidden">
        {/* Day Names - Monday first */}
        <div className="grid grid-cols-7 bg-muted/50 border-b border-gray-300">
          {" "}
          {/* Added border-bottom */}
          {dayNames.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-muted-foreground border-r border-gray-300 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y bg-border">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, today);

            return (
              <div
                key={day.toString()}
                onClick={() => onDayClick?.(day)}
                className={cn(
                  "relative hover:bg-accent/50 transition-colors",
                  !isCurrentMonth && "text-muted-foreground/50 bg-muted/20",
                  "flex flex-col p-1",
                )}
              >
                <div
                  className={cn(
                    "ml-auto h-6 w-6 flex items-center justify-center rounded-full text-xs",
                    isToday && "bg-primary text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </div>

                <div className="flex-1 overflow-hidden">
                  {/* Booking indicators would go here */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
