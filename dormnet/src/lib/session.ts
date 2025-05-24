import { getIronSession, SessionOptions } from "iron-session";
import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage, ServerResponse } from "http";
import { cookies } from "next/headers";

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

// For Pages Router (API routes and getServerSideProps)
export function getSession(
  req:
    | NextApiRequest
    | (IncomingMessage & { cookies: Partial<{ [key: string]: string }> }),
  res: NextApiResponse | ServerResponse,
) {
  return getIronSession<SessionData>(
    req as NextApiRequest,
    res as NextApiResponse,
    sessionOptions,
  );
}

// For App Router (Server Components)
export async function getAppSession() {
  const cookieStore = cookies();

  const session = await getIronSession<SessionData>(
    {
      headers: {
        cookie: cookieStore.toString(),
      },
      url: "",
    } as unknown as NextApiRequest,
    {
      getHeader: () => undefined,
      setHeader: () => undefined,
    } as unknown as NextApiResponse,
    sessionOptions,
  );

  return session;
}
