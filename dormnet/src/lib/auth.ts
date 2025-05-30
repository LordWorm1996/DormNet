// src/lib/auth.ts
import { NextResponse } from "next/server";
import { getSession }    from "@/lib/session";

export async function authorizeAdmin() {
  const { user } = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  // no error → proceed
}

