// src/app/api/admin/machine/route.ts
import { NextResponse }   from "next/server";
import { connectDB }      from "@/utils/db";
import { authorizeAdmin } from "@/lib/auth";
import Appliance from "@models/Appliance";

export async function GET() {
  const authError = await authorizeAdmin();
  if (authError) return authError;

  await connectDB();
  const machines = await Appliance.find();
  return NextResponse.json(machines);
}
export async function POST(req: Request) {
  const authError = await authorizeAdmin();
  if (authError) return authError;

  await connectDB();
  const { name, status } = await req.json();
  const appliance = new Appliance({ name, status: status || "available" });
  await appliance.save();
  return NextResponse.json({ message: "Appliance created", appliance }, { status: 201 });
}