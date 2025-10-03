import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body ?? {};

    if (!username || !password) {
  return NextResponse.json({ error: "username and password are required" }, { status: 400 });
}

  const envBase = process.env.NEXT_PUBLIC_API_BASE;

  const response = await fetch(`${envBase}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch (err) {
    console.error("Login: failed to parse JSON from auth server", err);
  }

  if (!response.ok) {
    const msg = (data && (data.error || data.message)) || `Auth server returned ${response.status}`;
    return NextResponse.json({ error: msg }, { status: response.status });
  }

  const token = data?.token;

  if (!token) {
    return NextResponse.json({ error: "No token received from auth server" }, { status: 500 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 dia
  });

    return res;
  } catch (error) {
    console.error("Login handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}