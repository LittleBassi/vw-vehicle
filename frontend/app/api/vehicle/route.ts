import { NextResponse } from "next/server";

const envBase = process.env.NEXT_PUBLIC_API_BASE;

export async function GET(req: Request) { 
    try {
        const token = req.headers.get("cookie")?.split(";").map(s => s.trim()).find(s => s.startsWith("token="))?.split("=")[1];
        
        const url = `${envBase}/vehicles`;
        const headers: Record<string,string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const response = await fetch(url, { headers, cache: "no-store" });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (err) {
        console.error("GET /vehicles proxy error:", err);
        return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
    }
}

export async function POST(req: Request) { 
    try {
        const cookieHeader = req.headers.get("cookie") ?? "";
        const token = cookieHeader.split(";").map(s => s.trim()).find(s => s.startsWith("token="))?.split("=")[1];
        const contentType = req.headers.get("content-type") ?? "";
        const bodyArrayBuffer = await req.arrayBuffer();

        const url = `${envBase}/vehicles`;
        const headers: Record<string,string> = {};
        if (contentType) headers["Content-Type"] = contentType;
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: bodyArrayBuffer
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            data = { raw: text };
        }

        return NextResponse.json(data, { status: response.status });
    } catch (err) {
        console.error("POST /vehicles proxy error:", err);
        return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
    }
}