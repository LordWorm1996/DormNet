// src/app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@utils/db";
import { authorizeAdmin } from "@lib/auth";
import User from "@models/User";
import Machine from "@models/Machine";
import Reservation from "@models/Reservation";

export async function GET(req: Request) {
  const authResult = authorizeAdmin(req);
  if (authResult instanceof NextResponse) return authResult;

  await connectDB();

  const userCount = await User.countDocuments();
  const machineCount = await Machine.countDocuments();
  const activeReservations = await Reservation.countDocuments({
    status: "active",
  });

  return NextResponse.json({ userCount, machineCount, activeReservations });
}
