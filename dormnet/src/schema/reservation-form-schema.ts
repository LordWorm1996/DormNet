import { z } from "zod";

export const reservationFormSchema = z.object({
  applianceId: z.string().min(1, "Please select an appliance."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time" }),
  durationHours: z
    .string()
    .regex(/^\d+$/, { message: "Must be a number" })
    .refine((val) => parseInt(val) >= 0 && parseInt(val) <= 6, {
      message: "Max 6 hours allowed",
    }),
  durationMinutes: z
    .string()
    .regex(/^\d+$/, { message: "Must be a number" })
    .refine((val) => parseInt(val) >= 0 && parseInt(val) < 60, {
      message: "Minutes must be between 0–59",
    }),
});
