"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { Button } from "@ui/button";

import { IAppliance } from "@shared/interfaces";
import { reservationFormSchema } from "@schema/reservation-form-schema";
import { cn } from "@lib/utils";

interface MakeReservationModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  date: Date | null;
  preselectedApplianceId?: string | null;
}

export function MakeReservationModal({
  isOpen,
  onCloseAction,
  date,
  preselectedApplianceId,
}: MakeReservationModalProps) {
  const [appliances, setAppliances] = useState<IAppliance[]>([]);
  const [conflictStatus, setConflictStatus] = useState<
    "unknown" | "free" | "conflict"
  >("unknown");

  const now = new Date();

  const form = useForm<z.infer<typeof reservationFormSchema>>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      applianceId: preselectedApplianceId ?? "",
      date: date ? format(date, "yyyy-MM-dd") : format(now, "yyyy-MM-dd"),
      time: date ? format(date, "HH:mm") : format(now, "HH:mm"),
      durationHours: "3",
      durationMinutes: "0",
    },
  });

  useEffect(() => {
    if (isOpen && date) {
      form.reset({
        applianceId: "",
        date: format(date, "yyyy-MM-dd"),
        time: format(date, "HH:mm"),
        durationHours: "3",
        durationMinutes: "0",
      });
    }
  }, [isOpen, date, form]);

  const formValues = form.watch();
  const {
    applianceId,
    date: selectedDate,
    time,
    durationHours,
    durationMinutes,
  } = formValues;

  useEffect(() => {
    if (isOpen) {
      fetch("/api/appliances")
        .then((res) => res.json())
        .then(setAppliances)
        .catch(() => setAppliances([]));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!applianceId || !selectedDate || !time) {
      setConflictStatus("unknown");
      return;
    }

    const checkConflict = async () => {
      const start = new Date(`${selectedDate}T${time}`);
      const durationH = parseInt(durationHours || "0");
      const durationM = parseInt(durationMinutes || "0");

      const end = new Date(
        start.getTime() + (durationH * 60 + durationM) * 60000,
      );

      try {
        const res = await fetch(
          `/api/bookings/conflict?applianceId=${applianceId}&startTime=${start.toISOString()}&endTime=${end.toISOString()}`,
        );
        const data = await res.json();
        setConflictStatus(
          Array.isArray(data) && data.length > 0 ? "conflict" : "free",
        );
      } catch {
        setConflictStatus("unknown");
      }
    };

    checkConflict();
  }, [applianceId, selectedDate, time, durationHours, durationMinutes]);

  const computedEndTime = (() => {
    try {
      const start = new Date(`${selectedDate}T${time}`);
      const durationH = parseInt(durationHours);
      const durationM = parseInt(durationMinutes);
      start.setMinutes(start.getMinutes() + durationH * 60 + durationM);
      return format(start, "HH:mm");
    } catch {
      return "--:--";
    }
  })();

  const onSubmit = async (values: z.infer<typeof reservationFormSchema>) => {
    const startTime = new Date(`${values.date}T${values.time}`);
    const endTime = new Date(
      startTime.getTime() +
        (parseInt(values.durationHours) * 60 +
          parseInt(values.durationMinutes)) *
          60000,
    );

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appliance: values.applianceId,
        startTime,
        endTime,
      }),
    });

    if (response.ok) {
      onCloseAction();
      form.reset();
      setConflictStatus("unknown");
    } else {
      alert("Reservation failed.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onCloseAction();
      }}
    >
      <DialogContent className="sm:max-w-lg bg-white shadow-md">
        <DialogHeader>
          <DialogTitle>Make a Reservation</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Appliance Selection */}
            <FormField
              control={form.control}
              name="applianceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appliance</FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="">Select appliance</option>
                      {appliances.map((appliance) => (
                        <option key={appliance._id} value={appliance._id}>
                          {appliance.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conflict Indicator - Always Visible */}
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Status:</span>
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  conflictStatus === "free" && "bg-green-500",
                  conflictStatus === "conflict" && "bg-red-500",
                  conflictStatus === "unknown" && "bg-gray-400",
                )}
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Duration */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="durationHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="59" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              <strong>Ends at:</strong> {computedEndTime}
            </p>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onCloseAction}>
                Cancel
              </Button>
              <Button type="submit">Reserve</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
