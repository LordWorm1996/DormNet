// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import { authorizeAdmin } from "@/lib/auth";
import User from "@/models/User";

export async function GET(req: Request) {
  const authResult = authorizeAdmin(req);
  if (authResult instanceof NextResponse) return authResult;
  await connect();
  const users = await User.find().select("-password");
  return NextResponse.json(users);
}
