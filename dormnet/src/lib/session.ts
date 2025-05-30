import { cookies } from "next/headers";

const SESSION_MAX_AGE = 24 * 60 * 60 * 30; // 30 days

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
  domain: "",
};

interface SessionUser {
  id: string;
  email: string;
}

interface SessionData {
  user?: SessionUser;
}

export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  return session ? JSON.parse(session) : {};
}

export async function createSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify({ user }), COOKIE_OPTIONS);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
