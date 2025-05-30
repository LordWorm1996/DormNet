"use client";

import { format } from "date-fns";
import { X } from "lucide-react";
import { Button } from "@ui/button";
import { cn } from "@lib/utils";
import { IReservation } from "@shared/interfaces";

interface DayDetailsCardProps {
  date: Date;
  onClose: () => void;
  reservations: IReservation[];
  onMakeReservation: () => void;
}

export function DayDetailsCard({
  date,
  onClose,
  reservations,
  onMakeReservation,
}: DayDetailsCardProps) {
  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold">
            {format(date, "EEEE, MMMM d, yyyy")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
          {sortedReservations.length === 0 ? (
            <p className="text-center text-gray-500">
              No reservations for this day
            </p>
          ) : (
            sortedReservations.map((reservation) => (
              <div
                key={reservation._id}
                className="border rounded-md p-3 bg-gray-50"
              >
                <div className="flex justify-between">
                  <span className="font-medium">
                    {reservation.appliance.name}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      reservation.status === "active" &&
                        "bg-green-100 text-green-800",
                      reservation.status === "completed" &&
                        "bg-blue-100 text-blue-800",
                      reservation.status === "cancelled" &&
                        "bg-red-100 text-red-800",
                    )}
                  >
                    {reservation.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {format(new Date(reservation.startTime), "HH:mm")} -{" "}
                  {format(new Date(reservation.endTime), "HH:mm")}
                </p>
                <p className="text-xs text-gray-500">
                  User: {reservation.user?.name || "Unknown"}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-between">
          <Button onClick={onMakeReservation}>Make Reservation</Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
