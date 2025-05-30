// src/app/api/bookings/conflict/route.ts
import { connectDB } from "@/utils/db";
import Reservation from "@/models/Reservation";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const applianceId = searchParams.get("applianceId");
  const startTime = new Date(searchParams.get("startTime") || "");
  const endTime = new Date(searchParams.get("endTime") || "");

  if (!applianceId || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return new Response("Missing or invalid params", { status: 400 });
  }

  const conflicts = await Reservation.find({
    appliance: applianceId,
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  });

  return Response.json(conflicts);
}
