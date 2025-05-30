import { NextResponse } from "next/server";
import Appliance from "@models/Appliance";
import { connectDB } from "@utils/db";

export async function GET() {
  try {
    await connectDB();
    const appliances = await Appliance.find({});
    return NextResponse.json(appliances);
  } catch (error) {
    console.error("Error fetching appliances:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch appliances",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
