import { NextResponse } from "next/server";
import { connectDB } from "@utils/db";
import User from "@models/User";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*";
const generatePassword = customAlphabet(alphabet, 12);

export async function POST(request: Request) {
  await connectDB();

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newPassword = generatePassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      $unset: { passwordResetToken: 1 },
    });

    return NextResponse.json(
      {
        success: true,
        newPassword: newPassword,
        message:
          "Password reset successfully. Please provide this temporary password to the user.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
