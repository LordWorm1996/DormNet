import { getIronSession, SessionOptions } from "iron-session";
import type { NextApiRequest, NextApiResponse } from "next";

export interface SessionData {
  user?: {
    id: string;
    email: string;
  };
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "myapp_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export function getSession(req: NextApiRequest, res: NextApiResponse) {
  return getIronSession<SessionData>(req, res, sessionOptions);
}
