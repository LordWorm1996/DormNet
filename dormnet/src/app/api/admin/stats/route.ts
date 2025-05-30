import { NextResponse } from "next/server";
import { connectDB } from "@utils/db";
import { authorizeAdmin } from "@lib/auth";
import User from "@models/User";
import Appliance from "@models/Appliance";
import Reservation from "@models/Reservation";

export async function GET() {
  const authError = await authorizeAdmin();
  if (authError) return authError;

  await connectDB();
  const userCount = await User.countDocuments();
  const applianceCount = await Appliance.countDocuments();
  const reservationCount = await Reservation.countDocuments({
    status: "active",
  });

  return NextResponse.json({ userCount, applianceCount, reservationCount });
}
