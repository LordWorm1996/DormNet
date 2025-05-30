import { NextResponse } from "next/server";
import { connectDB } from "@utils/db";
import { authorizeAdmin } from "@lib/auth";
import Machine from "@models/Machine";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await authorizeAdmin();
  if (authError) return authError;
  const { id } = await params;

  await connectDB();
  const { name } = await request.json();

  const machine = await Machine.findByIdAndUpdate(id, { name }, { new: true });

  if (!machine) {
    return NextResponse.json({ message: "Machine not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Machine updated", machine },
    { status: 200 },
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await authorizeAdmin();
  if (authError) return authError;
  const { id } = await params;

  const machine = await Machine.findByIdAndDelete(id);

  if (!machine) {
    return NextResponse.json({ message: "Machine not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Machine deleted" }, { status: 200 });
}
