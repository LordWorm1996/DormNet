import { cookies } from "next/headers";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
const SESSION_UPDATE_AGE = 24 * 60 * 60; // Update session daily if active

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  path: "/",
  maxAge: SESSION_MAX_AGE,
  domain: undefined,
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
  if (!session) return {};

  const data: SessionData = JSON.parse(session);

  if (
    data.user?.lastActive &&
    Date.now() - data.user.lastActive < SESSION_UPDATE_AGE * 1000
  ) {
    data.user.lastActive = Date.now();
    cookieStore.set("session", JSON.stringify(data), COOKIE_OPTIONS);
  }

  return data;
}

export async function createSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify({ user }), COOKIE_OPTIONS);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
