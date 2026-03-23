import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/clients/:path*",
    "/api/projects/:path*",
    "/api/invoices/:path*",
    "/api/time/:path*",
  ],
};
