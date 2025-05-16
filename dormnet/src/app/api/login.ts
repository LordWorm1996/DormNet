import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { getSession } from "../../lib/session";
import { connectDB } from "../../utils/db";
import User from "../../models/User";

connectDB();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const session = await getSession(req, res);
    session.user = {
      id: user._id.toString(),
      email: user.email,
    };
    await session.save();

    return res
      .status(200)
      .json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
}
