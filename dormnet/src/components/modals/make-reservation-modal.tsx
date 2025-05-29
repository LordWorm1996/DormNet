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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { IAppliance } from "@/shared/interfaces";
import { reservationFormSchema } from "@/schema/reservation-form-schema";

interface MakeReservationModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  date: Date | null;
}

export function MakeReservationModal({
  isOpen,
  onCloseAction,
  date,
}: MakeReservationModalProps) {
  const [appliances, setAppliances] = useState<IAppliance[]>([]);
  const now = new Date();

  const form = useForm<z.infer<typeof reservationFormSchema>>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      applianceId: "",
      date: date ? format(date, "yyyy-MM-dd") : format(now, "yyyy-MM-dd"),
      time: format(now, "HH:mm"),
      durationHours: "3",
      durationMinutes: "0",
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetch("/api/appliances")
        .then((res) => res.json())
        .then(setAppliances);
    }
  }, [isOpen]);

  const formValues = form.watch();
  const {
    date: selectedDate,
    time,
    durationHours,
    durationMinutes,
  } = formValues;

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
        appliance: values.applianceId, // note: your backend expects "Appliance"
        startTime,
        endTime,
      }),
    });

    if (response.ok) {
      onCloseAction();
      form.reset();
    } else {
      alert("Reservation failed.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCloseAction()}>
      <DialogContent
        className="sm:max-w-lg bg-white shadow-md"
        style={{
          backgroundColor: "white", // ensure background isn't dark
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // subtle shadow
        }}
      >
        <DialogHeader>
          <DialogTitle>Make a Reservation</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Appliance */}
            <FormField
              control={form.control}
              name="applianceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appliance</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appliance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appliances.map((appliance) => (
                        <SelectItem key={appliance._id} value={appliance._id}>
                          <div className="flex justify-between items-center">
                            <span>{appliance.name}</span>
                            <span
                              className={`ml-2 w-2 h-2 rounded-full ${
                                appliance.status === "in-use"
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                            />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
