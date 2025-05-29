// src/models/reservation.ts

import mongoose, { Document, Schema } from "mongoose";

const ReservationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // ✅ this must match your User model name
      required: true,
    },
    appliance: {
      type: Schema.Types.ObjectId,
      ref: "Appliance", // ✅ this must match your Appliance model name
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true },
);

// Export model
const Reservation =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);

export default Reservation;
