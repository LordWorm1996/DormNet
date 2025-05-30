import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Reservation from "@/models/Reservation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const applianceId = searchParams.get("applianceId");
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");

  if (!applianceId || !startTime || !endTime) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  await connectDB();

  const start = new Date(startTime);
  const end = new Date(endTime);

  const conflict = await Reservation.findOne({
    appliance: applianceId,
    $or: [
      {
        startTime: { $lt: end },
        endTime: { $gt: start },
      },
    ],
  });

  return NextResponse.json({ available: !conflict });
}
