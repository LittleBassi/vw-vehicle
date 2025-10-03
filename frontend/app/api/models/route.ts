import { NextResponse } from "next/server";


const envBase = process.env.NEXT_PUBLIC_API_BASE;

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const token = cookieHeader.split(";").map(s => s.trim()).find(s => s.startsWith("token="))?.split("=")[1];

    const url = `${envBase}/models`;
    const headers: Record<string,string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const r = await fetch(url, { headers, cache: "no-store" });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err) {
    console.error("GET /models proxy error:", err);
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}
