import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const session = await auth();
  
  // Allow access to login page without authentication
  if (pathname === "/login") {
    return NextResponse.next();
  }
  
  // Require authentication for dashboard
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
