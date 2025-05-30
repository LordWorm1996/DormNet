import { NextResponse } from "next/server";
import { connectDB } from "@utils/db";
import { authorizeAdmin } from "@lib/auth";
import User from "@models/User";

export async function GET() {
  const authResult = await authorizeAdmin();
  if (authResult) return authResult;
  await connectDB();
  const users = await User.find().select("-password");
  return NextResponse.json(users);
}
