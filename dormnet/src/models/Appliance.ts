import mongoose, { Schema } from "mongoose";

const ApplianceSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "in-use"],
      default: "available",
    },
    defaultUseTime: { type: Number }, // optional in minutes
  },
  { timestamps: true },
);

const Appliance =
  mongoose.models.Appliance || mongoose.model("Appliance", ApplianceSchema);

export default Appliance;
