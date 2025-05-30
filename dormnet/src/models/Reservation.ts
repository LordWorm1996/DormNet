import mongoose, { Schema } from "mongoose";

const ReservationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appliance: {
      type: Schema.Types.ObjectId,
      ref: "Appliance",
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

const Reservation =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);

export default Reservation;
