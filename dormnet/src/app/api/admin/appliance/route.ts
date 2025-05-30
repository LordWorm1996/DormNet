import { NextResponse } from "next/server";
import { connectDB } from "@utils/db";
import { authorizeAdmin } from "@lib/auth";
import Appliance from "@models/Appliance";

export async function GET() {
  const authError = await authorizeAdmin();
  if (authError) return authError;

  await connectDB();
  const appliances = await Appliance.find();
  return NextResponse.json(appliances);
}

export async function POST(req: Request) {
  const authError = await authorizeAdmin();
  if (authError) return authError;

  await connectDB();

  try {
    const { name, status = "available", type } = await req.json();

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 },
      );
    }

    const appliance = new Appliance({ name, status, type });
    await appliance.save();

    return NextResponse.json(
      { message: "Appliance created", appliance },
      { status: 201 },
    );
  } catch (err) {
    console.error("Appliance creation error:", err);
    return NextResponse.json(
      { error: "Failed to create appliance" },
      { status: 500 },
    );
  }
}
