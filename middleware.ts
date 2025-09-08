import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("⚙️ Middle working ...")

  const { pathname } = request.nextUrl;

  // 🌐 Public routes 
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/register"
  ];

  // 🔐 Protected routes
  const protectedRoutes = [
    "/dashboard",
    "/admin/dashboard",
    "/agent/dashboard",
    "/profile",
    "/settings",
    "/notifications"
  ];

  // 🍪 Get token and user from Cookies 
  const token = request.cookies.get("token")?.value;
  const userStr = request.cookies.get("user")?.value;
  let user = userStr ? JSON.parse(userStr) : null;

  // ⚠️ Redirect unauthenticated users
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 🛡️ Restrict access to admin routes
  if (pathname.startsWith("/admin") && (!user || !user.roles.includes(1))) {
    return NextResponse.redirect(new URL("/auth/login", request.url)); // Only role 1 (Admin) can access /admin
  }

  // 🛠️ Role-based redirection 
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && user) {
    if (pathname === "/dashboard") {
      if (user.roles.includes(1)) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (user.roles.includes(5)) {
        return NextResponse.redirect(new URL("/agent/dashboard", request.url));
      } 
      // else if (user.roles.includes(2) || user.roles.includes(3) || user.roles.includes(4) || user.roles.includes(6)) {
      //   return NextResponse.redirect(new URL("/dashboard", request.url)); // Default user dashboard
      // } else {
      //   return NextResponse.redirect(new URL("/auth/login", request.url)); // Fallback if no valid role
      // }
    }
  }

  return NextResponse.next();
}