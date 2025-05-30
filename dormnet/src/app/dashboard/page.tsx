"use client";

import { useEffect, useState } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  isAfter,
  isBefore,
  isSameDay,
  addDays,
  startOfDay,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IReservation, IAppliance } from "@/shared/interfaces";
import { cn } from "@/lib/utils";
import { MakeReservationModal } from "@/components/modals/make-reservation-modal";

export default function DashboardReservationsCard() {
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userReservations, setUserReservations] = useState<IReservation[]>([]);
  const [appliances, setAppliances] = useState<IAppliance[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplianceId, setSelectedApplianceId] = useState<string | null>(
    null,
  );
  const [reservationDate, setReservationDate] = useState<Date | null>(null);

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const days = Array.from(
    { length: 7 },
    (_, i) => new Date(weekStart.getTime() + i * 86400000),
  );

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        `/api/bookings?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}`,
      );
      const data = await response.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    }
  };

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      if (data?.user?.id) setUserId(data.user.id);
    } catch (err) {
      console.error("Failed to fetch session", err);
    }
  };

  const fetchUserReservations = () => {
    const today = startOfDay(new Date());
    const filtered = reservations.filter(
      (res) =>
        res.user?._id === userId &&
        (isSameDay(new Date(res.startTime), today) ||
          (isAfter(new Date(res.startTime), today) &&
            isBefore(new Date(res.startTime), addDays(today, 4)))),
    );
    setUserReservations(filtered);
  };

  const deleteReservation = async (id: string) => {
    try {
      await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      setUserReservations((prev) => prev.filter((r) => r._id !== id));
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete reservation", err);
    }
  };

  const fetchAppliances = async () => {
    try {
      const res = await fetch("/api/appliances");
      const data = await res.json();
      setAppliances(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch appliances", err);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchSession();
    fetchAppliances();
  }, [weekStart]);

  useEffect(() => {
    if (userId) fetchUserReservations();
  }, [reservations, userId]);

  return (
    <>
      {/* Weekly Reservations Card */}
      <Card className="w-full shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Weekly Reservations</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setWeekStart(subWeeks(weekStart, 1))}
            >
              Prev Week
            </Button>
            <Button
              variant="outline"
              onClick={() => setWeekStart(addWeeks(weekStart, 1))}
            >
              Next Week
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 text-center text-sm font-medium border-b pb-2">
            {days.map((day) => (
              <div key={day.toISOString()}>{format(day, "EEE d")}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 mt-2">
            {days.map((day) => {
              const dayReservations = reservations.filter((r) => {
                const start = new Date(r.startTime);
                return (
                  start >= new Date(day.setHours(0, 0, 0, 0)) &&
                  start <= new Date(day.setHours(23, 59, 59, 999))
                );
              });
              return (
                <div
                  key={day.toISOString()}
                  className="flex flex-col gap-1 p-1 border rounded"
                >
                  {dayReservations.length === 0 ? (
                    <span className="text-xs text-gray-400">
                      No reservations
                    </span>
                  ) : (
                    dayReservations.map((res) => (
                      <div
                        key={res._id}
                        className={cn(
                          "text-xs p-1 rounded bg-blue-100 text-blue-800 truncate",
                          res.user?._id === userId &&
                            "border-2 border-blue-600 bg-blue-200 font-semibold",
                        )}
                        title={`${res.appliance.name} | ${format(new Date(res.startTime), "HH:mm")} - ${format(new Date(res.endTime), "HH:mm")}`}
                      >
                        {format(new Date(res.startTime), "HH:mm")} -{" "}
                        {res.appliance.name}
                        <div className="text-[10px] text-gray-600">
                          {res.user?.name || "Unknown"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* User's Upcoming Reservations */}
      <Card className="w-full mt-6 shadow-md">
        <CardHeader>
          <CardTitle>Your Upcoming Reservations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {userReservations.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming reservations.</p>
          ) : (
            userReservations.map((res) => (
              <div
                key={res._id}
                className="flex justify-between items-center border p-2 rounded bg-white shadow-sm"
              >
                <div>
                  <div className="font-medium text-sm">
                    {res.appliance.name} —{" "}
                    {format(new Date(res.startTime), "HH:mm")}–
                    {format(new Date(res.endTime), "HH:mm")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(res.startTime), "EEEE, MMM d")}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteReservation(res._id)}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Appliances List */}
      <Card className="w-full mt-6 shadow-md">
        <CardHeader>
          <CardTitle>All Appliances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {appliances.length === 0 ? (
            <p className="text-sm text-gray-500">No appliances available.</p>
          ) : (
            appliances.map((appliance) => (
              <div
                key={appliance._id}
                className="flex justify-between items-center border p-2 rounded bg-white shadow-sm"
              >
                <div className="font-medium text-sm">{appliance.name}</div>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedApplianceId(appliance._id);
                    setReservationDate(new Date());
                    setModalOpen(true);
                  }}
                >
                  Make Reservation
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <MakeReservationModal
        isOpen={modalOpen}
        onCloseAction={() => setModalOpen(false)}
        date={reservationDate}
        preselectedApplianceId={selectedApplianceId}
      />
    </>
  );
}
