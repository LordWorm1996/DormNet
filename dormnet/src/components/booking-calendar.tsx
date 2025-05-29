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
import { useState, useEffect } from "react";
import { DayDetailsCard } from "@/components/days-detail-card";

interface BookingCalendarProps {
  className?: string;
}

interface Reservation {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  machine: {
    name: string;
    type: string;
  };
  startTime: string;
  endTime: string;
  status: "active" | "completed" | "cancelled";
}

export function BookingCalendar({ className }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const today = new Date();

  // Navigation functions
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Get days for current month view with Monday start
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Monday-first day names
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Fetch reservations for the visible month
  useEffect(() => {
    const fetchMonthReservations = async () => {
      try {
        const response = await fetch(
          `/api/bookings?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        );
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchMonthReservations();
  }, [currentMonth]);

  const handleDayClick = async (day: Date) => {
    try {
      const startOfDay = new Date(day);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(day);
      endOfDay.setHours(23, 59, 59, 999);

      const response = await fetch(
        `/api/bookings?startDate=${startOfDay.toISOString()}&endDate=${endOfDay.toISOString()}`,
      );
      const data = await response.json();
      setSelectedDate(day);
    } catch (error) {
      console.error("Error fetching day reservations:", error);
    }
  };

  const closeCard = () => {
    setSelectedDate(null);
  };

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
        {/* Day Names */}
        <div className="grid grid-cols-7 bg-muted/50 border-b">
          {dayNames.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, today);
            const dayReservations = reservations.filter((reservation) =>
              isSameDay(new Date(reservation.startTime), day),
            );

            return (
              <div
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "relative hover:bg-accent/50 transition-colors cursor-pointer",
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

                <div className="flex-1 overflow-hidden space-y-1 mt-1">
                  {dayReservations.slice(0, 2).map((reservation) => (
                    <div
                      key={reservation._id}
                      className={cn(
                        "text-xs p-1 rounded truncate",
                        reservation.status === "active" &&
                          "bg-green-100 text-green-800",
                        reservation.status === "completed" &&
                          "bg-blue-100 text-blue-800",
                        reservation.status === "cancelled" &&
                          "bg-red-100 text-red-800",
                      )}
                    >
                      {format(new Date(reservation.startTime), "HH:mm")}{" "}
                      {reservation.machine.name}
                    </div>
                  ))}
                  {dayReservations.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayReservations.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Details Card */}
      {selectedDate && (
        <DayDetailsCard
          date={selectedDate}
          onClose={closeCard}
          reservations={reservations.filter((reservation) =>
            isSameDay(new Date(reservation.startTime), selectedDate),
          )}
        />
      )}
    </div>
  );
}
