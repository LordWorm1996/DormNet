import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import { authorizeAdmin } from "@/lib/auth";
import User from "@/models/User";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await authorizeAdmin();
  if (authError) return authError;
  const { id } = await params;

  await connectDB();
  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  user.role = "banned";
  await user.save();

  return NextResponse.json({ message: `User ${id} has been banned` });
}
