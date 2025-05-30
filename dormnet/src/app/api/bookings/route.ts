import { NextResponse } from "next/server";
import Reservation from "@/models/Reservation";
import "@/models/User";
import "@/models/Appliance";

import { connectDB } from "@/utils/db";
import mongoose from "mongoose";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return new Response("Missing startDate or endDate", { status: 400 });
  }

  try {
    await connectDB(); // ✅ Must connect to MongoDB first

    const reservations = await Reservation.find({
      $or: [
        {
          startTime: { $lte: new Date(endDate) },
          endTime: { $gte: new Date(startDate) },
        },
      ],
    })
      .populate("appliance") // ensure .populate() works with schema
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
    const body = await request.json();
    const { appliance, startTime, endTime } = body;

    const newReservation = new Reservation({
      appliance,
      startTime,
      endTime,
      user: new mongoose.Types.ObjectId("67d555d59b27b8b1141b654a"), // Replace later with real session
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
