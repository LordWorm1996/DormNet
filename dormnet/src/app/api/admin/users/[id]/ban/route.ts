// src/app/api/admin/users/[id]/ban/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import { authorizeAdmin } from "@/lib/auth";
import User from "@/models/User";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params;

  // 1️⃣ Authorization
  const authResult = authorizeAdmin(req);
  if (authResult instanceof NextResponse) return authResult;

  // 2️⃣ Connect to DB
  await connect();

  // 3️⃣ Find & ban
  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  user.role = "banned";
  await user.save();

  // 4️⃣ Return success
  return NextResponse.json({ message: `User ${id} banned` });
}
