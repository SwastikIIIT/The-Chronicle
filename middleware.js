import { SignJWT } from "jose";
import { decode } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const frontendCookie = req.cookies.get("authjs.session-token");
  const backendCookie = req.cookies.get("backend_token");

  if (!frontendCookie) {
    const loginURL = new URL("/home", req.url);
    loginURL.searchParams.set("auth", "required");
    return NextResponse.redirect(loginURL);
  }

  if(frontendCookie && !backendCookie){
    try{
     const decodedToken = await decode({
            token: frontendCookie?.value,
            salt: frontendCookie?.name,
            secret: process.env.AUTH_SECRET,
        });

        if(decodedToken){
            const secret = new TextEncoder().encode(process.env.BACKEND_SECRET);
            
            const simpleToken = await new SignJWT({ 
                id: decodedToken.id, 
                email: decodedToken.email 
              })
              .setProtectedHeader({ alg: "HS256" })
              .setIssuedAt()
              .setExpirationTime("7d")
              .sign(secret);

            const response = NextResponse.next();
            response.cookies.set("backend_token",simpleToken,{
              httpOnly:true,
              secure: process.env.NODE_ENV==='production',
              sameSite:"lax",
              path:'/'
            })

            return response;
        }
      }
      catch(err){
          console.error("Bridge token error:", err);
      }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/dashboard/:path*", "/home/settings/:path*","/home/vault/:path*"],
};
