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
import { MakeReservationModal } from "@/components/modals/make-reservation-modal";
import { IReservation } from "@/shared/interfaces";

interface BookingCalendarProps {
  className?: string;
}

export function BookingCalendar({ className }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayReservations, setDayReservations] = useState<IReservation[]>([]);
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const today = new Date();

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Fetch all reservations in the month
  useEffect(() => {
    const fetchMonthReservations = async () => {
      try {
        const response = await fetch(
          `/api/bookings?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        );
        const data = await response.json();
        setReservations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setReservations([]); // fallback to empty
      }
    };

    fetchMonthReservations();
  }, [currentMonth]);

  // Fetch reservations for the clicked day
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
      setDayReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching day reservations:", error);
    }
  };

  // Handles closing both modal and day view
  const handleCloseAll = () => {
    setShowModal(false);
    setSelectedDate(null);
    setDayReservations([]);
  };

  return (
    <>
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

        {/* Day Names */}
        <div className="flex-1 grid grid-rows-[auto_1fr] border rounded-lg overflow-hidden">
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
              const dayRes = reservations.filter((reservation) =>
                isSameDay(new Date(reservation.startTime), day),
              );

              return (
                <div
                  key={day.toISOString()}
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
                    {dayRes.slice(0, 2).map((reservation) => (
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
                        {reservation.appliance.name}
                      </div>
                    ))}
                    {dayRes.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayRes.length - 2} more
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
            onClose={handleCloseAll}
            reservations={dayReservations}
            onMakeReservation={() => setShowModal(true)}
          />
        )}
      </div>

      {/* Reservation Modal */}
      <MakeReservationModal
        isOpen={showModal}
        onCloseAction={handleCloseAll}
        date={selectedDate}
      />
    </>
  );
}
