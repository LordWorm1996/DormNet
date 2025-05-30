import { NextResponse } from "next/server";
import { connectDB } from "@utils/db";
import { authorizeAdmin } from "@lib/auth";
import Appliance from "@models/Appliance";

export async function POST(req: Request) {
  const authResult = authorizeAdmin(req);
  if (authResult instanceof NextResponse) return authResult;

  await connectDB();

  const { name, status } = await req.json();

  const appliance = new Appliance({
    name,
    status: status || "available",
  });
  await appliance.save();

  return NextResponse.json(
    { message: "Appliance created", appliance },
    { status: 201 },
  );
}
