import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PIN = process.env.ADMIN_PIN || "3323";

export async function POST(request: Request) {
  const { pin } = await request.json();

  if (pin !== ADMIN_PIN) {
    return NextResponse.json({ error: "Invalid pin" }, { status: 401 });
  }

  const token = Buffer.from(`${ADMIN_PIN}:${Date.now()}`).toString("base64");

  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return NextResponse.json({ success: true });
}
