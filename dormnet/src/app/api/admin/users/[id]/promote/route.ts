import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@utils/db";
import { authorizeAdmin } from "@lib/auth";
import User from "@models/User";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const authResult = await authorizeAdmin();
  if (authResult instanceof NextResponse) return authResult;

  await connectDB();

  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.role = "admin";
  await user.save();

  return NextResponse.json({ message: `User ${id} promoted to admin` });
}
