import { NextResponse } from "next/server";
import Reservation from "@/models/Reservation";
import { connectDB } from "@/utils/db";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const reservations = await Reservation.find({
      startTime: { $gte: new Date(startDate!) },
      endTime: { $lte: new Date(endDate!) },
    })
      .populate("user", "name email")
      .populate("machine", "name type");

    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 },
    );
  }
}
