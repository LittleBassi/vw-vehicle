import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { uuid: string } }) {
  try {
    const body = await req.json();
    const cookieHeader = req.headers.get("cookie") ?? "";
    const token = cookieHeader.split(";").map(s => s.trim()).find(s => s.startsWith("token="))?.split("=")[1];
    const contentType = req.headers.get("content-type") ?? "";
    const headers: Record<string,string> = {};
    if (contentType) headers["Content-Type"] = contentType;
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/vehicles/${params.uuid}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { uuid: string } }) {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const token = cookieHeader.split(";").map(s => s.trim()).find(s => s.startsWith("token="))?.split("=")[1];
    const contentType = req.headers.get("content-type") ?? "";
    const headers: Record<string,string> = {};
    if (contentType) headers["Content-Type"] = contentType;
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/vehicles/${params.uuid}`, {
      method: "DELETE",
      headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
