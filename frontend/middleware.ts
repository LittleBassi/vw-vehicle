import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }
    const token = req.cookies.get("token")?.value;
    const isLogin = pathname === "/login";

    if (!token && !isLogin) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token && isLogin) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
