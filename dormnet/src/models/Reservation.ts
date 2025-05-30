import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    endTime: {
      type: Date,
      required: true,
    },
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
