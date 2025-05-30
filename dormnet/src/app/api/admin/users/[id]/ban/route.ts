// src/app/api/admin/users/[id]/ban/route.ts

import { NextResponse }   from "next/server";
import { connectDB }      from "@/utils/db";
import { authorizeAdmin } from "@/lib/auth";
import User               from "@/models/User";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }   // ← exact Promise‐wrapped signature
) {
  // 1) Auth guard
  const authError = await authorizeAdmin();
  if (authError) return authError;

  // 2) Unpack the id
  const { id } = await params;

  // 3) Ban logic
  await connectDB();
  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  user.role = "banned";
  await user.save();

  return NextResponse.json({ message: `User ${id} has been banned` });
}
