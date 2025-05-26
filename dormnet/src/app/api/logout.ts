import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/lib/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession(req, res);
  session.destroy();
  res.status(200).json({ success: true });
}
