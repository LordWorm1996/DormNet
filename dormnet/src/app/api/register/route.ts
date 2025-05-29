import { NextResponse } from "next/server";
import { connectDB } from "@utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { username, name, surname, email, password } = await request.json();

    if (!username || !name || !surname || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            existingUser.email === email
              ? "Email already in use"
              : "Username already taken",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      name,
      surname,
      email,
      password: hashedPassword,
      role: "user",
    });

    await user.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
