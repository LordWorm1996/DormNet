// e.g. src/app/api/admin/stats/route.ts
import { NextResponse }   from "next/server";
import { connectDB }      from "@/utils/db";
import { authorizeAdmin } from "@/lib/auth";
import User               from "@/models/User";
import Machine            from "@/models/Machine";
import Reservation        from "@/models/Reservation";

export async function GET() {
  const authError = await authorizeAdmin();
  if (authError) return authError;

  await connectDB();
  const userCount        = await User.countDocuments();
  const machineCount     = await Machine.countDocuments();
  const reservationCount = await Reservation.countDocuments({ status: "active" });

  return NextResponse.json({ userCount, machineCount, reservationCount });
}
