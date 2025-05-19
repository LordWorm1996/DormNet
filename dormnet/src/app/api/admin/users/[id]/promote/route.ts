import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import { authorizeAdmin } from "@/lib/auth";
import User from "@/models/User";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const authResult = authorizeAdmin(req);
  if (authResult instanceof NextResponse) return authResult;

  await connect();

  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.role = "admin";
  await user.save();

  return NextResponse.json({ message: `User ${id} promoted to admin` });
}
