import User from "@models/User";
import { connectDB } from "@utils/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDB();
  const { username } = await request.json();

  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await User.findByIdAndUpdate(user._id, {
    passwordResetRequested: true,
  });

  return NextResponse.json({
    message:
      "Password reset request submitted. An admin will process your request shortly.",
  });
}
