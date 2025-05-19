// src/app/api/admin/machine/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import { authorizeAdmin } from "@/lib/auth";
import Machine from "@/models/Machine";

export async function POST(req: Request) {
  const authResult = authorizeAdmin(req);
  if (authResult instanceof NextResponse) return authResult;

  await connect();

  const { name, status } = await req.json();

  const machine = new Machine({
    name,
    status: status || "available",
  });
  await machine.save();

  return NextResponse.json(
    { message: "Machine created", machine },
    { status: 201 },
  );
}
