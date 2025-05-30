import { NextResponse } from "next/server";
import { connectDB } from "@utils/db";
import { authorizeAdmin } from "@lib/auth";
import Appliance from "@models/Appliance";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await authorizeAdmin();
  if (authError) return authError;
  const { id } = await params;

  await connectDB();
  const { name } = await request.json();

  const appliance = await Appliance.findByIdAndUpdate(
    id,
    { name },
    { new: true },
  );

  if (!appliance) {
    return NextResponse.json(
      { message: "Appliance not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { message: "Appliance updated", appliance },
    { status: 200 },
  );
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const authError = await authorizeAdmin();
  if (authError) return authError;

  const { id } = params;

  await connectDB();
  const { name } = await request.json();

  const appliance = await Appliance.findByIdAndUpdate(
    id,
    { name },
    { new: true },
  );

  if (!appliance) {
    return NextResponse.json(
      { message: "Appliance not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { message: "Appliance updated", appliance },
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

  const appliance = await Appliance.findByIdAndDelete(id);

  if (!appliance) {
    return NextResponse.json(
      { message: "Appliance not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ message: "Appliance deleted" }, { status: 200 });
}
