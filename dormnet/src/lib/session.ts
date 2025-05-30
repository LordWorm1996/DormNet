import { cookies } from "next/headers";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // Disable for HTTP local network
  sameSite: "lax" as const, // Or "none" if needed
  path: "/",
  maxAge: SESSION_MAX_AGE,
  domain: "", // Empty string allows IP access
};

interface SessionUser {
  id: string;
  email: string;
  lastActive?: number;
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
