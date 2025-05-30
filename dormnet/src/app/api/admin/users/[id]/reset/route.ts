import User from "@models/User";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@utils/db";
import { authorizeAdmin } from "@lib/auth";

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

  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*";
  const generatePassword = customAlphabet(alphabet, 12);
  const newPassword = generatePassword();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await User.findByIdAndUpdate(id, {
    password: hashedPassword,
    $unset: { passwordResetToken: 1 },
  });

  return NextResponse.json({
    message: `User ${id} password changed successfully`,
    newPassword: newPassword,
  });
}
