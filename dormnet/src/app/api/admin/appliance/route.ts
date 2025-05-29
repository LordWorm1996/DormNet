// src/app/api/admin/appliance/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import { authorizeAdmin } from "@/lib/auth";
import Appliance from "@models/Appliance";

export async function POST(req: Request) {
  const authResult = authorizeAdmin(req);
  if (authResult instanceof NextResponse) return authResult;

  await connect();

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
