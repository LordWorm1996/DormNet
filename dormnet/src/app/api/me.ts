import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../lib/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession(req, res);

  if (!session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  await session.save();

  return res.status(200).json({ user: session.user });
}
