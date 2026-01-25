import { NextResponse } from "next/server";

export async function middleware(req) {
  const Cookie = req.cookies.get("authjs.session-token");

  console.log("Auth cookie found:", Cookie);

  if (!Cookie) {
    const loginURL = new URL("/home", req.url);
    loginURL.searchParams.set("auth", "required");
    return NextResponse.redirect(loginURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/dashboard/:path*", "/home/settings/:path*"],
};
