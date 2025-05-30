import { NextResponse } from "next/server";
import { connectDB } from "@utils/db";
import { authorizeAdmin } from "@lib/auth";
import Machine from "@models/Machine";

export async function GET() {
  const authError = await authorizeAdmin();
  if (authError) return authError;

  await connectDB();
  const machines = await Machine.find();
  return NextResponse.json(machines);
}

export async function POST(req: Request) {
  const authError = await authorizeAdmin();
  if (authError) return authError;

  await connectDB();
  const { name, status } = await req.json();
  const machine = new Machine({ name, status: status || "available" });
  await machine.save();
  return NextResponse.json(
    { message: "Machine created", machine },
    { status: 201 },
  );
}
