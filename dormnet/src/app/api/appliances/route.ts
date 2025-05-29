import { NextResponse } from "next/server";
import Appliance from "@/models/Appliance";
import { connectDB } from "@/utils/db";

export async function GET() {
  try {
    await connectDB();
    const appliances = await Appliance.find({});
    return NextResponse.json(appliances);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch appliances" },
      { status: 500 },
    );
  }
}
