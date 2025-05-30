import { NextResponse } from "next/server";
import Reservation from "@models/Reservation";
import "@models/User";
import "@models/Appliance";

import { connectDB } from "@utils/db";
import mongoose from "mongoose";
import { getSession } from "@lib/session";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return new Response("Missing startDate or endDate", { status: 400 });
  }

  try {
    await connectDB();

    const reservations = await Reservation.find({
      $or: [
        {
          startTime: { $lte: new Date(endDate) },
          endTime: { $gte: new Date(startDate) },
        },
      ],
    })
      .populate("appliance")
      .populate("user");

    return Response.json(reservations);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const session = await getSession();

    if (!session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { appliance, startTime, endTime } = body;

    const newReservation = new Reservation({
      appliance,
      startTime,
      endTime,
      user: new mongoose.Types.ObjectId(session.user.id),
    });

    await newReservation.save();

    return NextResponse.json(
      { message: "Reservation created" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 },
    );
  }
}
