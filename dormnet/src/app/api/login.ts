import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/lib/session";
import bcrypt from "bcrypt";
import User from "@/models/User"; // Your User model

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  // 1. Find user in DB
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 2. Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 3. Create session
  const session = await getSession(req, res);
  session.user = {
    id: user._id.toString(),
    email: user.email,
  };
  await session.save();

  return res.status(200).json({ success: true });
}
