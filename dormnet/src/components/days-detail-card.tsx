"use client";

import { format } from "date-fns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@lib/utils";

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

interface DayDetailsCardProps {
  date: Date;
  onClose: () => void;
  reservations: Reservation[];
}

export function DayDetailsCard({
  date,
  onClose,
  reservations,
}: DayDetailsCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg max-h-[80vh] overflow-hidden">
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

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {reservations.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No reservations for this day
            </p>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div key={reservation._id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {reservation.machine.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(reservation.startTime), "h:mm a")} -{" "}
                        {format(new Date(reservation.endTime), "h:mm a")}
                      </p>
                      <p className="text-sm mt-1">
                        User: {reservation.user.name}
                      </p>
                      <p className="text-sm">
                        Machine Type: {reservation.machine.type}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs",
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
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
